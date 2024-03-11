const textAreaElement = document.getElementById("add-text");
const inputElement = document.getElementById("add-name");
const listElement = document.getElementById("comments");
const buttonElement = document.getElementById("add-form-button");
export const hideSeeAddComment = () => {
    buttonElement.addEventListener("click", () => {
        if(inputElement === "" || textAreaElement == ""){
            buttonElement.disabled = false;
            listElement.textContent = "";
            return
        }
    });
    buttonElement.disabled = false;
    listElement.textContent = "";
}