import getAvailableTitles from "./js/services/match.service";
import suggestionService from "./js/services/suggestion.service";
import anchorService from "./js/services/anchor.service";

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
    getAvailableTitles().then(populate);
};

const populate = (result) => {
    setDisplay(SPINNER, false);
    setDisplay(BUTTON_REFRESH, true);

    if (result.length === 0) {
        setDisplay(NO_RESULTS, true);
        return;
    }

    result.forEach((title) => {
        const type = title.release ? EXPECTING_CLASS : CURRENT_CLASS;
        appendRow(MAIN_CONTENT, title, type);
    });
};

const appendRow = (content, { title, poster, release, link, reservation }, type) => {
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

const appendSuggestion = (content, { title, poster }, id) => {
    const p = document.createElement('p');
    p.textContent = title;

    p.appendChild(anchorService.createDeleteAnchor(id, (e) => {
        if (confirm('Weet je het zeker?')) {
            const { id, parentNode } = e.target;
            suggestionService.deleteSuggestion(id).then(() => {
                parentNode.parentNode.removeChild(parentNode);
            });
        }
    }));

    p.appendChild(anchorService.createSourceAnchor(poster));

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
        suggestionService.addSuggestion({ title, poster }).then(() => {
            INPUT_SUGGESTION.value = EMPTY_STRING;
            INPUT_IMAGE.value = EMPTY_STRING;
        });
    }
});

BUTTON_GET_SUGGESTIONS.addEventListener('click', () => {
    removeChildren(SUGGESTION_CONTENT);
    suggestionService.getSuggestions().then((obj) => {
        Object.keys(obj).forEach((key) => {
            appendSuggestion(SUGGESTION_CONTENT, obj[key], key);
        });
    });
});

BUTTON_REFRESH.addEventListener('click', (e) => {
    e.preventDefault();
    removeChildren(MAIN_CONTENT);
    setDisplay(NO_RESULTS, false);
    setDisplay(SPINNER, true);
    setDisplay(BUTTON_REFRESH, false);
    initializeSearch();
});