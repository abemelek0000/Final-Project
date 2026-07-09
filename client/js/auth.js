async function login(email, password) {

    const data = await apiRequest(
        "/auth/login",
        "POST",
        {
            email,
            password
        }
    );

    saveToken(data.token);

    saveUser(data.user);

    return data;

}

async function register(username, email, password) {

    return await apiRequest("/auth/register", "POST", {
        username,
        email,
        password
    });

}

function logout() {

    removeToken();

    removeUser();

    window.location.href = "login.html";

}

function currentUser() {

    return getUser();

}

function isLoggedIn() {

    return getUser() !== null;

}

function isAdmin() {

    const user = getUser();

    return user && user.role === "ADMIN";

}