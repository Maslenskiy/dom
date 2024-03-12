export function getComments() {
    return fetch("https://wedev-api.sky.pro/api/v1/yuriy-maslenskiy/comments",
        {
            method: 'GET',
        })

        .then((response) => {
            return response.json()
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