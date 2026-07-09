function saveToken(token) {
    localStorage.setItem("token", token);
}

function getToken() {
    return localStorage.getItem("token");
}

function removeToken() {
    localStorage.removeItem("token");
}

function saveUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
}

function getUser() {

    const user = localStorage.getItem("user");

    if (!user || user === "undefined") {

        return null;

    }

    try {

        return JSON.parse(user);

    } catch (error) {

        console.error("Invalid user in localStorage.");

        removeUser();

        return null;

    }

}

function removeUser() {
    localStorage.removeItem("user");
}