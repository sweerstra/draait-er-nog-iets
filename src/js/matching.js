import Config from "./config";
import request from "./request";
import sort from "./dates";

const getMatchingTitles = ({current, expecting}) => {
    return request(Config.TRAKT_SCRAPE).then((response) => {
        const scrapes = JSON.parse(response);
        const currentMatches = [];
        const expectingMatches = [];

        scrapes.forEach((scrape) => {
            match(current, currentMatches, scrape);
            match(expecting, expectingMatches, scrape);
        });

        return Promise.all([...addReservationLink(currentMatches), ...sort(expectingMatches)]);
    });

};

const match = (result, toPopulate, scrape) => {
    const scrapeTitle = scrape.title.toLowerCase();
    result.forEach((result) => {
        if (result.title.toLowerCase().includes(scrapeTitle)) {
            toPopulate.push({title: result.title, poster: scrape.poster, release: result.release, link: result.link});
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
        return request(Config.EUROSCOOP_SCRAPE).then((scrapes) => {
            return getMatchingTitles(JSON.parse(scrapes));
        });
    }
}