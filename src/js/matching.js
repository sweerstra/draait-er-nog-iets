import request from "./request";
import sort from "./dates";

const EURO_SCRAPE_URL = './src/api/euroscoop_scrape.php';
const TRAKT_LIST_SCRAPE_URL = './src/api/trakt_lists_scrape.php?&user=';
const TRAKT_WATCHLIST_SCRAPE_URL = './src/api/trakt_scrape.php?&user=';
const TIMELINE_SCRAPE_URL = './src/api/euroscoop_schedule_scrape.php?target=';

const getMatchingTitles = ({current, expecting}, username, list) => {
    let url = (list == null ? TRAKT_WATCHLIST_SCRAPE_URL : TRAKT_LIST_SCRAPE_URL) + username;
    url = username && list ? `${url}&name=${list}` : url;

    return request(url).then(response => {
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

const addReservationLink = matching => {
    return matching.map((match) => {
        return request(TIMELINE_SCRAPE_URL + encodeURIComponent(match.link)).then((reservation) => {
            return Object.assign(match, {reservation});
        });
    });
};

export default (user, list) => request(EURO_SCRAPE_URL).then((scrapes) => {
    return getMatchingTitles(JSON.parse(scrapes), user, list);
});