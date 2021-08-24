const electron = require('electron');
const ipc = electron.ipcRenderer;

/* In this file, you will not be able to know the Current User because it won't be assigned until after he signs in.
 * I tried doing so, but unfortunately that broke the program, telling me couldn't call toString() to an undefined variable. */ 

let loginBtn = document.getElementById('log');

loginBtn.addEventListener("click", function(e) {
    e.preventDefault();

    let un = document.getElementById('Uname').value;
    let pw = document.getElementById('Pass').value;

    if (un === "") {
        ipc.send('emptyUsername');
    } else if (pw === "") {
        ipc.send('emptyPasswords');
    } else {
        ipc.send('loginUser', { userName: un, password: pw });
        if (document.getElementById('check').checked) {
            settings.set('login');
        }
    }
});

ipc.on('loginSuccesful', (event, user) => {
    
    window.location.href = '../landingView/landing.html';
    //userID = db.UsersInformation.find({ _id: userID }); /* This is currently not working ... Check the development tools in Electron. */ 

});

function alertMsg() {
    let alertMsg = document.querySelector('.login');
    let input = document.createElement("input");
    input.type = "checkbox";
    input.id = "alert1";
    let msg = document.createElement("div");
    msg.classList.add("alert");
    msg.classList.add("error");
    let p = document.createElement("p");
    p.classList.add("inner");
    let strong = document.createElement("b");
    strong.append("Error:");
    msg.prepend(input);
    p.prepend(strong);
    p.append(" Username or Password is incorrect!");
    msg.append(p);
    alertMsg.prepend(msg);
}