let activeFilter = "main";

async function loadAdminPoems(){

    try{

        const poems = await apiRequest("/poems/admin");

        renderPoems(poems, "mesob-poem");

    }

    catch(error){

        console.error(error);

    }

}

async function loadUserPoems(){

    try{

        const poems = await apiRequest("/poems/user");

        renderPoems(poems, "mesob-poem");

    }

    catch(error){

        console.error(error);

    }

}


function reloadActiveFeed(){

    if (typeof window.onPoemsChanged === "function") {
        window.onPoemsChanged();
        return;
    }

    if (activeFilter === "main") {
        loadAdminPoems();
    } else {
        loadUserPoems();
    }

}


function renderPoems(poems, containerId = "mesob-poem") {

    const container = document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = "";

    if (!poems.length) {

        container.innerHTML =
            `<div class="empty-state">No poems here yet.</div>`;

        return;
    }

    const current = currentUser();

    poems.forEach(poem => {

        container.innerHTML += buildPoemCard(poem, current);

    });

    observeViews(container);

}




const viewedPoemIds = new Set();

function observeViews(container) {

    const cards = container.querySelectorAll(".poem-card");

    const observer = new IntersectionObserver((entries) => {

        entries.forEach((entry) => {

            if (!entry.isIntersecting) return;

            const poemId = entry.target.dataset.poemId;

            observer.unobserve(entry.target);

            if (viewedPoemIds.has(poemId)) return;

            viewedPoemIds.add(poemId);

            registerView(poemId);

        });

    }, { threshold: 0.5 });

    cards.forEach(card => observer.observe(card));

}

async function registerView(poemId) {

    try {

        const result = await apiRequest(`/poems/${poemId}/view`, "POST");

        const label = document.querySelector(`[data-views-for="${poemId}"]`);

        if (label) label.textContent = `👁 ${result.views}`;

    } catch (error) {

        console.error(error);

    }

}

function buildPoemCard(poem, current, readOnly = false) {

    const isOwner =
        !readOnly && current && current.id === poem.author_id;

    const ownerActions = isOwner
        ? `
            <div class="poem-actions">
                <button onclick="editPoem(${poem.id})">Edit</button>
                <button onclick="deletePoem(${poem.id})">Delete</button>
            </div>
        `
        : "";

    const likeClass = poem.liked_by_me ? "icon-btn liked" : "icon-btn";
    const likeIcon = poem.liked_by_me ? "❤️" : "🤍";

    const followBtn = (current && !isOwner)
        ? `
            <button
                class="${poem.following_author ? "icon-btn following" : "icon-btn"}"
                onclick="toggleFollowAuthor(${poem.author_id}, this)">
                ${poem.following_author ? "✓ Following" : "+ Follow"} ${escapeHtml(poem.username)}
            </button>
        `
        : "";

    const likeBtn = current
        ? `
            <button class="${likeClass}" onclick="toggleLike(${poem.id}, this)">
                ${likeIcon} <span class="like-count">${poem.likes || 0}</span>
            </button>
        `
        : `<span class="icon-btn">❤️ ${poem.likes || 0}</span>`;

    return `
        <div class="poem-card" data-poem-id="${poem.id}">

            <div class="poem-header">
                <h3>${escapeHtml(poem.title)}</h3>
                <span>by <a href="profile.html?id=${poem.author_id}" class="poem-author-link">${escapeHtml(poem.username)}</a></span>
            </div>

            <div class="poem-body">${escapeHtml(poem.content)}</div>

            ${ownerActions}

            <div class="poem-card-footer">
                ${likeBtn}
                <button class="icon-btn" onclick="toggleComments(${poem.id})">
                    💬 <span class="comment-count">${poem.comment_count || 0}</span>
                </button>
                ${followBtn}
                <span class="poem-meta" data-views-for="${poem.id}">👁 ${poem.views}</span>
            </div>

            <div class="comment-section hidden" id="comments-${poem.id}">
                <div class="comment-list" id="comment-list-${poem.id}"></div>
                ${current ? `
                    <form class="comment-form" onsubmit="submitComment(event, ${poem.id})">
                        <input type="text" placeholder="Write a comment..." required>
                        <button type="submit">Post</button>
                    </form>
                ` : `<p class="comment-empty">Login to join the conversation.</p>`}
            </div>

        </div>
    `;
}



async function toggleLike(poemId, button) {

    try {

        const result = await apiRequest(`/likes/${poemId}`, "POST");

        button.classList.toggle("liked");

        const isLiked = button.classList.contains("liked");

        button.querySelector(".like-count").textContent = result.likes;
        button.innerHTML = `${isLiked ? "❤️" : "🤍"} <span class="like-count">${result.likes}</span>`;

    } catch (error) {

        showMessage(error.message);
    }

}


async function toggleComments(poemId) {

    const section = document.getElementById(`comments-${poemId}`);

    if (!section) return;

    section.classList.toggle("hidden");

    if (!section.classList.contains("hidden")) {
        loadComments(poemId);
    }

}

async function loadComments(poemId) {

    const list = document.getElementById(`comment-list-${poemId}`);

    if (!list) return;

    try {

        const comments = await apiRequest(`/comments/${poemId}`);

        const current = currentUser();

        if (!comments.length) {

            list.innerHTML =
                `<div class="comment-empty">No comments yet. Be the first!</div>`;

            return;
        }

        list.innerHTML = comments.map(comment => {

            const canDelete = current && current.id === comment.user_id;

            return `
                <div class="comment-item">
                    <div class="comment-head">
                        <span class="comment-author">${escapeHtml(comment.username)}</span>
                        ${canDelete
                            ? `<button class="comment-delete" onclick="deleteCommentAndReload(${comment.id}, ${poemId})">Delete</button>`
                            : ""}
                    </div>
                    <div>${escapeHtml(comment.comment)}</div>
                </div>
            `;

        }).join("");

    } catch (error) {

        console.error(error);
    }

}

