async function loadHomePage() {

    try {

        const [featuredPoem, latestBook] = await Promise.all([

            apiRequest("/poems/featured"),
            apiRequest("/books/latest")

        ]);

        document.getElementById("featuredPoem").textContent =
            featuredPoem.content;

        document.getElementById("featuredAuthor").textContent =
            featuredPoem.username;

            document.getElementById("bookTitle").textContent =
            latestBook.title;

        document.getElementById("bookDescription").textContent =
            latestBook.description;

        document.getElementById("bookAuthor").textContent =
            latestBook.author;

        document.getElementById("bookName").textContent =
            latestBook.title;

        document.getElementById("bookCover").src =
            "Image/" + latestBook.cover_image;

    } catch (error) {

        console.error(error);

    }

}

document.addEventListener("DOMContentLoaded", loadHomePage);