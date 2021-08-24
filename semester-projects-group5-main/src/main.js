const electron = require('electron');
const app = electron.app;
const ipc = electron.ipcMain;
const dialog = electron.dialog;
const BrowserWindow = electron.BrowserWindow;

const MongoClient = require('mongodb').MongoClient;
const mongodb = require('mongodb');
const path = require('path');
const fs = require('fs');
const { ObjectId } = require('mongodb');
const express = require('express');

/***************************
 * SETTING UP THE DATABASE *
 ***************************/
const URI = 'mongodb+srv://main-admin:RDjysc0QZslmtbRW@jukebox-jam.tscft.mongodb.net/Jukebox-Jam-DB?retryWrites=true&w=majority';
let mainWindow;
let currentDatabase;
let currentCollection;
let bucket;
let expressApp = express();
let roomWindow = null;
let listeningRoom = {};

MongoClient.connect(URI, (err, client) => {

    if (err) {
        console.log("Something unexpected happened connecting to MongoDB Atlas...");
    }

    console.log("Connected to MongoDB Atlas...");

    currentDatabase = client.db('JukeBox-Jam-DB'); /* currentDatabase contains a Db */

    bucket = new mongodb.GridFSBucket(currentDatabase, { bucketName: 'songs' });

});


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    app.quit();
}

const createWindow = () => {
    // Create the browser window.
    express();
    // expressApp = express();
    mainWindow = new BrowserWindow({
        width: 1620,
        height: 780,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
        }
    });

    mainWindow.loadFile(path.join(__dirname, 'views/loginView/login.html'));
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});


let user = {};
let currentPlaylist = {};
let registeringUser = {};


/****************************
 * HANDLING OF THE DATABASE *
 ****************************/
ipc.on('checkUsernameRegistration', async(event, currentUsername) => {

    currentCollection = currentDatabase.collection('UsersInformation');

    let myDocument = await currentCollection.findOne({ _userName: currentUsername });

    if (myDocument !== null) { /* If myDocument is not null, that means that that there is already someone with that username in the DB. */

        let validUsername = false;

        dialog.showErrorBox('Username Already Exists', 'Please try a different username.');
        event.sender.send('isUsernameValid', validUsername);

    } else {

        let validUsername = true;
        event.sender.send('isUsernameValid', validUsername);

    }

});

ipc.on('loginUser', async(event, loginInfo) => {
    currentCollection = currentDatabase.collection('UsersInformation');
    user = await currentCollection.findOne({ _userName: loginInfo.userName });

    if (user === null) {
        dialog.showErrorBox('Username does not exist', 'Try again');
    } else {

        if (user._password === loginInfo.password) {
            event.sender.send('loginSuccesful', user); // Don't understand why we are sending something if it is never used. 
        } else {
            dialog.showErrorBox('Password is incorrect', 'Try again');
        }
    }
});


/* The following function will assign the local variable currentPlaylist with the playlist that the user entered. 
 * This will then be used to retrieve the songs from such a playlist, since we have the information stored in the metadata field. */
ipc.on('assignCurrentPlaylist', async(event, playlistName) => {
    let playlistCollection = currentDatabase.collection('Playlists');
    currentPlaylist = await playlistCollection.findOne({ _userID: user._id.toString(), _playlistTitle: playlistName });
});


ipc.on('addUserToDatabase', async(event, currentUser) => {

    currentCollection = currentDatabase.collection('UsersInformation');
    currentCollection.insertOne(currentUser);

    /* For some reason this is being assigned the value from the query, but only within this method. 
     * For example, when I try to print the registeringUser outside, it will print an empty object. */
    registeringUser = await currentCollection.findOne({ _userName: currentUser._userName });

    const myOptions = {
        type: 'info',
        buttons: ['Continue'],
        defaultId: 0,
        title: 'Success',
        message: 'Your account has been created.'
    };

    dialog.showMessageBox(mainWindow, myOptions);

});

ipc.on('updateSubscription', async(event, currentUsername, currentSubscription) => {

    /* For some reason, using the registeringUser will show the desired user here.
     * However, it won't work below on the getRegisteredUser that communicates with subscriptionScript. */

    const currentOptions = { returnOriginal: false };

    currentCollection = currentDatabase.collection('UsersInformation');
    registeringUser = await currentCollection.findOneAndUpdate({ _userName: currentUsername }, { $set: { subscriptionType: currentSubscription } }, currentOptions);

});

ipc.on('addPlaylistToDatabase', (event, currentPlaylist) => {

    currentCollection = currentDatabase.collection('Playlists');
    currentCollection.insertOne(currentPlaylist);

});


ipc.on('addSongToDatabase', (event, filepath, fileName) => {

    const buffer = fs.readFileSync(filepath); /* Why is buffer here if it is never used? */

    let writeStream = bucket.openUploadStream(fileName, {
        metadata: {
            userLinkedTo: user._id.toString(),
            playlistLinkedTo: currentPlaylist._playlistTitle,
            filePath: filepath
        }
    });

    writeStream.write(filepath);
    writeStream.end();

    console.log('Song was added successfullly');

});

