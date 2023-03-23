const express = require('express');
const router = express.Router();

router.use(express.static('./public'));
const path = require('path');


// --------------------- Läs in Masterframen --------------------------------------------------
const readHTML = require('../readHTML.js');
const fs = require('fs');

    var htmlHead = readHTML('./head.html');
    
    var htmlHeader = readHTML('./header.html');
    var htmlMenu = readHTML('./menu.html');    
    var htmlInfoStart = readHTML('./infoStart.html');
    var htmlInfoStop = readHTML('./infoStop.html');
    var htmlFooter = readHTML('./footer.html');
    var htmlBottom = readHTML('./bottom.html');

// --------------------- Router -----------------------------------------------
router.get('/', function(request, response)
{
 
    request.session.destroy();

    response.setHeader('Content-type','text/html');
    response.write(htmlHead);
    //if(request.session.loggedin){htmlLoggedinMenu = readHTML('./loggedinmenu.html');response.write(htmlLoggedinMenu);}
    response.write(htmlHeader);
    response.write(htmlMenu);
    response.write(htmlInfoStart);

    response.write("User logged out");

    response.write(htmlInfoStop);
    response.write(htmlFooter);
    response.write(htmlBottom);
    response.end();
});

module.exports = router;