import Config from "../config/index";
import request from "../data/fetch";
import sortByDateString from "../utils/sortDateString";

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

const matchWithAvailable = (result, toPopulate, scrape) => {
    const scrapeTitle = scrape.title.toLowerCase();
    result.forEach((result) => {
        if (result.title.toLowerCase().includes(scrapeTitle)) {
            toPopulate.push({ title: result.title, poster: scrape.poster, release: result.release, link: result.link });
        }
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