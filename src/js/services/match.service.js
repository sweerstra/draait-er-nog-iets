import Config from "../config/index";
import request from "../data/fetch";
import sortByDateString from "../utils/sortByDateString";

const getMatchingTitles = ({ current, expecting }) => {
    return request.get(Config.TRAKT_SCRAPE).then((scrapes) => {
        const currentMatches = [];
        const expectingMatches = [];

        scrapes.forEach((scrape) => {
            matchWithAvailable(current, currentMatches, scrape);
            matchWithAvailable(expecting, expectingMatches, scrape);
        });

        return Promise.all([...addReservationLink(currentMatches), ...sortByDateString(expectingMatches)]);
    });
};

const matchWithAvailable = (results, toPopulate, scrape) => {
    const scrapeTitle = scrape.title.toLowerCase();
    results.forEach((result) => {
        if (result.title.toLowerCase().includes(scrapeTitle)) {
            toPopulate.push({ title: result.title, poster: scrape.poster, release: result.release, link: result.link });
        }
    });
};

const addRottenScores = (matches) => {
    return matches.map((match) => {
        return request.get(Config.ROTTEN_SCRAPE + match.title).then((score) => {
            return Object.assign(match, { score });
        });
    });
};

const addReservationLink = (matches) => {
    return matches.map((match) => {
        return request.get(Config.TIMELINE_SCRAPE + encodeURIComponent(match.link)).then((reservation) => {
            return Object.assign(match, { reservation });
        });
    });
};

export default () => {
    return request.get(Config.EUROSCOOP_SCRAPE).then(getMatchingTitles);
}