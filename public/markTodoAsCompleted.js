document.addEventListener("click", (event) => {
    if (event.target.classList.contains("todo-checkbox")) {
        const checkbox = event.target;
        const listItem = checkbox.parentElement;
        const todoTitle = listItem.querySelector('h3');
        const todoDescription = listItem.querySelector('p');
        const todoID = checkbox.getAttribute("data_id");

        if (checkbox.checked) {
            todoTitle.style.textDecoration = 'line-through';
            todoDescription.style.textDecoration = 'line-through';
        }
        
        // Sending a PATCH request to mark a todo item as completed on the server
        fetch(`/home/${todoID}`, {
            method: "PATCH",
        }).then(response => {
            if (response.ok) {
                console.log("Response was ok.");
                window.location.href = "http://localhost:3000"
            } else {
                console.log("Response was not ok.");
            }
        }).catch(error => {
            console.log("Error:", error);
        });
    }
});
