import User from "../models/User.js";

const electron = require('electron'); 
const ipc = electron.ipcRenderer; 

let currentUser; 
let confirmBtn = document.getElementById('confirm'); 

confirmBtn.addEventListener('click', (e) => {
    
    e.preventDefault();

    const currentUsername = document.getElementById('Uname').value;
    const currentPassword = document.getElementById('Pass').value;
    const currentConfirmation = document.getElementById('ConfirmPass').value;

    if (currentUsername === ""){

        ipc.send('emptyUsername'); 

    } else {

        if (currentPassword === '' || currentConfirmation === ''){

            ipc.send('emptyPasswords');

        } else {

            if (isPasswordConfirmed(currentPassword, currentConfirmation)) {
                
                // signUp(User); --> I don't know what to do with this function because everything regarding database bust be in index.js. 

                currentUser = new User(currentUsername, currentPassword);

                ipc.send('checkUsernameRegistration', currentUsername);

            } else {

                ipc.send('unmatchingPasswords'); 

                document.getElementById('Pass').value = ''; 
                document.getElementById('ConfirmPass').value = '';

            }

        }

    }

});

/*******************************
 * INTER PROCESS COMMUNICATION *
 *******************************/
ipc.on('isUsernameValid', (event, validUsername) =>{

    if (validUsername === true){

        event.sender.send('addUserToDatabase', currentUser);

        window.location.href = '../subscriptionView/subscription.html';

    } else if (validUsername === false){

        document.getElementById('Uname').value = ''; 

    }

}); 

function isPasswordConfirmed(currentPassword, currentConfirmation) {
    return (currentPassword === currentConfirmation);
}

/*function signUp(User) {
    saveUser(User);
}*/ 