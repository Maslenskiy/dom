export function getComments() {
    return fetch("https://wedev-api.sky.pro/api/v1/yuriy-maslenskiy/comments",
        {
            method: 'GET',
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