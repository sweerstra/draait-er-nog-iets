const ABSOLUTE_PATH = 'https://i321720.iris.fhict.nl/draaiternogiets';
const isDevServer = process.argv.find(v => v.includes('webpack-dev-server'));
const replacePath = url => ABSOLUTE_PATH + url.slice(1);

const Urls = {
    EURO_SCRAPE: './src/api/euroscoop_scrape.php',
    TRAKT_LIST_SCRAPE: './src/api/trakt_lists_scrape.php?&user=',
    TRAKT_WATCHLIST_SCRAPE: './src/api/trakt_scrape.php?&user=',
    TIMELINE_SCRAPE: './src/api/euroscoop_schedule_scrape.php?target='
};

if (isDevServer) {
    Object.keys(Urls).forEach(key => (Urls[key] = replacePath(Urls[key])));
}

export default Urls;