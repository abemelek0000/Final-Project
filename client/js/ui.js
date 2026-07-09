function showMessage(message) {

    alert(message);

}

function redirect(page) {

    window.location.href = page;

}


function escapeHtml(value) {

    const div = document.createElement("div");

    div.textContent = value ?? "";

    return div.innerHTML;

}


function formatDate(dateString) {

    if (!dateString) return "";

    const date = new Date(dateString);

    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric"
    });

}


function avatarInitial(username) {

    return (username || "?").trim().charAt(0).toUpperCase();

}