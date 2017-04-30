import Config from "../config/index";
import request from "../data/fetch";

export default (url) => {
    return request.get(Config.TRAKT_POSTER_SCRAPE + url);
};