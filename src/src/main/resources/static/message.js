const username = sessionStorage.getItem("username");
const password = sessionStorage.getItem("password");


// load the messages


try {
    const response = await fetch("http://localhost:8080/chatlist", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    });

    const result = await response.json();
    if (response.ok) {
        sessionStorage.setItem("username", username);
        sessionStorage.setItem("password", password);
        window.location.href = "message.html";
    } else {
        showError(document.getElementById("pass"), result.message);
    }
} catch (error) {
    showError(
        document.getElementById("pass"),
        "Login failed. Please try again."
    );
}