document.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-btn")) {
        const deleteButton = event.target;
        const todoID = deleteButton.getAttribute("data_id");
    
        fetch(`/home/${todoID}`, {
            method: "DELETE",
        }).then(response => {
            if (response.ok) {
                console.log("Response was ok.");
                deleteButton.parentElement.remove();
            } else {
                console.log("Response was not ok.");
            }
        }).catch(error => {
            console.log("Error:", error);
        });
}
});