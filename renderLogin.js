import { loginPost, setToken, token} from "./api.js";
import {setUser, fetchAndRenderComments} from './main.js';
/* import { fetchAndRenderComments } from "./main.js"; */


export const renderLoginForm = () => {
    const appHtml = document.getElementById("app");
    const loginHtml = `
    <div class="container">
      <div class="add-form">
        <input 
        type="text"
        id="login-input" 
        class="add-form-name"
        placeholder="Логин"
        />
        <input 
        type="text"
        id="password-input"
        class="add-form-name"
        placeholder="Пароль"
        />
        <button id="login-form-button" class="add-form-button">Войти</button>
      </div>
    </div>`;
    appHtml.innerHTML = loginHtml;

    //Добавляем действие по клику на "авторизация"
    const buttonLoginElement = document.getElementById("login-form-button");
    const loginInputElement = document.getElementById("login-input");
    const passwordInputElement = document.getElementById("password-input");

    buttonLoginElement.addEventListener("click", (event) => {
        event.preventDefault();
        if (!loginInputElement.value || !passwordInputElement.value) {
            alert("Проверьте оба поля  на заполненность");
            return
        }
        loginPost({
            login: loginInputElement.value, 
            password:passwordInputElement.value
        }).then((responseData) => {
            localStorage.setItem("token", responseData.user.token);
            localStorage.setItem("user", JSON.stringify(responseData.user));
      
            setToken(responseData.user.token);
            setUser(responseData.user);
      
          }).then(() => {
            fetchAndRenderComments();
          })
    });
};
