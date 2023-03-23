/* ----------------------------- 3:rd party-moduler ------------------------------ */
const config = require('./config/globals.json');
const express = require('express');
const session = require("express-session");
const bodyParser = require('body-parser');
const app = express();                  /* Skapa webbserver-objektet */
app.use(express.static('./public'));    /* Skapa global path till "public"-mappen */

app.use(
session({
  secret: 'thisisasecret',
  saveUninitialized: true,
  resave: false
}));

app.use(bodyParser.json());
  app.use(
  bodyParser.urlencoded({
  extended: true
}));

/* ------------------------------ Egna moduler ----------------------------------- */
const readHTML = require('./readHTML.js');

    /* Läs respektive HTML-text-sida för Masterframen */
    var htmlHead = readHTML('./head.html');
    var htmlHeader = readHTML('./header.html');
    var htmlMenu = readHTML('./menu.html');
    var htmlInfoStart = readHTML('./infoStart.html');
    var htmlIndex = readHTML('./public/text/index.html');
    var htmlInfoStop = readHTML('./infoStop.html');
    var htmlFooter = readHTML('./footer.html');
    var htmlBottom = readHTML('./bottom.html');

/* ------------- Skapa routes för de alternativa rutterna i webbapplikationen ------------------------- */
const info = require('./routes/info');
const personnelregistry = require('./routes/personnelregistry');
const login = require('./routes/login');
const logout = require('./routes/logout');
const virusdatabase = require('./routes/researchDataBase');

/* -------------- Skapa default-router (om ingen under-sökväg anges av användaren) --------------------- */
app.get('/', function (request, response)
{
    response.send(htmlHead+htmlHeader+htmlMenu+htmlInfoStart+htmlIndex+htmlInfoStop+htmlFooter+htmlBottom);
    response.end();
});

app.use('/api/info', info);
app.use('/api/personnelregistry', personnelregistry);
app.use('/api/login', login);
app.use('/api/logout', logout);
app.use('/api/researchDataBase', virusdatabase);
/* ---------------------------------- Starta webbservern ------------------------------ */
const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`Listening on port ${port}... `));