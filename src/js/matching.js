import request from "./request";
import sort from "./dates";

const EURO_SCRAPE_URL = './src/api/euroscoop_scrape.php';
const TRAKT_SCRAPE_URL = './src/api/trakt_scrape.php?&user=';
const TIMELINE_SCRAPE_URL = './src/api/timeline_scrape.php?target=';

const getMatchingTitles = ({current, expecting}, username) => {

    return request(TRAKT_SCRAPE_URL + username).then(response => {
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
        if (title.includes(scrape.title)) {
            populate.push({title, poster: scrape.poster, release, link});
        }
    });
};

const addReservationLink = matching => {
    return matching.map(({title, poster, release, link}) => {
        return request(TIMELINE_SCRAPE_URL + encodeURIComponent(link)).then((reservation) => {
            return {title, poster, release, link, reservation};
        });
    });
};

export default user => request(EURO_SCRAPE_URL).then(scrapes => getMatchingTitles(JSON.parse(scrapes), user));