const electron = require('electron');
const ipc = electron.ipcRenderer; 

let currentUsername; 
let currentSubscription; 

let freeBtn = document.getElementById('freeBtn'); 
let premiumBtn = document.getElementById('premiumBtn'); 



freeBtn.addEventListener('click', (e) => {

    currentSubscription = 'Free';

    ipc.send('updateSubscription', currentUsername, currentSubscription); 

    window.location.href = '../loginView/login.html';

});

premiumBtn.addEventListener('click', (e) => {

    currentSubscription = 'Premium'; 

    ipc.send('updateSubscription', currentUsername, currentSubscription);

    window.location.href = '../paymentView/payment.html'; 

});

ipc.send('getRegisteringUser'); 

ipc.on('registeringUserReceived', (event, registeringUsername) => {

    currentUsername = registeringUsername; 

}); 