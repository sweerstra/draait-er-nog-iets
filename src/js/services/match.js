import Config from "../config/index";
import request from "../data/fetch";
import sortByDateString from "../utils/sortByDateString";

const getMatchingTitles = async({ current, expecting }) => {
    const scrapes = await request.get(Config.TRAKT_SCRAPE);

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

const addReservationLink = async(matches) => {
    return matches.map((match) => {
        const reservation = await request.get(Config.TIMELINE_SCRAPE + encodeURIComponent(match.link));
        return Object.assign(match, { reservation });

        /* return request.get(Config.TIMELINE_SCRAPE + encodeURIComponent(match.link)).then((reservation) => {
         return Object.assign(match, { reservation });
         }); */
    });
};

export default () => {
    return request.get(Config.EUROSCOOP_SCRAPE).then(getMatchingTitles);
}