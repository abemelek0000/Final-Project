document.addEventListener("DOMContentLoaded", () => {

    if (!isLoggedIn() || !isAdmin()) {

        showMessage("Admin access required.");
        redirect("home.html");
        return;
    }

    setupTabs();
    setupBookModal();

    loadBooks();
    loadPoems();

});



function setupTabs() {

    const tabButtons = document.querySelectorAll(".admin-tab-btn");

    tabButtons.forEach(button => {

        button.addEventListener("click", () => {

            tabButtons.forEach(btn => btn.classList.remove("active"));
            document.querySelectorAll(".admin-panel").forEach(panel =>
                panel.classList.remove("active")
            );

            button.classList.add("active");

            document
                .getElementById(`panel-${button.dataset.tab}`)
                .classList.add("active");

        });

    });

}



let booksCache = [];

async function loadBooks() {

    try {

        booksCache = await apiRequest("/books");

        renderBooksTable(booksCache);

    } catch (error) {

        console.error(error);
    }

}

function renderBooksTable(books) {

    const tbody = document.getElementById("booksTableBody");

    if (!books.length) {

        tbody.innerHTML =
            `<tr><td colspan="6">No book recommendations yet.</td></tr>`;

        return;
    }

    tbody.innerHTML = books.map(book => `
        <tr>
            <td>${book.cover_image ? escapeHtml(book.cover_image) : "—"}</td>
            <td>${escapeHtml(book.title)}</td>
            <td>${escapeHtml(book.author)}</td>
            <td>${escapeHtml(book.username)}</td>
            <td>${formatDate(book.created_at)}</td>
            <td class="actions">
                <button onclick="openBookModalById(${book.id})">Edit</button>
                <button class="btn-danger" onclick="deleteBookRow(${book.id})">Delete</button>
            </td>
        </tr>
    `).join("");

}

function openBookModalById(id) {

    const book = booksCache.find(b => b.id === id);

    openBookModal(book || null);

}

function setupBookModal() {

    const modal = document.getElementById("bookModal");
    const newBookBtn = document.getElementById("newBookBtn");
    const cancelBtn = document.getElementById("cancelBookModal");
    const form = document.getElementById("bookForm");

    newBookBtn.addEventListener("click", () => {
        openBookModal();
    });

    cancelBtn.addEventListener("click", () => {
        modal.classList.add("hidden");
    });

    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        const id = document.getElementById("bookId").value;

        const payload = {
            title: document.getElementById("bookTitle").value,
            author: document.getElementById("bookAuthorInput").value,
            description: document.getElementById("bookDescriptionInput").value,
            cover_image: document.getElementById("bookCoverInput").value
        };

        try {

            if (id) {
                await apiRequest(`/admin/books/${id}`, "PUT", payload);
            } else {
                await apiRequest("/admin/books", "POST", payload);
            }

            modal.classList.add("hidden");

            loadBooks();

        } catch (error) {

            showMessage(error.message);
        }

    });

}

function openBookModal(book = null) {

    const modal = document.getElementById("bookModal");

    document.getElementById("bookForm").reset();

    if (book) {

        document.getElementById("bookModalTitle").textContent = "Edit Book";
        document.getElementById("bookId").value = book.id;
        document.getElementById("bookTitle").value = book.title;
        document.getElementById("bookAuthorInput").value = book.author;
        document.getElementById("bookDescriptionInput").value = book.description;
        document.getElementById("bookCoverInput").value = book.cover_image || "";

    } else {

        document.getElementById("bookModalTitle").textContent = "Add Book";
        document.getElementById("bookId").value = "";
    }

    modal.classList.remove("hidden");

}

async function deleteBookRow(id) {

    if (!confirm("Delete this book recommendation?")) return;

    try {

        await apiRequest(`/admin/books/${id}`, "DELETE");

        loadBooks();

    } catch (error) {

        showMessage(error.message);
    }

}



async function loadPoems() {

    try {

        const poems = await apiRequest("/poems");

        renderPoemsTable(poems);

    } catch (error) {

        console.error(error);
    }

}

function renderPoemsTable(poems) {

    const tbody = document.getElementById("poemsTableBody");

    if (!poems.length) {

        tbody.innerHTML =
            `<tr><td colspan="8">No poems yet.</td></tr>`;

        return;
    }

    tbody.innerHTML = poems.map(poem => `
        <tr>
            <td>${escapeHtml(poem.title)}</td>
            <td>${escapeHtml(poem.username)}</td>
            <td><span class="source-badge ${poem.source_type}">${poem.source_type}</span></td>
            <td>${poem.views}</td>
            <td>${poem.likes || 0}</td>
            <td>${poem.comment_count || 0}</td>
            <td>${formatDate(poem.created_at)}</td>
            <td class="actions">
                <button class="btn-danger" onclick="deletePoemRow(${poem.id})">Delete</button>
            </td>
        </tr>
    `).join("");

}

async function deletePoemRow(id) {

    if (!confirm("Delete this poem? This cannot be undone.")) return;

    try {

        await apiRequest(`/admin/poems/${id}`, "DELETE");

        loadPoems();

    } catch (error) {

        showMessage(error.message);
    }

}