async function submitComment(event, poemId) {

    event.preventDefault();

    const input = event.target.querySelector("input");
    const comment = input.value.trim();

    if (!comment) return;

    try {

        await apiRequest(`/comments/${poemId}`, "POST", { comment });

        input.value = "";

        await loadComments(poemId);

        const card = document.querySelector(`.poem-card[data-poem-id="${poemId}"]`);

        if (card) {

            const countEl = card.querySelector(".comment-count");

            if (countEl) {
                countEl.textContent = Number(countEl.textContent) + 1;
            }
        }

    } catch (error) {

        showMessage(error.message);
    }

}

async function deleteCommentAndReload(commentId, poemId) {

    if (!confirm("Delete this comment?")) return;

    try {

        await apiRequest(`/comments/${commentId}`, "DELETE");

        await loadComments(poemId);

        const card = document.querySelector(`.poem-card[data-poem-id="${poemId}"]`);

        if (card) {

            const countEl = card.querySelector(".comment-count");

            if (countEl) {
                countEl.textContent = Math.max(0, Number(countEl.textContent) - 1);
            }
        }

    } catch (error) {

        showMessage(error.message);
    }

}


async function toggleFollowAuthor(authorId, button) {

    try {

        const result = await apiRequest(`/follows/${authorId}`, "POST");

        const nowFollowing = result.message === "User followed.";

        button.classList.toggle("following", nowFollowing);

        const name = button.textContent.replace(/^(✓ Following|\+ Follow)\s*/, "");

        button.textContent = `${nowFollowing ? "✓ Following" : "+ Follow"} ${name}`;

    } catch (error) {

        showMessage(error.message);
    }

}


const modal = document.getElementById("poemModal");
const newPoemBtn = document.getElementById("newPoemBtn");
const cancelBtn = document.getElementById("cancelModal");

if (newPoemBtn) {

    newPoemBtn.addEventListener("click", () => {

        document.getElementById("poemForm").reset();
        document.getElementById("poemId").value = "";
        document.getElementById("modalTitle").textContent = "Write a Poem";

        modal.classList.remove("hidden");

    });

}

if (cancelBtn) {

    cancelBtn.addEventListener("click", () => {

        modal.classList.add("hidden");

    });

}

const poemForm = document.getElementById("poemForm");

if (poemForm) {

    poemForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const id = document.getElementById("poemId").value;
        const title = document.getElementById("poemTitle").value;
        const content = document.getElementById("poemContent").value;

        try {

            if (id) {
                await apiRequest(`/poems/${id}`, "PUT", { title, content });
            } else {
                await apiRequest("/poems", "POST", { title, content });
            }

            modal.classList.add("hidden");

            reloadActiveFeed();

        } catch (error) {

            showMessage(error.message);
        }

    });

}

async function deletePoem(id) {

    if (!confirm("Delete this poem?")) return;

    try {

        await apiRequest(`/poems/${id}`, "DELETE");

        reloadActiveFeed();

    } catch (error) {

        showMessage(error.message);
    }

}

async function editPoem(id) {

    try {

        const poem = await apiRequest(`/poems/${id}`);

        document.getElementById("poemId").value = poem.id;
        document.getElementById("poemTitle").value = poem.title;
        document.getElementById("poemContent").value = poem.content;
        document.getElementById("modalTitle").textContent = "Edit Poem";

        modal.classList.remove("hidden");

    } catch (error) {

        showMessage(error.message);
    }

}


function setupFilters(){

    const buttons = document.querySelectorAll(".filter-btn");

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            buttons.forEach(btn => btn.classList.remove("active"));

            button.classList.add("active");

            activeFilter = button.dataset.filter;

            reloadActiveFeed();

        });

    });

}




function setupUserSearch() {

    const form = document.getElementById("userSearchForm");

    if (!form) return;

    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        const query = document.getElementById("userSearchInput").value.trim();

        if (!query) return;

        const resultsContainer = document.getElementById("userSearchResults");

        try {

            const users = await apiRequest(
                `/users/search?username=${encodeURIComponent(query)}`
            );

            renderUserResults(users, resultsContainer);

        } catch (error) {

            showMessage(error.message);
        }

    });

}

function renderUserResults(users, container) {

    const current = currentUser();

    const others = users.filter(user => !current || user.id !== current.id);

    if (!others.length) {

        container.innerHTML =
            `<div class="empty-state">No users found.</div>`;

        return;
    }

    container.innerHTML = others.map(user => `
        <div class="user-result">
            <a href="profile.html?id=${user.id}" class="profile-avatar">${avatarInitial(user.username)}</a>
            <div class="user-result-info">
                <a href="profile.html?id=${user.id}" class="username">${escapeHtml(user.username)}</a>
                <div class="bio">${escapeHtml(user.bio || "No bio yet.")}</div>
            </div>
            ${current
                ? `<button class="icon-btn" onclick="toggleFollowAuthor(${user.id}, this)">+ Follow ${escapeHtml(user.username)}</button>`
                : ""}
        </div>
    `).join("");

}

document.addEventListener("DOMContentLoaded", () => {

    if (document.getElementById("mesob-poem")) {

        loadAdminPoems();
        setupFilters();
        setupUserSearch();
    }

});
