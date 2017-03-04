import getAvailableTitles from "./js/matching";

const CURRENT_CLASS = 'current';
const EXPECTING_CLASS = 'expecting';
const STORAGE_KEY = 'trakt_user';
const EMPTY_STRING = '';
const CONTENT = document.getElementById('content');
const INPUT = document.getElementById('input-user');
const BUTTON = document.getElementById('btn-control');
const SPINNER = document.getElementById('spinner');
const NO_RESULTS = document.getElementById('no-results');

document.addEventListener('DOMContentLoaded', () => {
    INPUT.value = localStorage.getItem(STORAGE_KEY);
    getAvailableTitles(INPUT.value).then(populate);
});

BUTTON.addEventListener('click', () => {
    removeChildren(CONTENT);
    setDisplay(NO_RESULTS, false);
    setDisplay(SPINNER, true);
    getAvailableTitles(INPUT.value).then(populate);
});

INPUT.addEventListener('keyup', e => {
    e.preventDefault();
    if (e.keyCode === 13) {
        BUTTON.click();
    }
});

const populate = titles => {
    setDisplay(SPINNER, false);

    if (titles.length === 0) {
        setDisplay(NO_RESULTS, true);
        return;
    }

    localStorage.setItem(STORAGE_KEY, INPUT.value);

    titles.forEach(({title, poster, release}) => {
        const type = release ? EXPECTING_CLASS : CURRENT_CLASS;
        appendRow(CONTENT, {title, poster, release}, type);
    });
};

const appendRow = (content, {title, poster, release}, type) => {
    const row = document.createElement('div');

    row.innerHTML = `<div class="row ${type}">
                        <span class="title">${title}</span>
                        <img src="${poster}">
                        <span class="date">${(release || EMPTY_STRING)}</span>
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