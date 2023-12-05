function validatePasswords() {
    let password = document.getElementById("pass").value;
    let confirmPassword = document.getElementById("confirmPass").value;

    if (password != confirmPassword) {
        alert("Passwords do not match!");
        return false;
    } else if (password.length < 8) {
        alert("Password must at least be 8 characters long.");
        return false;
    } else if (checkForSpecialChars(password) < 1) {
        alert("Password must at least contain 1 special character.");
        return false;
    }
}

function checkForSpecialChars(password) {
    const specialChars = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '-', '=', '[', ']', '{', '}', '|', '\\', ';', ':', '\'', '"', ',', '.', '<', '>', '/', '?', '`', '~'];
    let numberOfSpecialChars = 0;

    for (let char of password) {
        if (specialChars.includes(char)) {
            numberOfSpecialChars++;
        }
    }
    return numberOfSpecialChars;
}