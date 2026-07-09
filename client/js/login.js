const form = document.getElementById("loginForm");

form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    try {

        await login(email, password);

        showMessage("Login successful!");

        redirect("home.html");

    }

    catch(error){

        showMessage(error.message);

    }

});