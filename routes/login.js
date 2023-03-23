const express = require('express');
const router = express.Router();
router.use(express.static('./public'));
const path = require('path');

//------- Läs  in Masterframen---------------
const readHTML = require('../readHTML.js');
const fs = require('fs');

var htmlHead = readHTML('./head.html');
var htmlHeader = readHTML('./header.html');
var htmlMenu = readHTML('./menu.html');
var htmlInfoStart = readHTML('./infoStart.html');
var htmlInfoStop = readHTML('./infoStop.html');
var htmlFooter = readHTML('./footer.html');
var htmlBottom = readHTML('./bottom.html');

router.get('/', (request, response) => {
  //import data  from database
    
  if (request.session.loggedin) { htmlLogggedinMenu = readHTML('./loggedinmenu.html');response.write(htmlLogggedinMenu);
    }
  const employeeid = request.query.femployeecode;
  const passwd = request.query.fpassword;
 
  //open the dadabase
  const ADODB = require('node-adodb');
  const connection = ADODB.open(
    'Provider=Microsoft.Jet.OLEDB.4.0; Data Source=./data/mdb/personnelregistry.mdb;'
  );
  async function sqlQuerry() {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(htmlHead);

    response.write(htmlHeader);
    response.write(htmlMenu);
    response.write(htmlInfoStart);

    const result = await connection.query(
      "SELECT passwd, logintimes, lastlogin, lockout FROM users WHERE  employeeCode = '"+employeeid+"'");

    if (result == '') {
      response.write('User not found!');
    } else {
      str_passwd = result[0]['passwd'];
      str_logintimes = result[0]['logintimes'];
      str_lastlogin = result[0]['lastlogin'];
      str_lockout = result[0]['lockout'];
      if (str_lockout == null) {
        if (str_passwd == passwd) {
          // Inloggningen lyckades
          response.write('Login succesfull! <br /><p />');
          response.write('Welcome back <b>' + employeeid + '</b><br /><p />');
          response.write('Number of logins : ' + str_logintimes + '<br /> <p />');
          response.write('Lastlogin : ' + str_lastlogin + '<br />');

          //Start the  session
          request.session.loggedin = true;
          request.session.username = employeeid;

          // Uppdate user-variables
          int_logintimes = parseInt(str_logintimes) + 1;
          let ts = Date.now();
          let date_ob = new Date(ts);
          let date = date_ob.getDate();
          let month = date_ob.getMonth() + 1;
          let year = date_ob.getFullYear();
          str_lastlogin = date + '.' + month + '.' + year;
          //skriv i data base
          async function sqlQuery2() {
            const result2 = await connection.execute(
              "UPDATE users SET logintimes='" +
                int_logintimes +
                "', lastlogin='" +
                str_lastlogin +
                "' WHERE employeeCode='" +
                employeeid +
                "'"
            );
          }
          sqlQuery2();

      

          // Uppdatera databasen
          

          if (request.session.loggedin) {
            htmlLoggedinMenu = readHTML('./loggedinmenu.html');
            response.write(htmlLoggedinMenu);
          }
        } else {
          response.write('Login unsuccesfull!');
        }
      } else {
        response.write('User is locked out');
      }
    }

    response.write(htmlInfoStop);
    response.write(htmlFooter);
    response.write(htmlBottom);
    response.end();
  }
  sqlQuerry();
});

module.exports = router;
