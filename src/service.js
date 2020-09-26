const BASE_API = 'http://localhost:3000';

function service(url, method, otherOptions = {}) {
    return fetch(`${BASE_API}/${url}`, {
        method,
        headers: {
            'Content-Type': 'application/json'
        },
        ...otherOptions
    });
}

export default service;