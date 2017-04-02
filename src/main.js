import titleService from "./js/matching";
import suggestionService from "./js/suggestion";

const EMPTY_STRING = '';
const CURRENT_CLASS = 'current';
const EXPECTING_CLASS = 'expecting';
const MAIN_CONTENT = document.getElementById('content');
const SUGGESTION_CONTENT = document.getElementById('suggestion-content');
const INPUT_SUGGESTION = document.getElementById('input-suggestion');
const INPUT_IMAGE = document.getElementById('input-img');
const BUTTON_ADD_SUGGESTION = document.getElementById('btn-add-suggestion');
const BUTTON_GET_SUGGESTIONS = document.getElementById('suggestions');
const BUTTON_REFRESH = document.getElementById('refresh');
const SPINNER = document.getElementById('spinner');
const NO_RESULTS = document.getElementById('no-results');

const submitOnEnter = (e) => {
    e.preventDefault();
    if (e.keyCode === 13) {
        BUTTON_ADD_SUGGESTION.click();
    }
};

const initializeSearch = () => {
    titleService.getAvailableTitles().then(populate);
};

const populate = (result) => {
    setDisplay(SPINNER, false);

    if (result.length === 0) {
        setDisplay(NO_RESULTS, true);
        return;
    }

    /*{title, poster, release, link, reservation = null}*/
    result.forEach((title) => {
        const type = title.release ? EXPECTING_CLASS : CURRENT_CLASS;
        appendRow(MAIN_CONTENT, title, type);
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

const appendSuggestion = (content, {title, poster}) => {
    const p = document.createElement('p');
    p.innerHTML = `${title}: <a href="${poster}">Source</a>`;
    content.appendChild(p);
};

const removeChildren = (element) => {
    while (element.hasChildNodes()) {
        element.removeChild(element.firstChild);
    }
};

const setDisplay = (element, type, display = 'block') => {
    element.style.display = type ? display : 'none';
};

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.href.endsWith('#suggestions-popup')) {
        BUTTON_GET_SUGGESTIONS.click();
    }
    initializeSearch();
});

INPUT_SUGGESTION.addEventListener('keyup', submitOnEnter);

BUTTON_ADD_SUGGESTION.addEventListener('click', () => {
    const title = INPUT_SUGGESTION.value;
    const poster = INPUT_IMAGE.value;

    if (title && poster) {
        suggestionService.addSuggestion({title, poster}).then(() => {
            INPUT_SUGGESTION.value = EMPTY_STRING;
            INPUT_IMAGE.value = EMPTY_STRING;
        });
    }
});

BUTTON_GET_SUGGESTIONS.addEventListener('click', () => {
    removeChildren(SUGGESTION_CONTENT);
    suggestionService.getSuggestions().then((response) => {
        const obj = JSON.parse(response);
        Object.keys(obj).forEach((key) => {
            appendSuggestion(SUGGESTION_CONTENT, obj[key])
        });
    });
});

BUTTON_REFRESH.addEventListener('click', (e) => {
    e.preventDefault();
    removeChildren(MAIN_CONTENT);
    setDisplay(NO_RESULTS, false);
    setDisplay(SPINNER, true);
    initializeSearch();
});