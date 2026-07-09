const form = document.getElementById("registerForm");

form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const username =
        document.getElementById("username").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {

        showMessage("Passwords do not match.");

        return;

    }

    try {

        await register(
            username,
            email,
            password
        );

        showMessage("Registration successful!");

        redirect("login.html");

    }

    catch (error) {

        showMessage(error.message);

    }

});