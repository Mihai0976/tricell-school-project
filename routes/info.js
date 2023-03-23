const express = require('express');
const router = express.Router();
router.use(express.json());

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

// --------------------- Default-sida (om ingen info-sida anges) -------------------------------
router.get('/', function(request, response)
{
    response.setHeader('Content-type','text/html');
    response.write(htmlHead);
    if (request.session.loggedin) {
        htmlLoggedinMenu = readHTML('./loggedinmenu.html');
        response.write(htmlLoggedinMenu);
    }
    response.write(htmlHeader);
    response.write(htmlMenu);
    response.write(htmlInfoStart);

    htmlInfo = readHTML('./public/text/index.html');
    response.write(htmlInfo);

    response.write(htmlInfoStop);
    response.write(htmlFooter);
    response.write(htmlBottom);
    response.end();
});

// --------------------- Läs en specifik info-sida -----------------------------------------------
router.get('/:infotext', function(request, response)
{
    const infotext = request.params.infotext;
    
    response.setHeader('Content-type','text/html');
    response.write(htmlHead);

    if (request.session.loggedin) { htmlLoggedinMenu = readHTML('./loggedinmenu.html'); response.write(htmlLoggedinMenu); }
    
    response.write(htmlHeader);
    response.write(htmlMenu);
    response.write(htmlInfoStart);

    // Kollar om inskickade sidan existerar, annars läs default 
    const filepath = path.resolve(__dirname, "../public/text/"+infotext+'.html');
    if (fs.existsSync(filepath)) 
    { 
        htmlInfo = readHTML('./public/text/'+infotext+'.html');      
    }
    else
    {
        htmlInfo = readHTML('./public/text/index.html');
    }
    response.write(htmlInfo);

    response.write(htmlInfoStop);
    response.write(htmlFooter);
    response.write(htmlBottom);
    response.end();
});

module.exports = router;