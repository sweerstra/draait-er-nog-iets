import Config from "./config";
import request from "./request";

export default {
    addSuggestion(suggestion) {
        return request(Config.SUGGESTION, 'POST', suggestion);
    },

    getSuggestions() {
        return request(Config.SUGGESTION);
    }
};