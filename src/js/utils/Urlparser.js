export default class {
    constructor(url) {
        const a = document.createElement('a');
        a.href = url;
        this.anchor = a;
        return this;
    }

    _split() {
        return this.anchor.href.split('/');
    }

    contains(str) {
        return this.anchor.href.includes(str);
    }

    containsDotExtension() {
        const split = this._split();
        return split[split.length - 1].includes('.');
    }
}

