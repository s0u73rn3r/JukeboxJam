import { addPlaylist, addLastAddedSong } from './musicScript.js';
import Song from '../models/Song.js';

const electron = require('electron');
const ipc = electron.ipcRenderer;

let songNames = []; 
let listeningRoomEmpty = true; 
let numberOfCheckedItems = 0; 

let roomNameTitle;
let songListEl = document.getElementById("songs");
let title = document.getElementById("room-title");
let addSongsBtn = document.getElementById("add-songs");
let songPicker = document.getElementById("song-picker");
let closeBtn = document.getElementById("close");
let backButton = document.getElementById("close-listening-room");

let addSelectedSongsBtn = document.getElementById('add-song');

let songsList = []; 

ipc.send("getListeningRoom");
ipc.on("onListeningRoomReceived", (event, room) => {
    roomNameTitle = `<h2>${room._name}</h2`;
    title.innerHTML = roomNameTitle;
});

ipc.on("onSongsReceived", (event, songs) => {
    songs.forEach((song) => {
        addSongToPicker(JSON.parse(song));
    });
});

backButton.addEventListener("click", (event) => {
    ipc.send("deleteListeningRoom");
    window.location.href = "../landingView/landing.html";
});

addSongsBtn.addEventListener("click", (event) => {
    ipc.send("getAllSongs");
    showSongPicker();
});

closeBtn.addEventListener("click", (event) => {
    closeSongPicker();
    songListEl.innerHTML = '';
});

addSelectedSongsBtn.addEventListener('click', (event) => {

    numberOfCheckedItems = 0; 

    let selectedSongs = document.getElementsByName('selectedSong');

    for (let myCounter = 0; myCounter < selectedSongs.length; myCounter++) {

        if (selectedSongs[myCounter].checked) {
            songNames.push(selectedSongs[myCounter].value); 
            addSongToScreen(songNames[songNames.length - 1]); 
            numberOfCheckedItems = numberOfCheckedItems + 1; 
        }

    }

    songListEl.innerHTML = ''; 
    closeSongPicker();

    ipc.send('AddSongsToListeningRoom', songNames);

});

function addSongToScreen(fileName) {
    let song = document.createElement("li");

    let songName = document.createTextNode(fileName);
    song.classList.add("song");
    song.appendChild(songName);

    let songs = document.getElementById("song-list");
    songs.appendChild(song);

}

function showSongPicker() {
    songPicker.style.display = "block";
}

function closeSongPicker() {
    songPicker.style.display = "none";
}

function addSongToPicker(song) {

    let songEl = document.createElement("li");

    let checkBox = document.createElement("input");
    checkBox.setAttribute('type', 'checkbox');
    checkBox.setAttribute('name', 'selectedSong');
    checkBox.setAttribute('value', song.filename);
    songEl.appendChild(checkBox);

    let songName = document.createTextNode(song.filename);
    songEl.appendChild(songName);
    songEl.classList.add("song");

    songListEl.appendChild(songEl);

}

ipc.on('SendingSongPathsFromDB', (event, songsForListeningRoom) =>{

    if (listeningRoomEmpty){

        for (let theCounter = 0; theCounter < songsForListeningRoom.length; theCounter++){
            songsList[theCounter] = new Song (songsForListeningRoom[theCounter].filename, '', '', '', songsForListeningRoom[theCounter].metadata.filePath);
            
        }

        addPlaylist(songsList);
        listeningRoomEmpty = false; 
        
    } else {

        for (let theCounter = numberOfCheckedItems; theCounter > 0; theCounter--){
            songsList.push(new Song (songsForListeningRoom[songsForListeningRoom.length - theCounter].filename, '', '', '', songsForListeningRoom[songsForListeningRoom.length - theCounter].metadata.filePath));
            addLastAddedSong(songsList);
        }

    }

});