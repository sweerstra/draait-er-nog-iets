import getAvailableTitles from "./js/matching";

const CURRENT_CLASS = 'current';
const EXPECTING_CLASS = 'expecting';
const USERNAME_STORAGE_KEY = 'trakt_user';
const WATCHLIST_STORAGE_KEY = 'use_watchlist';
const EMPTY_STRING = '';
const CONTENT = document.getElementById('content');
const INPUT_USER = document.getElementById('input-user');
const CHECKBOX = document.getElementById('check');
const INPUT_LIST = document.getElementById('input-list');
const BUTTON = document.getElementById('btn-control');
const SPINNER = document.getElementById('spinner');
const NO_RESULTS = document.getElementById('no-results');

document.addEventListener('DOMContentLoaded', () => {
    INPUT_USER.value = localStorage.getItem(USERNAME_STORAGE_KEY);
    initSearch();
});

BUTTON.addEventListener('click', () => {
    removeChildren(CONTENT);
    setDisplay(NO_RESULTS, false);
    setDisplay(SPINNER, true);
    initSearch();
});

const submitOnEnter = (e) => {
    e.preventDefault();
    if (e.keyCode === 13) {
        BUTTON.click();
    }
};

INPUT_USER.addEventListener('keyup', submitOnEnter);
INPUT_LIST.addEventListener('keyup', submitOnEnter);

CHECKBOX.addEventListener('click', () => {
    setDisplay(INPUT_LIST, !CHECKBOX.checked, 'inline');
});

const initSearch = () => {
    getAvailableTitles(INPUT_USER.value, CHECKBOX.checked ? null : INPUT_LIST.value).then(populate);
};

const populate = titles => {
    setDisplay(SPINNER, false);

    if (titles.length === 0) {
        setDisplay(NO_RESULTS, true);
        return;
    }

    localStorage.setItem(USERNAME_STORAGE_KEY, INPUT_USER.value);
    localStorage.setItem(WATCHLIST_STORAGE_KEY, CHECKBOX.checked);

    titles.forEach(({title, poster, release, link, reservation = null}) => {
        const type = release ? EXPECTING_CLASS : CURRENT_CLASS;
        appendRow(CONTENT, {title, poster, release, link, reservation}, type);
    });
};

const appendRow = (content, {title, poster, release, link, reservation}, type) => {
    const row = document.createElement('div');

    const reservationDiv = reservation ?
        `<div class="reservation">
                <a href="${reservation}" class="btn-reserve">
                    Reserveer
                </a>
         </div>` : '';

    row.innerHTML = `<div class="row ${type}">
                        <span class="title">${title}</span>
                        <a href="${link}"><img src="${poster}"></a>
                        <span class="date">${(release || EMPTY_STRING)}</span>
                        ${reservationDiv}
                     </div>`;

    content.appendChild(row);
};

const removeChildren = element => {
    while (element.hasChildNodes()) {
        element.removeChild(element.firstChild);
    }
};

const setDisplay = (element, type, display = 'block') => {
    element.style.display = type ? display : 'none';
};