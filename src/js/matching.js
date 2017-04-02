import Config from "./config";
import request from "./request";
import sort from "./dates";

const getMatchingTitles = ({current, expecting}) => {
    return request(Config.TRAKT_LIST_SCRAPE).then((response) => {
        const scrapes = JSON.parse(response);
        const currentMatches = [];
        const expectingMatches = [];

        scrapes.forEach((scrape) => {
            populateMatching(current, currentMatches, scrape);
            populateMatching(expecting, expectingMatches, scrape);
        });

        return Promise.all([...addReservationLink(currentMatches), ...sort(expectingMatches)]);
    });

};

const populateMatching = (arr, populate, scrape) => {
    const scrapeTitle = scrape.title.toLowerCase();
    arr.forEach((result) => {
        const resultTitle = result.title.toLowerCase();
        if (resultTitle.includes(scrapeTitle)) {
            populate.push({title: resultTitle, poster: scrape.poster, release: result.release, link: result.link});
        }
    });
};

const addReservationLink = (matches) => {
    return matches.map((match) => {
        return request(Config.TIMELINE_SCRAPE + encodeURIComponent(match.link)).then((reservation) => {
            return Object.assign(match, {reservation});
        });
    });
};

export default {
    getAvailableTitles() {
        return request(Config.EURO_SCRAPE).then((scrapes) => {
            return getMatchingTitles(JSON.parse(scrapes));
        });
    }
}