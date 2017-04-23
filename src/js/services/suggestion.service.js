import Config from "../config/index";
import request from "../data/fetch";

const DEFAULT_URL = Config.SUGGESTIONS + '.json';

export default {
    addSuggestion(suggestion) {
        return request.post(DEFAULT_URL, suggestion);
    },

    getSuggestions() {
        return request.get(DEFAULT_URL);
    },

    deleteSuggestion(id) {
        return request.delete(`${Config.SUGGESTIONS}${id}.json`);
    }
};