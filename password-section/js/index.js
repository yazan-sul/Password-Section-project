function togglePasswordVisibility(fieldId) {
    const field = document.getElementById(fieldId);
    if (field.type === 'password') {
        field.type = 'text';  // Show plain text
    } else {
        field.type = 'password';  // Hide with dots
    }
}

function validatePassword() {
    const password = document.getElementById('newPassword').value;

    const lengthVaild = password.length >= 8 && password.length <= 64;
    document.getElementById('length-req').classList.toggle('valid', lengthVaild);

    const upperVaild = /[A-Z]/.test(password);
    document.getElementById('upper-req').classList.toggle('valid', upperVaild)

    const lowerVaild = /[a-z]/.test(password);
    document.getElementById('lower-req').classList.toggle('valid', lowerVaild)

    const numberVaild = /[0-9]/.test(password);
    document.getElementById('number-req').classList.toggle('valid', numberVaild)

    const specialVaild = /[!@#$%^&*]/.test(password);
    document.getElementById('special-req').classList.toggle('valid', specialVaild)
    
    return lengthVaild && upperVaild && lowerVaild && numberVaild && specialVaild;
}
function matchPassword() {
    const password = document.getElementById('newPassword').value;
    const repassword = document.getElementById('rePassword').value;

    const confirmField = document.getElementById('rePassword');

    if (password === repassword) {
        confirmField.style.borderColor = '#4CAF50'; // Green border
        confirmField.style.boxShadow = '0 0 0 2px rgba(76, 175, 80, 0.2)';
        messageElement.textContent = '✓ Passwords match';
        messageElement.style.color = '#4CAF50';
    } else {
        confirmField.style.borderColor = 'red';
        return false;
    }
    return password === repassword;

}


function submitPasswordChange(){

}