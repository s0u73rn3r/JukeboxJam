import { addPlaylist, addLastAddedSong } from './musicScript.js';
import Song from '../models/Song.js';

const electron = require('electron');
const ipc = electron.ipcRenderer;

let currentSongs = [];

ipc.send('getCurrentSongsOnPlaylist');

let addBtn = document.getElementById("add");
let backBtn = document.getElementById("back");

backBtn.addEventListener("click", function(event) {
    window.location.href = "../landingView/landing.html";
});

addBtn.addEventListener("click", function(event) {
    let input = document.createElement('input');
    input.type = 'file';

    input.onchange = e => {
        let filePath = '';
        let fileName = '';

        filePath = e.target.files[0].path;
        fileName = e.target.files[0].name;

        currentSongs.push(new Song(fileName, '', '', '', filePath));
        addSongToScreen(fileName);
        addLastAddedSong(currentSongs);
        ipc.send('addSongToDatabase', filePath, fileName);
    }; 

    input.click();

});

function addSongToScreen(fileName) {
    let song = document.createElement("li");

    let songName = document.createTextNode(fileName);
    song.classList.add("song");
    song.appendChild(songName);

    let songs = document.getElementById("songs");
    songs.appendChild(song);

}

ipc.on('currentSongsOnPlaylistReceived', (event, mySongs) => {

    for (let counter = 0; counter < mySongs.length; counter++){

        currentSongs[counter] = new Song(mySongs[counter].filename, '', '', '', mySongs[counter].metadata.filePath);
        addSongToScreen(currentSongs[counter].title);

    }

    addPlaylist(currentSongs);

}); 