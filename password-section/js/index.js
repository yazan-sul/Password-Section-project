const touchedFields = {
    currentPassword: false,
    newPassword: false,
    rePassword: false,
};

function togglePasswordVisibility(fieldId) {
    const field = document.getElementById(fieldId);
    if (field.type === "password") {
        field.type = "text";
    } else {
        field.type = "password";
    }
}
function handleFieldFocus(fieldId) {
    touchedFields[fieldId] = true;

    if (fieldId === "rePassword" && !document.getElementById(fieldId).value) {
        document.getElementById("confirm-error").style.display = "none";
        document.getElementById(fieldId).style.borderColor = "";
    }
}

function validatePassword() {
    const password = document.getElementById("newPassword").value;
    const passwordFiled = document.getElementById("newPassword");
    const errorElement = document.getElementById("password-error");

    const unmetCriteria = [];

    // Only show validation if field has been touched or has content
    if (!touchedFields.newPassword && !password) {
        passwordFiled.style.borderColor = "";
        passwordFiled.style.boxShadow = "";
        errorElement.textContent = "";
        errorElement.style.display = "none";
        return { isValid: false, unmetCriteria: [] };
    }

    const lengthVaild = password.length >= 8 && password.length <= 64;
    document.getElementById("length-req").classList.toggle("valid", lengthVaild);
    if (!lengthVaild) unmetCriteria.push("8–64 characters");

    const upperVaild = /[A-Z]/.test(password);
    document.getElementById("upper-req").classList.toggle("valid", upperVaild);
    if (!upperVaild) unmetCriteria.push("one uppercase letter");

    const lowerVaild = /[a-z]/.test(password);
    document.getElementById("lower-req").classList.toggle("valid", lowerVaild);
    if (!lowerVaild) unmetCriteria.push("one lowercase letter");

    const numberVaild = /\d/.test(password);
    document.getElementById("number-req").classList.toggle("valid", numberVaild);
    if (!numberVaild) unmetCriteria.push("one number");

    const specialVaild = /[!@#$%^&*]/.test(password);
    document
        .getElementById("special-req")
        .classList.toggle("valid", specialVaild);
    if (!specialVaild) unmetCriteria.push("at least one special char");

    const isValid =
        lengthVaild && upperVaild && lowerVaild && numberVaild && specialVaild;
    // if not vaild and touched it will show error message
    if (!isValid && (touchedFields.newPassword || password)) {
        passwordFiled.style.borderColor = "red";
        errorElement.textContent =
            "Password must have: " + unmetCriteria.join(", ");
        errorElement.style.display = "block";
    } else {
        passwordFiled.style.borderColor = isValid ? "#4CAF50" : "";
        errorElement.style.display = "none";
    }

    return { isValid, unmetCriteria };
}
function matchPassword() {
    const password = document.getElementById("newPassword").value;
    const repassword = document.getElementById("rePassword").value;

    const confirmField = document.getElementById("rePassword");

    if (!touchedFields.rePassword && !repassword) {
        confirmField.style.borderColor = "";
        errorElement.style.display = "none";
        return false;
    }
    if (password === repassword) {
        confirmField.style.borderColor = "#4CAF50";
        confirmField.style.boxShadow = "0 0 0 2px rgba(76, 175, 80, 0.2)";
    } else {
        confirmField.style.borderColor = "red";
        return false;
    }
    return password === repassword;
}

async function submitPasswordChange() {
    const saveButton = document.getElementById("saveButton");
    const currentPassword = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const rePassword = document.getElementById("rePassword").value;

    touchedFields.currentPassword = true;
    touchedFields.newPassword = true;
    touchedFields.rePassword = true;

    errorElement.textContent = "";
    errorElement.style.display = "none";

    const passwordValidation = validatePassword();
    if (!passwordValidation.isValid) {
        if (newPassword.length <= 0) {
            document.getElementById("password-error").textContent =
                "Please enter a new password";
            document.getElementById("password-error").style.display = "block";
            document.getElementById("newPassword").style.borderColor = "red";
        }
        return;
    }

    if (!matchPassword()) {
        return;
    }

    if (currentPassword === newPassword) {
        document.getElementById("password-error").textContent =
            "new password must be different form current password";
        document.getElementById("password-error").style.display = "block";
        document.getElementById("newPassword").style.borderColor = "red";
        return;
    }
    if (!currentPassword) {
        currentErrorElement.textContent = "Please enter your current password";
        currentErrorElement.style.display = "block";
        document.getElementById("currentPassword").style.borderColor = "red";
        return;
    }

    saveButton.disabled = true;
    saveButton.textContent = "Saving...";

    try {
        const response = await fetch(
            "https://www.greatfrontend.com/api/projects/challenges/auth/change-password",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: "1234",
                    password: currentPassword,
                    new_password: newPassword,
                })
            });
        if (response.status === 403) {
            throw new Error('FORNIDDEN');
        }

        const result = await response.json();

        if (response.ok) {
            document.getElementById('currentPassword').value = '';
            document.getElementById('newPassword').value = '';
            document.getElementById('rePassword').value = '';
            document.getElementById('currentPassword').value = '';
            document.querySelectorAll('.requirement').forEach(el => el.classList.remove('valid'));

        } else {
            throw new Error(result.message || "Failed to change password");
        }
    } catch (error) {
        saveButton.textContent = "Network Error";
        saveButton.style.backgroundColor = "#f44336";
        console.error("Fetch Error:", error);
    } finally {
        saveButton.disabled = false;
        saveButton.textContent = 'Save';
        saveButton.style.backgroundColor = '';
    }

}
