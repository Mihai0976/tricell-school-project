const config = require('./config/globals.json');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');


const app = express();   

const pug = require('pug');
const { response } = require('express');
const pug_loggedinmenu = pug.compileFile('./masterframe/test.html');

/* ------------------------------ Egna moduler ----------------------------------- */
const readHTML = require('./readHTML.js');

    /* Läs respektive HTML-text-sida för Masterframen */
    var htmlHead = readHTML('./masterframe/head.html');
    var htmlHeader = readHTML('./masterframe/header.html');
    var htmlMenu = readHTML('./masterframe/menu.html');
    var htmlInfoStart = readHTML('./masterframe/infoStart.html');
    var htmlIndex = readHTML('./public/text/index.html');
    var htmlInfoStop = readHTML('./masterframe/infoStop.html');
    var htmlFooter = readHTML('./masterframe/footer.html');
    var htmlBottom = readHTML('./masterframe/bottom.html');


/* -------------- Skapa default-router (om ingen under-sökväg anges av användaren) --------------------- */
app.get('/', function(request, response)
{
    
    response.setHeader('Content-type','text/html');
    response.write(pug_loggedinmenu({
            employeecode: "gkjg",
            name: "khjkljh",
            logintimes: "687687",
            lastlogin: "klhjkljhkl",
          }));
      
    response.end();
});


/* ---------------------------------- Starta webbservern ------------------------------ */
const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`Listening on port ${port}... `));