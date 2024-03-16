var errorDisplayed = false;

document.getElementById("registrationForm").addEventListener("submit", function (event) {
    errorDisplayed = false;
    clearErrorMessages();

    var isValid = true;

    if (!validateField("fullName", "fullNameError", "Please enter your full name")) {
        isValid = false;
    }
    if (!validateField("contactNum", "contactNumError", "Please enter your contact number")) {
        isValid = false;
    } else if (!validateContactNum("contactNum", "contactNumError", "Contact Number should be of 10 digits")) {
        isValid = false;
    }
    if (!validateField("address", "addressError", "Please enter your address")) {
        isValid = false;
    }
    if (!validateField("gender", "genderError", "Please select your gender")) {
        isValid = false;
    }
    if (!validateEmailField("email", "emailError")) {
        isValid = false;
    }
    if (!validatePasswordField("password", "passwordError")) {
        isValid = false;
    }
    if (!validateConfirmPasswordField("confirm_password", "confirmPasswordError")) {
        isValid = false;
    }

    if (!isValid) {
        event.preventDefault();
    }
});

document.getElementById("fullName").addEventListener("input", function () {
    clearErrorMessage("fullNameError");
});

document.getElementById("contactNum").addEventListener("input", function () {
    clearErrorMessage("contactNumError");
});

document.getElementById("address").addEventListener("input", function () {
    clearErrorMessage("addressError");
});

document.getElementById("email").addEventListener("input", function () {
    clearErrorMessage("emailError");
});

document.getElementById("password").addEventListener("input", function () {
    clearErrorMessage("passwordError");
});

document.getElementById("confirm_password").addEventListener("input", function () {
    clearErrorMessage("confirmPasswordError");
});

function validateContactNum(fieldId, errorId, errorMessage) {
    var field = document.getElementById(fieldId);
    var error = document.getElementById(errorId);

    if (field.value.length < 10) {
        if (!errorDisplayed) {
            error.innerHTML = errorMessage;
            field.focus();
            errorDisplayed = true;
        }
        return false;
    } else {
        error.innerHTML = "";
    }
    return true;
}

function validateField(fieldId, errorId, errorMessage) {
    var field = document.getElementById(fieldId);
    var error = document.getElementById(errorId);

    if (field.value.trim() === "") {
        if (!errorDisplayed) {
            error.innerHTML = errorMessage;
            field.focus();
            errorDisplayed = true;
        }
        return false;
    } else {
        error.innerHTML = "";
    }
    return true;
}

function isValidEmail(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateEmailField(fieldId, errorId) {
    var field = document.getElementById(fieldId);
    var error = document.getElementById(errorId);
    var email = field.value.trim();

    if (email === "") {
        if (!errorDisplayed) {
            error.innerHTML = "Please enter your email";
            field.focus();
            errorDisplayed = true;
        }
        return false;
    } else if (!isValidEmail(email)) {
        if (!errorDisplayed) {
            error.innerHTML = "Please enter a valid email address";
            field.focus();
            errorDisplayed = true;
        }
        return false;
    } else {
        error.innerHTML = "";
    }
    return true;
}

function isValidPassword(password) {
    var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
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
            error.innerHTML = "Password must contain at least one uppercase letter, one lowercase letter, one digit, and be at least 8 characters long";
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
    var password = document.getElementById("password").value.trim();

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
