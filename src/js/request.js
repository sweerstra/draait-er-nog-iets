export default url => {

    return new Promise((resolve, reject) => {

        let request = new XMLHttpRequest();
        request.open('GET', url);

        request.onload = () => {
            if (request.status === 200) {
                resolve(request.response);
            }
            else {
                reject(Error(`Error: ${request.statusText}`));
            }
        };

        request.send();
    });

};