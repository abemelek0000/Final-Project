const profileParams = new URLSearchParams(window.location.search);
const viewedUserId = profileParams.get("id");
const isOwnProfile = !viewedUserId;


window.onPoemsChanged = () => {
    if (isOwnProfile) loadProfile();
};

document.addEventListener("DOMContentLoaded", () => {

    if (isOwnProfile && !isLoggedIn()) {
        redirect("login.html");
        return;
    }

    loadProfile();
    setupBioEditor();

});

async function loadProfile() {

    try {

        const user = isOwnProfile
            ? await apiRequest("/auth/profile")
            : await apiRequest(`/users/${viewedUserId}`);

        document.getElementById("profileAvatar").textContent =
            avatarInitial(user.username);

        document.getElementById("profileUsername").textContent =
            user.username;

        document.getElementById("profileBio").textContent =
            user.bio || "No bio yet.";

        document.getElementById("profileRole").textContent =
            user.role;

        const followerData = await apiRequest(`/follows/${user.id}/count`);

        document.getElementById("profileFollowerCount").textContent =
            followerData.followers;

        setupProfileMode(user);

        loadProfilePoems(user.id);

    } catch (error) {

        console.error(error);
        showMessage(error.message);
    }

}

function setupProfileMode(user) {

    const heading = document.getElementById("poemsHeading");
    const newPoemBtn = document.getElementById("newPoemBtn");
    const editBioBtn = document.getElementById("editBioBtn");
    const followWrap = document.getElementById("profileFollowWrap");

    if (isOwnProfile) {

        heading.textContent = "My Poems";

        if (editBioBtn) editBioBtn.style.display = "inline-block";

        if (followWrap) followWrap.style.display = "none";

        return;
    }

   
    heading.textContent = `${user.username}'s Poems`;

    if (newPoemBtn) newPoemBtn.style.display = "none";
    if (editBioBtn) editBioBtn.style.display = "none";

    const current = currentUser();

    if (followWrap && current && current.id !== user.id) {

        followWrap.style.display = "block";

        followWrap.innerHTML = `
            <button class="icon-btn" onclick="toggleFollowAuthor(${user.id}, this)">
                + Follow ${escapeHtml(user.username)}
            </button>
        `;

    } else if (followWrap) {

        followWrap.style.display = "none";

    }

}

async function loadProfilePoems(userId) {

    try {

        const poems = isOwnProfile
            ? await apiRequest("/poems/mine")
            : await apiRequest(`/poems/by-author/${userId}`);

        document.getElementById("profilePoemCount").textContent = poems.length;

       
        renderPoems(poems, "myPoemsList", !isOwnProfile);

    } catch (error) {

        console.error(error);
    }

}



function setupBioEditor() {

    const editBtn = document.getElementById("editBioBtn");
    const form = document.getElementById("bioForm");
    const textarea = document.getElementById("bioInput");
    const bioText = document.getElementById("profileBio");
    const cancelBtn = document.getElementById("cancelBioEdit");

    if (!editBtn || !isOwnProfile) return;

    editBtn.addEventListener("click", () => {

        textarea.value = bioText.textContent === "No bio yet."
            ? ""
            : bioText.textContent;

        form.classList.remove("hidden");
        editBtn.style.display = "none";

    });

    cancelBtn.addEventListener("click", () => {

        form.classList.add("hidden");
        editBtn.style.display = "inline-block";

    });

    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        try {

            const result = await apiRequest("/auth/profile", "PUT", {
                bio: textarea.value.trim()
            });

            saveUser(result.user);

            bioText.textContent = result.user.bio || "No bio yet.";

            form.classList.add("hidden");
            editBtn.style.display = "inline-block";

            showMessage("Bio updated.");

        } catch (error) {

            showMessage(error.message);

        }

    });

}
