import { initLikeListeners, quoteComments } from "./main.js";

const listElement = document.getElementById("list");

export const renderComments = ({comments}) => {

    const commentHtml = comments.map((comment, index) => {
        return `<li class="comment" data-index="${index}">
          <div class="comment-header">
            <div>${comment.name}</div>
            <div>${comment.date}</div>
          </div>
          <div class="comment-body">
            <div class="comment-text">
              ${comment.text}
            </div>
          </div>
          <div class="comment-footer">
            <div class="likes">
              <span class="likes-counter">${comment.likeCounter}</span>
              <button class="like-button ${comment.isLiked ? 'active-like' : ''}" data-index="${index}"></button>
            </div>
          </div>
        </li>`;
    }).join("");

    listElement.innerHTML = commentHtml;
    initLikeListeners();
    quoteComments();
}