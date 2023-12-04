function validatePasswords() {
    let password = document.getElementById("pass").value;
    let confirmPassword = document.getElementById("confirmPass").value;

    if (password != confirmPassword) {
        alert("Passwords do not match!");
        return false;
    } else if (password.length < 8) {
        alert("Password must at least be 8 characters long.");
        return false;
    } else {
        return true;
    }
}