require('howler');

import Playlist from "../models/Playlist.js";

let playButton = document.getElementById('howler-play');
let pauseButton = document.getElementById('howler-pause');
let stopButton = document.getElementById('howler-stop');
let volupButton = document.getElementById('howler-volup');
let voldownButton = document.getElementById('howler-voldown');
let nextButton = document.getElementById('howler-next');
let prevButton = document.getElementById('howler-prev');
let title = document.getElementById('title');


let playlist = [];
let songNames = [];
let index = 0;



function addPlaylist(songList) {
    playlist = [];
    songNames = [];
    for (let i = 0; i < songList.length; i++) {
        songNames[i] = songList[i].title;
        playlist[i] = new Howl({
            src: [songList[i].pathname]
        });
    }

}

/* The function addLastAddedSong adds a single song into a playlist. It was designed with it only being able to select a single song. 
 * Down the road, we realized that we can also add several songs into a listeningRoom at a time and thus I created a similar function. */ 
function addLastAddedSong(songList){  

    let counter = (songList.length - 1); 
    songNames[counter] = songList[counter].title; 
    playlist[counter] = new Howl({
        src: [songList[counter].pathname]
    });
}

function addSongsToListeningRoom(songList, numberOfSongs){

    let counter = (songList.length - numberOfSongs); 
    songNames[counter] = songList[counter].title; 
    playlist[counter] = new Howl ({
        src: [songList[counter].pathname]
    });

}

nextButton.addEventListener('click', (e) => {
    playlist[index].stop();
    index++;
    if (index == playlist.length) {
        index = 0;
        playlist[index].play();
    }
    else {
        playlist[index].play();
    }

    title.innerText = songNames[index];

});

prevButton.addEventListener('click', (e) => {

    playlist[index].stop();
    index--;
    if (index == -1) {
        index = playlist.length - 1;
        playlist[index].play();
    }
    else {
        playlist[index].play();
    }
    playlist[index].play();



    title.innerText = songNames[index];

});

playButton.addEventListener('click', (e) => {

    playlist[index].play();
    title.innerText = songNames[index];

});

pauseButton.addEventListener('click', (e) => {

    playlist[index].pause();

});


volupButton.addEventListener('click', (e) => {

    var vol = playlist[index].volume();
    vol += 0.1;
    if (vol > 1) {
        vol = 1;
    }
    playlist[index].volume(vol);

});

voldownButton.addEventListener('click', (e) => {

    var vol = playlist[index].volume();
    vol -= 0.1;
    if (vol < 0) {
        vol = 0;
    }
    playlist[index].volume(vol);

});
const player = document.querySelector('.player');

function clickHandler() {
    const buttons = Array.from(this.children);
    buttons.forEach(button => button.classList.toggle('hidden'));
}

player.addEventListener('click', clickHandler);

export { addPlaylist, addLastAddedSong };