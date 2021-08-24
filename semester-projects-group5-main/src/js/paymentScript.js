let cancelBtn = document.getElementById('cancelBtn'); 
let submitBtn = document.getElementById('submitBtn'); 

cancelBtn.addEventListener('click', (e) => {
 
    /* If someone clicks cancel then it updates the account with a free membership and is sent to the login screen. */ 

    window.location.href = '../loginView/login.html'; 

});

submitBtn.addEventListener('click', (e) => {

    e.preventDefault(); /* Prevents the form from submitting!*/

    /* If someone clicks cancel then it updates the account with a premium membership and is sent to the login screen. */ 
    /* I also need to add the if statements as long as the fields are not filled. */ 

    window.location.href = '../loginView/login.html'; 

});