export default {
    createAnchor(text, id, href) {
        const a = document.createElement('a');
        a.innerHTML = text;
        a.id = id;

        if (href) {
            a.href = href;
            a.target = '_blank';
        }

        return a;
    },

    createSourceAnchor(href) {
        const a = this.createAnchor('bron', null, href);
        a.className = 'poster-source';
        return a;
    },

    createDeleteAnchor(id, fn) {
        const a = this.createAnchor('verwijder', id);
        a.addEventListener('click', fn);
        return a;
    }
}