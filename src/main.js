import request from './js/request';
import sort from './js/dates'

const CURRENT_CLASS = 'current';
const EXPECTING_CLASS = 'expecting';
const STORAGE_KEY = 'trakt_user';
const STRING_EMPTY = '';
const CONTENT = document.getElementById('content');
const INPUT = document.getElementById('input-user');
const BUTTON = document.getElementById('btn-control');
const SPINNER = document.getElementById('spinner');
const NO_RESULTS = document.getElementById('no-results');
const EURO_SCRAPE_URL = './src/api/euroscoop_scrape.php';
const TRAKT_SCRAPE_URL = './src/api/trakt_scrape.php?&user=';

document.addEventListener('DOMContentLoaded', () => {
    INPUT.value = localStorage.getItem(STORAGE_KEY);
    requestWatchlist(INPUT.value);
});

BUTTON.addEventListener('click', () => {
    removeChildren(CONTENT);
    setDisplay(NO_RESULTS, false);
    setDisplay(SPINNER, true);
    requestWatchlist(INPUT.value);
});

INPUT.addEventListener('keyup', e => {
    e.preventDefault();
    if (e.keyCode === 13) {
        BUTTON.click();
    }
});

const requestWatchlist = url => {
    request(EURO_SCRAPE_URL).then(scrapes => getMatchingTitles(JSON.parse(scrapes), url).then(populate));
};

const getMatchingTitles = (titles, url) => {
    return request(TRAKT_SCRAPE_URL + encodeURIComponent(url)).then(response => {
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

const populate = titles => {
    setDisplay(SPINNER, false);

    if (titles.length === 0) {
        setDisplay(NO_RESULTS, true);
        return;
    }

    localStorage.setItem(STORAGE_KEY, INPUT.value);

    titles.forEach(({title, poster, release}) =>
        appendRow(CONTENT, {title, poster, release}, release
            ? EXPECTING_CLASS
            : CURRENT_CLASS));
};

const appendRow = (content, {title, poster, release}, type) => {
    const row = document.createElement('div');

    row.innerHTML = `<div class="row ${type}">
                        <span class="title">${title}</span>
                        <img src="${poster}">
                        <span class="date">${(release || STRING_EMPTY)}</span>
                     </div>`;

    content.appendChild(row);
};

const removeChildren = element => {
    while (element.hasChildNodes()) {
        element.removeChild(element.firstChild);
    }
};

const setDisplay = (element, type) => {
    element.style.display = type ? 'block' : 'none';
};