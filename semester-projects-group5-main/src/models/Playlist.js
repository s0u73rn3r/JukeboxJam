export default class Playlist {
    constructor(playlistTitle, image, songs, userID) {
        this.playlistTitle = playlistTitle;
        this._image = image;
        this._songs = songs;
        this._userID= userID;


    }

    get playlistTitle() {
        return this._playlistTitle;
    }

    set playlistTitle(playlistTitle) {
        this._playlistTitle = playlistTitle;
    }

    get image() {
        return this._image;
    }

    get userID() {
        return this._userID;
    }
}