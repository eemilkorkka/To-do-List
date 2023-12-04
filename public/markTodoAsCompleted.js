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
    
        fetch(`/home/${todoID}`, {
            method: "PUT",
        }).then(response => {
            if (response.ok) {
                console.log("Response was ok.");
                listItem.removeChild(checkbox);
            } else {
                console.log("Response was not ok.");
            }
        }).catch(error => {
            console.log("Error:", error);
        });
    }
});
