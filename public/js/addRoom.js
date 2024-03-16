var errorDisplayed = false;

document.getElementById("rentform").addEventListener("submit", function (event) {
    errorDisplayed = false;
    clearErrorMessages();

    var isValid = true;

    if (!validateField("title", "titleError", "Please enter the title")) {
        isValid = false;
    }
    if (!validateField("price", "priceError", "Please enter the price")) {
        isValid = false;
    }
    if (!validateField("roomContactNum", "roomContactNumError", "Please enter the contact number")) {
        isValid = false;
    } else if (!validateContactNum("roomContactNum", "roomContactNumError", "Contact number should be 10 digits")) {
        isValid = false;
    }
    if (!validateField("roomAddress", "roomAddressError", "Please enter the address")) {
        isValid = false;
    }
    // Add validation for roomImage if required
    if (!validateField("description", "descriptionError", "Please enter the description")) {
        isValid = false;
    }

    if (!isValid) {
        event.preventDefault();
    }
});

document.getElementById("title").addEventListener("input", function () {
    clearErrorMessage("titleError");
});

document.getElementById("price").addEventListener("input", function () {
    clearErrorMessage("priceError");
});

document.getElementById("roomContactNum").addEventListener("input", function () {
    clearErrorMessage("roomContactNumError");
});

document.getElementById("roomAddress").addEventListener("input", function () {
    clearErrorMessage("roomAddressError");
});

// Add event listeners for other fields if required

function validateContactNum(fieldId, errorId, errorMessage) {
    var field = document.getElementById(fieldId);
    var error = document.getElementById(errorId);

    if (field.value.length !== 10) {
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