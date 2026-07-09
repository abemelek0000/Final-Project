function renderNavbar() {

    const nav = document.getElementById("navbar");

    if (!nav) return;

    let links = `
        <a href="home.html">ቤት-ለእንግዳ</a>
        <a href="poems.html">መሶብ</a>
    `;

    if (!isLoggedIn()) {

        links += `
            <a href="login.html">ይግቡ</a>
            <a href="register.html">ይመዝገቡ</a>
        `;

    } else {

        links += `
            <a href="profile.html">ጓዳ</a>
        `;

        if (isAdmin()) {

            links += `
                <a href="admin.html">አስተዳዳሪ</a>
            `;

        }

        links += `
            <a href="#" id="logoutBtn">መውጫ</a>
        `;

    }

    nav.innerHTML = links;

    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {

        logoutBtn.addEventListener("click", logout);

    }

}

document.addEventListener("DOMContentLoaded", renderNavbar);