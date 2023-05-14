/* ----------------------------- 3:rd party-moduler ------------------------------ */
const config = require('./config/globals.json');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();                  /* Skapa webbserver-objektet */
app.use(express.static('./public'));    /* Skapa global path till "public"-mappen */

var cookieParser = require('cookie-parser');
app.use(cookieParser());




// --------------------- Läs in Masterframen --------------------------------------------------
const readHTML = require('./readHTML.js');
const fs = require('fs');

var htmlHead = readHTML('./masterframe/head.html');
var htmlHeader = readHTML('./masterframe/header.html');
var htmlMenu = readHTML('./masterframe/menu.html');    
var htmlInfoStart = readHTML('./masterframe/infoStart.html');
var htmlInfoStop = readHTML('./masterframe/infoStop.html');
var htmlFooter = readHTML('./masterframe/footer.html');
var htmlBottom = readHTML('./masterframe/bottom.html');

// --------------------- Router -----------------------------------------------
app.get('/', function(request, response)
{

  
        response.setHeader('Content-type','text/html');

        response.write(htmlHead);
        response.write(htmlHeader);
        response.write(htmlMenu);
        response.write(htmlInfoStart);
      

                                // Set cookies
                                let userinfo = {
                                  employeecode: "lkhl",
                                  name : "jlkkl",
                                  lastlogin : "5765",
                                  logintime : "gj"
                              };
        
                                      response.cookie("userInfo", userinfo);


        console.log(userinfo);

        response.write(htmlInfoStop);
        response.write(htmlFooter);
        response.write(htmlBottom);
        return response.end();

    
});

const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`Listening on port ${port}... `));