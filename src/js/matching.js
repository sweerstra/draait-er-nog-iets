import Config from "./config";
import request from "./request";
import sort from "./dates";

const getMatchingTitles = ({current, expecting}, username, list) => {
    let url = (list == null ? Config.TRAKT_WATCHLIST_SCRAPE : Config.TRAKT_LIST_SCRAPE) + username;
    url = username && list ? `${url}&name=${list}` : url;

    return request(url).then((response) => {
        const scrapes = JSON.parse(response);
        const currentMatching = [];
        const expectingMatching = [];

        scrapes.forEach((scrape) => {
            populateMatching(current, currentMatching, scrape);
            populateMatching(expecting, expectingMatching, scrape);
        });

        return Promise.all([...addReservationLink(currentMatching), ...sort(expectingMatching)]);
    });

};

const populateMatching = (arr, populate, scrape) => {
    arr.forEach(({title, release = null, link}) => {
        if (title.toLowerCase().includes(scrape.title.toLowerCase())) {
            populate.push({title, poster: scrape.poster, release, link});
        }
    });
};

const addReservationLink = (matching) => {
    return matching.map((match) => {
        return request(Config.TIMELINE_SCRAPE + encodeURIComponent(match.link)).then((reservation) => {
            return Object.assign(match, {reservation});
        });
    });
};

export default (user, list) => request(Config.EURO_SCRAPE).then((scrapes) => {
    return getMatchingTitles(JSON.parse(scrapes), user, list);
});