ipc.on('getSongFromDatabase', (event, songID) => {

    const buffer = fs.readFileSync(filepath);
    var readStream = bucket.openDownloadStream(songID);

    //WIP. Buffer holds song data
    readStream.pipe(buffer);
    //Do something with buffer to display songs (Should be done in playlist script) and make them playable


});

/****************************
 * HANDLING OF INPUT ERRORS *
 ****************************/
ipc.on('emptyUsername', (event) => {

    dialog.showErrorBox('Empty Username Field', 'Please provide a username.');

});

ipc.on('emptyPasswords', (event) => {

    dialog.showErrorBox('Empty Passwords Field', 'Please provide a password on both field');

});

ipc.on('unmatchingPasswords', (event) => {

    dialog.showErrorBox('Passwords Do Not Match', 'Please enter your password again.');

});

//this will retrieve all the playlists from the database associated with the current user
ipc.on("getPlaylists", async(event) => {
    playlistArr = [];

    playlistCollection = currentDatabase.collection('Playlists');
    let playlists = await playlistCollection.find({ _userID: user._id.toString() });
    await playlists.forEach(playlist => playlistArr.push(JSON.stringify(playlist)));
    event.sender.send("playlistsReceived", playlistArr);

});

ipc.on('getCurrentUser', (event) => {
    event.sender.send("currentUserReceived", JSON.stringify(user));
});

ipc.on('getRegisteringUser', async(event) => {
    /* This is giving me issues because it is passing registeringUser._userName as null even though it has been already set. 
     * It was supposed for this communication to keep trackof the information of the user as swaps through registrations pages. */
    event.sender.send('registeringUserReceived', registeringUser._userName);

});

/* The following may not be necessary, but I would the body for it just in case that this function might come in handy. */
ipc.on('getCurrentSongsOnPlaylist', async(event) => {
    let songsCollection = currentDatabase.collection('songs.files');
    let mySongs = await songsCollection.find({
        'metadata.userLinkedTo': user._id.toString(),
        'metadata.playlistLinkedTo': currentPlaylist._playlistTitle
    }).toArray();
    event.sender.send('currentSongsOnPlaylistReceived', mySongs);
});

ipc.on('savePlaylistName', async(event, name, id) => {
    playlistCollection = currentDatabase.collection('Playlists');
    result = await playlistCollection.updateOne({ "_id": ObjectId(id) }, { $set: { "_playlistTitle": name } });
    if (!result || result.nModified <= 0) { event.sender.send("onFail"); } else { event.sender.send("onSuccess"); }
});

ipc.on('removePlaylist', async(event, id) => {
    playlistCollection = currentDatabase.collection('Playlists');
    result = await playlistCollection.deleteOne({ "_id": ObjectId(id) });
    event.sender.send("onSuccess");
});

//get an array of songs(stringified objects) that belong to the current user
ipc.on('getAllSongs', async(event) => {
    songsArr = [];
    let songCollection = currentDatabase.collection('songs.files');
    let songs = await songCollection.find({ 'metadata.userLinkedTo': user._id.toString() });
    await songs.forEach(song => songsArr.push(JSON.stringify(song)));
    event.sender.send("onSongsReceived", songsArr);

});

ipc.on('AddSongsToListeningRoom', async (event, songNames) => {

    let songsForListeningRoom = [];
    let songCollection = currentDatabase.collection('songs.files'); 

    for (let theCounter = 0; theCounter < songNames.length; theCounter++){
        songsForListeningRoom[theCounter] = await songCollection.findOne({'metadata.userLinkedTo': user._id.toString(), 'filename': songNames[theCounter]}); 
    }

    /* A way for improving this method would be by adding the songs into the ListeningRoomDB. 
     * However, we didn't approach it that way because we had troubles with streaming from the database to a site. */ 

    event.sender.send('SendingSongPathsFromDB', songsForListeningRoom);

});

ipc.on('createRoom', async(event, room) => {
    let listeningRoomCollection = currentDatabase.collection("ListeningRoom");
    let result = await listeningRoomCollection.insertOne(room);
    if (result.insertedCount > 0) {
        listeningRoom._id = result.insertedId;
        listeningRoom._ownerId = result.ops[0]._ownerID;
        listeningRoom._name = result.ops[0]._name;

        expressApp.get('/', function(req, res) {
            res.sendFile(path.join(__dirname + '/views/listeningRoomView/roomListener.html'));
        });

    }   

});

ipc.on('getListeningRoom', (event) => {
    event.sender.send("onListeningRoomReceived", listeningRoom);
});

ipc.on('deleteListeningRoom', (event) => {
    let listeningRoomCollection = currentDatabase.collection("ListeningRoom");
    listeningRoomCollection.deleteMany({ _ownerID: user._id.toString() });

});

ipc.on('joinRoom', (event) => {
    if (roomWindow) {
        roomWindow.focus();
        return;
    }

    roomWindow = new BrowserWindow({
        height: 780,
        resizable: true,
        width: 1620,
        title: 'Room',
        minimizable: false,
        fullscreenable: false
    });

    roomWindow.loadURL('http://localhost:3000');

    roomWindow.on('closed', function() {
        roomWindow = null;
    });

});

/*******************************
 * SUCCESSFULLY SET UP EXPRESS *
 *******************************/ 

const workingPort = 3000;
expressApp.listen(workingPort, () => {
    console.log('Express started on http://localhost:' + workingPort);
});