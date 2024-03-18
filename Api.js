export function getComments() {
    return fetch("https://wedev-api.sky.pro/api/v1/yuriy-maslenskiy/comments",
        {
            method: 'GET',
        
        })
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            if (response.status === 500) {
                    throw new Error("Internal Server Error (500)");
            } else {
                    throw new Error(`Error: ${response.status} - ${response.statusText}`);
                }
            })
            .catch((error) => {
            if (error.message.includes("Failed to fetch")) {
                alert("Error: No internet connection.");
            } else if (error.message === "Internal Server Error (500)") {
                alert("Кажется, что-то пошло не так на сервере. Попробуйте позже.");
            }
        });
        
}

export function postComments ( {name, text}) {
    return fetch("https://wedev-api.sky.pro/api/v1/yuriy-maslenskiy/comments",
            {
                method: 'POST',
                body: JSON.stringify({
                    name: name,
                    text: text,
            })
        });
}