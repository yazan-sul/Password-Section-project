function togglePasswordVisibility(fieldId) {
    const field = document.getElementById(fieldId);
    if (field.type === 'password') {
        field.type = 'text'; 
    } else {
        field.type = 'password'; 
    }
}

function validatePassword() {
    const password = document.getElementById('newPassword').value;

    const unmetCriteria = [];


    const lengthVaild = password.length >= 8 && password.length <= 64;
    document.getElementById('length-req').classList.toggle('valid', lengthVaild);
    if (!lengthVaild) unmetCriteria.push("8–64 characters");


    const upperVaild = /[A-Z]/.test(password);
    document.getElementById('upper-req').classList.toggle('valid', upperVaild)
    if (!upperVaild) unmetCriteria.push("one uppercase letter");


    const lowerVaild = /[a-z]/.test(password);
    document.getElementById('lower-req').classList.toggle('valid', lowerVaild)
    if (!lowerVaild) unmetCriteria.push("one lowercase letter");

    const numberVaild = /\d/.test(password);
    document.getElementById('number-req').classList.toggle('valid', numberVaild)
    if (!numberVaild) unmetCriteria.push("one number");


    const specialVaild = /[!@#$%^&*]/.test(password);
    document.getElementById('special-req').classList.toggle('valid', specialVaild)
    if(!specialVaild) unmetCriteria.push("at least one special char");
    
    const isValid = lengthVaild && upperVaild && lowerVaild && numberVaild && specialVaild;
    return { isValid, unmetCriteria };
}
function matchPassword() {
    const password = document.getElementById('newPassword').value;
    const repassword = document.getElementById('rePassword').value;

    const confirmField = document.getElementById('rePassword');

    if (password === repassword) {
        confirmField.style.borderColor = '#4CAF50'; 
        confirmField.style.boxShadow = '0 0 0 2px rgba(76, 175, 80, 0.2)';
       
    } else {
        confirmField.style.borderColor = 'red';
        return false;
    }
    return password === repassword;

}


async function submitPasswordChange(){
    const saveButton = document.getElementById('saveButton');
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const rePassword = document.getElementById('rePassword').value;
    const passwordValidation = validatePassword();
    if (!passwordValidation.isValid) {
        alert("Password should contain: " + passwordValidation.unmetCriteria.join(", "));
        return;
    }

    if (!matchPassword()) {
      return;
    }
    
    if (currentPassword === newPassword) {
        alert("New password is the same as the current password.");
        return;
    }

    saveButton.disabled = true;
    saveButton.textContent = 'Saving...';

    try{
        const response = await fetch('https://www.greatfrontend.com/api/projects/challenges/auth/change-password', {
            method : 'POST',
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify({
            user_id : "1234",
            password : currentPassword,
            new_password : newPassword
            })
        });
        const result = response.json();

        if(response.ok){
            alert("success");
        }
        else{
            alert(result.message || "failed");
            
        }
    }catch (error) {
        saveButton.textContent = 'Network Error';
        saveButton.style.backgroundColor = '#f44336';
        console.error('Fetch Error:', error);
      } 
}
