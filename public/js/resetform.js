document.getElementById("loginForm").addEventListener("submit", function (event) {
    errorDisplayed = false;
    clearErrorMessages();

    var isValid = true;
    if (!validatePasswordField("new-password", "newPasswordError")) {
        isValid = false;
    }
    if (!validateConfirmPasswordField("confirm-password", "confirmPasswordError")) {
        isValid = false;
    }

    if (!isValid) {
        event.preventDefault();
    }
});
document.getElementById("new-password").addEventListener("input", function () {
    clearErrorMessage("newPasswordError");
});

document.getElementById("confirm-password").addEventListener("input", function () {
    clearErrorMessage("confirmPasswordError");
});
function isValidPassword(password) {
    var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$,.@!^#]).{6,}$/;
    return passwordRegex.test(password);    
}

function validatePasswordField(fieldId, errorId) {
    var field = document.getElementById(fieldId);
    var error = document.getElementById(errorId);
    var password = field.value.trim();

    if (password === "") {
        if (!errorDisplayed) {
            error.innerHTML = "Please enter a password";
            field.focus();
            errorDisplayed = true;
        }
        return false;
    } else if (!isValidPassword(password)) {
        if (!errorDisplayed) {
            error.innerHTML = "Password must contain at least one uppercase letter, one lowercase letter, one digit,one special character and be at least 6 characters long";
            field.focus();
            errorDisplayed = true;
        }
        return false;
    } else {
        error.innerHTML = "";
    }
    return true;
}

function validateConfirmPasswordField(fieldId, errorId) {
    var field = document.getElementById(fieldId);
    var error = document.getElementById(errorId);
    var confirmPassword = field.value.trim();
    var password = document.getElementById("new-password").value.trim();

    if (confirmPassword === "") {
        if (!errorDisplayed) {
            error.innerHTML = "Please confirm your password";
            field.focus();
            errorDisplayed = true;
        }
        return false;
    } else if (password !== confirmPassword) {
        if (!errorDisplayed) {
            error.innerHTML = "Passwords do not match";
            field.focus();
            errorDisplayed = true;
        }
        return false;
    } else {
        error.innerHTML = "";
    }
    return true;
}

function clearErrorMessage(errorId) {
    var error = document.getElementById(errorId);
    error.innerHTML = "";
}

function clearErrorMessages() {
    var errorElements = document.querySelectorAll(".error");
    errorElements.forEach(function (error) {
        error.innerHTML = "";
    });
}
