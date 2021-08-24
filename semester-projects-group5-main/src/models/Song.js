export default class Song {
    constructor(title, artist, album, genre, pathname) {
        this._title = title;
        this._artist = artist;
        this._album = album;
        this._genre = genre;
        this._pathname = pathname;
    }

    get pathname() {
        return this._pathname;
    }

    get title() {
        return this._title;
    }

    get artist() {
        return this._artist;
    }

    get album() {
        return this._album;
    }

    get genre() {
        return this._genre;
    }
}