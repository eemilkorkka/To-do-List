let listItem;

document.addEventListener("click", (event) => {
    if (event.target.classList.contains("edit-btn")) {
        const editButton = event.target;
        listItem = editButton.parentElement;
        const todoTitle = listItem.querySelector("h3").innerText;
        const todoDescription = listItem.querySelector("p").innerText;

        const editForm = listItem.querySelector(".edit-form");
        const editTitleInput = editForm.querySelector(".edit-title");
        const editDescriptionInput = editForm.querySelector(".edit-description");

        editTitleInput.value = todoTitle;
        editDescriptionInput.value = todoDescription;

        editForm.style.display = "block";    
    }

    if (event.target.classList.contains("save-btn")) {    
        const saveButton = event.target;
        const editForm = saveButton.parentElement;
        const editedTodoTitle = editForm.querySelector('.edit-title').value;
        const editedTodoDescription = editForm.querySelector('.edit-description').value;
        const todoID = saveButton.getAttribute("data_id");

        const updatedTodo = {
            title: editedTodoTitle,
            description: editedTodoDescription
        };
        
        fetch(`/home/${todoID}`, {
            method: "PUT",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(updatedTodo)
        }).then(response => {
            if (response.ok) {
                console.log("Response was ok.");
            } else {
                console.log("Response was not ok.");
            }
        }).catch(error => {
            console.log("Error:", error);
        });
    }
});
