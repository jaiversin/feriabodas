/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

//$(document).ready(function()
//{
//
//    document.addEventListener("deviceready", onDevice, true);
//    alert('dime que llega');
//});

var onDevice = function() {
    createDB();
    getSqlResultEvents();
    initApp();
};

var db = 0;
var name = '';
var email = '';
var lst_users = '';

function populateDB(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS users (id INTEGER primary key autoincrement, name TEXT NOT NULL, email TEXT NOT NULL)');
    tx.executeSql('INSERT INTO users (id, name, email) VALUES (1, "Alfredo Ortegón", "alorse@gmail.com")');
    tx.executeSql('INSERT INTO users (id, name, email) VALUES (2, "Felipe Salazar", "fsalazar@tresdiseno.com")');
}

function createDB() {
    if (!db) {
        db = window.openDatabase("FeriaBodas", "1.0", "Feria Bodas", 200000);
    }
    db.transaction(populateDB, errorCB, successCreateCB);
}


function errorCB(err) {
    console.log("Tenemos un error SQL: " + err.code);
}
function successCreateCB() {
    console.log("¡Base de datos Feria Bodas Creada full!");
}

var save_user = function() {
    var mytext = document.getElementById("sub");
    mytext.focus();
    var ck_email = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    
    name = document.getElementById('name').value;
    email = document.getElementById('email').value;
    if (name !== '' && email) {
        if (ck_email.test(email)) {
            generateUser();
            getSqlResultEvents();
            showPopUpMessage("¡Gracias!<p>En cuanto Wedding Happy esté disponible serás de los primeros en saberlo.</p>");
            setTimeout('hidePopUpMessage()', 4800);
        }
        else{
            alert('Digita un email valido.');
        }
    } else
        alert('Por favor completa todos los campos.');
    
};

var insert_user = function(tx) {
    tx.executeSql('INSERT INTO users (name, email) VALUES ("' + name + '", "' + email + '")');
};

var generateUser = function() {
    if (!db) {
        db = window.openDatabase("FeriaBodas", "1.0", "Feria Bodas", 200000);
    }
    db.transaction(insert_user, errorCB, successCreateCB);
};



function getSqlResultEvents() {
    if (!db) {
        db = window.openDatabase("FeriaBodas", "1.0", "Feria Bodas", 200000);
    }
    db.transaction(queryDBEvents, errorCB);
}


function queryDBEvents(tx) {
    tx.executeSql('SELECT * FROM users', [], querySuccessEvents, errorCB);
}

function querySuccessEvents(tx, results) {
    var lst = '';
    if (results.rows.length > 0) {
        lst += '<ol reversed>';
        for (var i = results.rows.length - 1; i >= 0; i--) {
            lst_users += results.rows.item(i).name + ' : ' + results.rows.item(i).email + ', %0D%0A';
            if (results.rows.item(i).email)
                lst += '<li>' + results.rows.item(i).email + '</li>';
        }
        lst += '</ol>';
        document.getElementById("lst_mails").innerHTML = lst;
    }
}

var overlayElement = null;
var modalWindowElement = null;

function initApp() {
    setTimeout(function() {
               window.scrollTo(0, 1);
               }, 10);
}
//show the modal overlay and popup window
function showPopUpMessage(msg) {
    overlayElement = document.createElement("div");
    overlayElement.className = 'modalOverlay';
    modalWindowElement = document.createElement("div");
    modalWindowElement.className = 'modalWindow';
    modalWindowElement.innerHTML = msg;
    modalWindowElement.style.left = (window.innerHeight - 250) / 2 + "px";
    document.body.appendChild(overlayElement);
    document.body.appendChild(modalWindowElement);
    setTimeout(function() {
               modalWindowElement.style.opacity = 1;
               overlayElement.style.opacity = 0.4;
               overlayElement.addEventListener("click", hidePopUpMessage, false);
               }, 300);
}
//hide the modal overlay and popup window
function hidePopUpMessage() {
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    modalWindowElement.style.opacity = 0;
    overlayElement.style.opacity = 0;
    overlayElement.removeEventListener("click", hidePopUpMessage, false);
    setTimeout(function() {
               document.body.removeChild(overlayElement);
               document.body.removeChild(modalWindowElement);
               }, 700);
}

function share_email() {
    var f_mail = '', f_subject = 'Usuarios para Wedding Happy';
    window.location = 'mailto:' + f_mail + '?subject=' + f_subject + '&body=' + lst_users;
}