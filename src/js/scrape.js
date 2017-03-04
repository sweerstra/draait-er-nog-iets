import request from './request';
import sort from './dates'

const EURO_SCRAPE_URL = './src/api/euroscoop_scrape.php';
const TRAKT_SCRAPE_URL = './src/api/trakt_scrape.php?&user=';

const getMatchingTitles = (titles, user) => {
    return request(TRAKT_SCRAPE_URL + user).then(response => {
        const scrapes = JSON.parse(response);
        const current = [];
        const expecting = [];

        scrapes.map(({title, poster}) => {
            if (titles.current.some(val => val.includes(title))) {
                current.push({title, poster});
            } else {
                titles.expecting.forEach(scrape => {
                    if (scrape.title.includes(title)) {
                        expecting.push({title, poster, release: scrape.release});
                    }
                });
            }
        });

        return Promise.all([...current, ...sort(expecting)]);
    });
};

export default user => request(EURO_SCRAPE_URL).then(scrapes => getMatchingTitles(JSON.parse(scrapes), user));