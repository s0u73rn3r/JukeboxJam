import Playlist from "../models/Playlist.js";
import ListeningRoom from "../models/ListeningRoom.js";

const electron = require('electron');
const ipc = electron.ipcRenderer;



var playlist = $('#playlist-options');
let button = $(' .btn-shake');
let logoutButton = $('.btn-logout');
let createRoomButton = $('#createRoom');
let joinRoomButton = $('#joinRoom');
let length = $(playlist).length;
let currentPlaylist;
let user;
let isEditMode = false;



ipc.send("getCurrentUser");
ipc.send("getPlaylists");


//this receives the ID of the current user from main.js and saves it the userId variable
ipc.on("currentUserReceived", (event, usr) => {

    user = JSON.parse(usr);
    console.log(user);

});


ipc.on("playlistsReceived", (event, playlists) => {
    playlists.forEach(playlist => addPlaylistToDocument(JSON.parse(playlist)));

});

ipc.on("onSuccess", (event) => {
    console.log("Success!");
    location.reload();
});

ipc.on("onFail", (event) => {
    alert("Operation failed. Please try again later");
});

button.on('click', function() {
    //addPlaylistToDocument(new Playlist("New Playlist", "", "", ""));
    addPlaylist();
    location.reload();
});


logoutButton.on('click', function() {
    window.location.href = "../loginView/login.html";
});

createRoomButton.on('click', function() {
    //Create the server
    let name = user._userName + "'s Personal Room";
    console.log(name);
    ipc.send("createRoom", new ListeningRoom(user._id, name));
    window.location.href = "../listeningRoomView/room.html";



});

joinRoomButton.on('click', function() {
    ipc.send("joinRoom");
});






function addPlaylistToDocument(pls) {
    let card = $(`<div class="card bg-dark text-white" data-id = ${pls._id} style="width: 18rem;">
    <img src="https://www.viewhotels.jp/asakusa-annex/wp-content/uploads/sites/6/2020/03/test-img.jpg" class="card-img-top" alt="...">
    <div class="card-body">
    <h5 class="card-title">${pls._playlistTitle}</h5>
    </div>
    <div class ="buttons">
    </div>
    </div>`);

    $(card).appendTo(playlist);
    $(card).attr('spellcheck', 'false');



    let removeButton = $(`<button class="btn btn-outline-danger" id="remove">Remove</button>`);
    let editButton = $(`<button type="button" class="btn btn-outline-success" id="edit">Edit</button>`);
    let songsButton = $(`<button type="button" class="btn btn-outline-info" id="songs">Songs</button>`);

    $('.buttons:last').append(songsButton);
    $('.buttons:last').append(editButton);
    $('.buttons:last').append(removeButton);

    songsButton.on('click', function(event) {
        /* Gets playlistName so that eventually such a playlist can be searched and the songs in it can be displayed. */
        let playlistName = event.target.parentElement.parentElement.querySelector('.card-title').textContent;
        ipc.send('assignCurrentPlaylist', playlistName);
        window.location.href = "../playlistView/playlist.html";
    });


    editButton.on('click', function(event) {

        if (!isEditMode) {
            $('.card-title').attr('contenteditable', 'true');
            event.target.innerText = "Save";
            isEditMode = true;
        } else {
            let playlistName = event.target.parentElement.parentElement.querySelector('.card-title').textContent;
            let playlistId = event.target.parentElement.parentElement.dataset.id;
            ipc.send("savePlaylistName", playlistName, playlistId);
            event.target.innerText = "Edit";
            isEditMode = false;

        }
    });

    removeButton.on('click', function(event) {
        let playlistId = event.target.parentElement.parentElement.dataset.id;
        ipc.send("removePlaylist", playlistId);
        length--;
    });


}

function addPlaylist() {

    const currentPlaylistName = "New Playlist";
    const currentImage = $("img").attr("src");
    currentPlaylist = new Playlist(currentPlaylistName, currentImage, "", user._id);
    ipc.send('addPlaylistToDatabase', currentPlaylist);

}