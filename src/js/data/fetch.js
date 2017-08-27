class Fetch {
    async _request(url, options) {
        return fetch(url, options)
            .then(Fetch._checkStatus)
            .then(Fetch._parseResponse)
            .catch(err => err);
    };

    get(url) {
        return this._request(url);
    }

    post(url, data) {
        return this._request(url, {
            method: 'post',
            body: JSON.stringify(data)
        });
    }

    put(url, data) {
        return this._request(url, {
            method: 'put',
            body: JSON.stringify(data)
        });
    }

    delete(url, data) {
        return this._request(url, {
            method: 'delete',
            body: JSON.stringify(data)
        });
    }

    static _parseResponse(response) {
        return response.json();
    };

    static _checkStatus(response) {
        if (response.status >= 200 && response.status < 300) {
            return response;
        }

        const error = new Error(response.statusText);
        error.response = response;
        throw error;
    }
}

export default new Fetch();