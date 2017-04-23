const ABSOLUTE_PATH = 'https://i321720.iris.fhict.nl/draait-er-nog-iets';
const isDevServer = process.argv.some(v => v.includes('webpack-dev-server'));
const replacePath = url => url.startsWith('https://') ? url : ABSOLUTE_PATH + url.slice(1);

const Urls = {
    EUROSCOOP_SCRAPE: './src/api/euroscoop_scrape.php',
    TRAKT_SCRAPE: './src/api/trakt.php',
    TIMELINE_SCRAPE: './src/api/euroscoop_schedule_scrape.php?target=',
    SUGGESTIONS: 'https://draait-er-nog-iets.firebaseio.com/suggestions/'
};

if (isDevServer) {
    Object.keys(Urls).forEach(key => (Urls[key] = replacePath(Urls[key])));
}

export default Urls;