const ABSOLUTE_PATH = 'https://i321720.iris.fhict.nl/draaiternogiets';
const isDevServer = process.argv.find(v => v.includes('webpack-dev-server'));
const replacePath = url => url.startsWith('https://') ? url : ABSOLUTE_PATH + url.slice(1);

const Urls = {
    EURO_SCRAPE: './src/api/euroscoop_scrape.php',
    TRAKT_LIST_SCRAPE: 'https://i321720.iris.fhict.nl/draait-er-nog-iets/trakt.php'/*'./src/api/trakt_lists_scrape.php?&user='*/,
    TRAKT_WATCHLIST_SCRAPE: './src/api/trakt_scrape.php?&user=',
    TIMELINE_SCRAPE: './src/api/euroscoop_schedule_scrape.php?target=',
    SUGGESTION: 'https://draait-er-nog-iets.firebaseio.com/suggestions.json'
};

if (true) {
    Object.keys(Urls).forEach(key => (Urls[key] = replacePath(Urls[key])));
}

export default Urls;