export default (url, method = 'GET', data = null) => {

    return new Promise((resolve, reject) => {

        let request = new XMLHttpRequest();
        request.open(method, url);

        request.onload = () => {
            if (request.status === 200) {
                resolve(request.response);
            }
            else {
                reject(Error(`Error: ${request.statusText}`));
            }
        };

        request.send(JSON.stringify(data));
    });

};