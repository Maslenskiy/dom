//use strict";
const buttonElement = document.getElementById("add-button");
const nameInputElement = document.getElementById("name-input");
const commentInputElement = document.getElementById("comment-input");
const likeInputElement = document.getElementById("like-input");
const commentsElement = document.getElementById("comments");
const addForm = document.getElementById("add-form");
const container = document.getElementById("add-container");
const loaderElement = document.getElementById("loading");

const formatDateTime = () => {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth()).padStart(2, '0');
    const year = String(currentDate.getFullYear() - 2000);
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}`;
};

// Запрос данных в API на комментарий
let comments = [];
buttonElement.disabled = true;
loaderElement.innerHTML = "Подождите пожалуйста, комментарии загружаются...";

const fetchAndRenderComments = () => {
    if (!navigator.onLine) {
        alert("Нет соединения с интернетом.");
        return;
    }

    fetch("https://wedev-api.sky.pro/api/v1/yuriy-maslenskiy/comments", {
        method: "GET"
    })
    .then((response) => {
        if (!response.ok) {
            if (response.status === 500) {
                throw new Error("Internal Server Error (500)");
            } else {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }
        }
        return response.json();
    })
    .then((responseData) => {
        const appComments = responseData.comments.map((comment) => {
            return {
                name: comment.author.name,
                date: formatDateTime(comment.date),
                text: comment.text,
                likes: comment.likes,
                isLiked: false,
            };
        });
        comments = appComments;
        renderComments();
    })
    .then(() => {
        buttonElement.disabled = false;
        loaderElement.textContent = "";
    })
    .catch((error) => {
        console.error(`Error fetching comments: ${error.message}`);
        if (error.message.includes("Failed to fetch")) {
            alert("Error: No internet connection.");
        } else if (error.message === "Internal Server Error (500)") {
            alert("Кажется, что-то пошло не так на сервере. Попробуйте позже.");
        }
    });
};

fetchAndRenderComments();

function delay(interval = 300) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, interval);
    });
}

// Рендер функция
const renderComments = () => {
    const commentsHtml = comments
        .map((comment, index) => {
            return `<li class="comment" data-index="${index}" id="comment">
                <div class="comment-header" >
                    <div class="comment-name">${comment.name}</div>
                    <div>${comment.date}</div>
                </div>
                <div class="comment-body">
                    <div class="comment-text">${comment.text}</div>
                </div>
                <div class="comment-footer">
                    <button id=delete-form-button class="delete-form-button" data-index="${index}">Удалить</button>
                    <div class="likes">
                        <span class="likes-counter">${comment.likes}</span>
                        <button class="${comment.isLike ? 'like-button active-like': 'like-button'} " data-index="${index}"></button>
                    </div>
                </div>
            </li>`;
        }).join("");

    commentsElement.innerHTML = commentsHtml;

    // Кнопка Цитирования
    const quoteElements = document.querySelectorAll(".comment");
    for (const comment of quoteElements) {
        comment.addEventListener("click", () => {
            const index = comment.dataset.index;
            const comentText = comments[index].text;
            const comentAuthor = comments[index].name;

            commentInputElement.value = `>${comentAuthor} ${comentText} `;
        });
    }

    initLikesListeners();
    initDeleteButtonsListeners();
};

// Кнопка лайков
const initLikesListeners = () => {
    for (const commentElement of document.querySelectorAll(".like-button")) {
        commentElement.addEventListener("click", (event) => {
            event.stopPropagation();
            const index = commentElement.dataset.index;
            comments[index].likes += comments[index].isLike ? -1 : +1;
            comments[index].isLike = !comments[index].isLike;
            renderComments();
        });
    }
};

// Кнопка удаления 
const initDeleteButtonsListeners = () => {
    const deleteButtonsElements = document.querySelectorAll(".delete-form-button");
    for (const deleteButtonsElement of deleteButtonsElements) {
        deleteButtonsElement.addEventListener("click", (event) => {
            event.stopPropagation();
            const index = deleteButtonsElement.dataset.index;
            comments.splice(index, 1);
            renderComments();
        });
    }
};

renderComments();

// Форма добавления  
buttonElement.addEventListener("click", () => {
    nameInputElement.style.backgroundColor = "white" ;
    commentInputElement.style.backgroundColor = "white";
    if (nameInputElement.value === "") {
        nameInputElement.style.backgroundColor = "red";
        return;
    }
    if (commentInputElement.value === "") {
        commentInputElement.style.backgroundColor = "red";
        return;
    }
    buttonElement.disabled = true;
    buttonElement.textContent = "Комментарий добавляется...";

    const handlePostClick = () => {
        if (!navigator.onLine) {
            alert("Нет соединения с интернетом.");
            buttonElement.disabled = false;
            buttonElement.textContent = "Написать";
            return;
        }

        fetch("https://wedev-api.sky.pro/api/v1/yuriy-maslenskiy/comments", {
            method: "POST",
            body: JSON.stringify({
                name: nameInputElement.value,
                text: commentInputElement.value,
                forceError: true,
            })
        })
        .then((response) => {
            console.log(response);
            if (response.status === 201) {
                return response.json();
            }
            if (response.status === 400) {
                throw new Error("Неверный запрос"); 
            }
            if (response.status === 500) {
                throw new Error("Сервер упал");
            }
        })
        .then((responseData) => {
            return fetchAndRenderComments();
        })
        .then(() => {
            buttonElement.disabled = false;
            buttonElement.textContent = "Написать";
            nameInputElement.value = "";
            commentInputElement.value = ""; 
        })
        .catch((error) => {
            buttonElement.disabled = false;
            buttonElement.textContent = "Написать";
            if (error.message === "Неверный запрос") {
                alert("Имя и комментарий должны быть не короче 3 символов");
            } else if (error.message === "Сервер упал" && error.message.startsWith("500")) {
                alert("Сервер вернул ошибку 500. Кажется, что-то пошло не так на сервере.");
            } else if (error.message === "Сервер упал") {
                // Можете добавить дополнительную обработку для других ошибок сервера, если необходимо.
                alert("Кажется, что-то пошло не так, попробуйте позже");
            } else if (error.message === 'Failed to fetch') {
                alert('Нет соединения, проверьте подключение к интернету');
            }
            console.warn(error);
        });
    };

    handlePostClick();
    renderComments();
    initDeleteButtonsListeners();
});
