
async function handleLogin() {
    clearErrors();

    const username = document.getElementById("user").value;
    const password = document.getElementById("pass").value;
    const rememberMe = document.getElementById("remember").checked;
    let valid = true;

    if (!username) {
        showError(document.getElementById("user"), "Username is required");
        valid = false;
    }

    if (!password) {
        showError(document.getElementById("pass"), "Password is required");
        valid = false;
    }

    if (!valid) {
        return;
    }

    if (rememberMe) {
        localStorage.setItem("rememberedUsername", username);
    } else {
        localStorage.removeItem("rememberedUsername");
    }
    try {
        const response = await fetch("http://localhost:8080/login", {
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
            window.location.replace("message.html");
        } else {
            showError(document.getElementById("pass"), result.message);
        }
    } catch (error) {
        showError(
            document.getElementById("pass"),
            "Login failed. Please try again."
        );
    }
}

async function handleRegister() {
    clearErrors();

    const username = document.getElementById("registerUser").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPass").value;

    let valid = true;

    if (!username) {
        showError(document.getElementById("registerUser"), "Username is required");
        valid = false;
    }

    if (!email) {
        showError(document.getElementById("registerEmail"), "Email is required");
        valid = false;
    }

    if (!password) {
        showError(document.getElementById("registerPass"), "Password is required");
        valid = false;
    }

    if (!valid) {
        return;
    }

    try {
        const response = await fetch("/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, email, password })
        });

        const result = await response.json();

        if (response.ok) {
            alert("Registration successful");
            closeModal("registerModal");
        } else {
            showError(document.getElementById("registerPass"), result.message);
        }
    } catch (error) {
        showError(
            document.getElementById("registerPass"),
            "Registration failed. Please try again."
        );
    }
}

async function handleForgotPassword() {
    clearErrors();

    const email = document.getElementById("forgotEmail").value;

    if (!email) {
        showError(document.getElementById("forgotEmail"), "Email is required");
        return;
    }

    try {
        const response = await fetch("/forgot-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        });

        const result = await response.json();

        if (response.ok) {
            alert("Password reset link sent to your email");
            closeModal("forgotPasswordModal");
        } else {
            showError(document.getElementById("forgotEmail"), result.message);
        }
    } catch (error) {
        showError(
            document.getElementById("forgotEmail"),
            "Password reset failed. Please try again."
        );
    }
}















document.addEventListener("DOMContentLoaded", (event) => {
    const savedUsername = localStorage.getItem("rememberedUsername");

    if (savedUsername) {
        document.getElementById("user").value = savedUsername;

        document.getElementById("remember").checked = true;
    }





    // ALL THE GRAPHICAL ELEMENTS

    document

        .getElementById("togglePassword")

        .addEventListener("click", function () {
            const passwordField = document.getElementById("pass");

            const type =
                passwordField.getAttribute("type") === "password" ? "text" : "password";

            passwordField.setAttribute("type", type);

            this.classList.toggle("bx-hide");

            this.classList.toggle("bx-show");
        });

    document

        .querySelector(".forgot a")

        .addEventListener("click", function (event) {
            event.preventDefault();

            openModal("forgotPasswordModal");
        });

    document
        .querySelector(".register a")
        .addEventListener("click", function (event) {
            event.preventDefault();
            openModal("registerModal");
        });

    function openModal(modalId) {
        document.getElementById(modalId).style.display = "block";
    }

    function closeModal(modalId) {
        document.getElementById(modalId).style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target.classList.contains("modal")) {
            event.target.style.display = "none";
        }
    };

    window.closeModal = closeModal;
});

function showError(element, message) {
    const errorSpan = document.createElement("span");
    errorSpan.className = "error-message";
    errorSpan.textContent = message;
    element.parentElement.appendChild(errorSpan);
}

function clearErrors() {
    const errors = document.querySelectorAll(".error-message");
    errors.forEach((error) => error.remove());
}


function checkPasswordStrength(password) {
    const strengthIndicator = document.getElementById("passwordStrength");
    updatePasswordStrength(password, strengthIndicator);
}

function checkPasswordStrengthRegister(password) {
    const strengthIndicator = document.getElementById("passwordStrengthRegister");
    updatePasswordStrength(password, strengthIndicator);
}

function updatePasswordStrength(password, strengthIndicator) {
    // Reset indicator
    strengthIndicator.textContent = "";

    // Define criteria
    const minLength = 8;
    const minUpper = 1;
    const minLower = 1;
    const minNumbers = 1;
    const minSpecial = 1;

    let strength = 0;

    // Check length
    if (password.length >= minLength) {
        strength++;
    }

    // Check uppercase letters
    if (/[A-Z]/.test(password) && password.match(/[A-Z]/g).length >= minUpper) {
        strength++;
    }

    // Check lowercase letters
    if (/[a-z]/.test(password) && password.match(/[a-z]/g).length >= minLower) {
        strength++;
    }

    // Check numbers
    if (/\d/.test(password) && password.match(/\d/g).length >= minNumbers) {
        strength++;
    }

    // Check special characters
    if (
        /[^a-zA-Z0-9]/.test(password) &&
        password.match(/[^a-zA-Z0-9]/g).length >= minSpecial
    ) {
        strength++;
    }

    // Update strength indicator
    switch (strength) {
        case 0:
        case 1:
            strengthIndicator.textContent = "Weak";
            strengthIndicator.style.color = "red";
            break;
        case 2:
        case 3:
            strengthIndicator.textContent = "Medium";
            strengthIndicator.style.color = "orange";
            break;
        case 4:
        case 5:
            strengthIndicator.textContent = "Strong";
            strengthIndicator.style.color = "green";
            break;
        default:
            break;
    }
}
