const express = require('express');
const router = express.Router();

router.use(express.static('./public'));
const path = require('path');
const xml2js = require('xml2js');

// --------------------- Läs in Masterframen --------------------------------
const readHTML = require('../readHTML.js');
const fs = require('fs');

    var htmlHead = readHTML('./head.html');
    var htmlHeader = readHTML('./header.html');
    var htmlMenu = readHTML('./menu.html');    
    var htmlInfoStart = readHTML('./infoStart.html');
    var htmlInfoStop = readHTML('./infoStop.html');
    var htmlFooter = readHTML('./footer.html');
    var htmlBottom = readHTML('./bottom.html');

// ---------------------- Lista all personal, Metod 1: XML-array -------------------------------
router.get('/', (request, response) =>
{
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write(htmlHead);
    response.write(htmlHeader);
    response.write(htmlMenu);
    response.write(htmlInfoStart);

    // Skapa HTML-textsträng för tabellen för utskrift av XML-data
    let htmlOutput =""+
    "<link rel=\"stylesheet\" href=\"css/personnel_registry.css\" \/>"+
    "<h2>Personnel Registry:</h2>\n"+
    "<div id=\"table-resp\">"+
    "<div id=\"table-header\">\n"+
    "<div class=\"table-header-cell-light\">Employee Code</div>\n"+
    "<div class=\"table-header-cell-dark\">Name</div>\n"+
    "<div class=\"table-header-cell-light\">Signature Date</div>\n"+
    "<div class=\"table-header-cell-light\">Rank</div>\n"+
    "<div class=\"table-header-cell-light\">Access Level</div>\n"+
    "</div>\n\n"+
    "<div id=\"table-body\">\n";
    "";

    // Läs in XML-filen 
    const fsx = require('fs');
    let xmltext = fsx.readFileSync('./data/xml/personnel_registry.xml');

    // Delar upp strängen i en array enligt <employee>
    xmltext = xmltext.toString(); 
    xmltext = xmltext.replace(/[\n\t\r]/g,"");      // Radera bort koder för mellanslag och radbyten 
    let xmlArray = xmltext.split('<employee>');
    xmlArray.shift();                               // Radera första elementetet i arrayen (innehåller inte en employee)

    // Läs varje employee i arrayen
    xmlArray.forEach(printEmployee)
    function printEmployee(employee)
    {
        // Läs in variablerna ur XML-strängen
        let str_employeeCode = employee.substring(employee.indexOf('<employeeCode>')+14, employee.lastIndexOf('</employeeCode>'));
        let str_name = employee.substring(employee.indexOf('<name>')+6, employee.lastIndexOf('</name>'));
        let str_signatureDate = employee.substring(employee.indexOf('<signatureDate>')+15, employee.lastIndexOf('</signatureDate>'));
        let str_rank = employee.substring(employee.indexOf('<rank>')+6, employee.lastIndexOf('</rank>'));
        let str_securityAccessLevel = employee.substring(employee.indexOf('<securityAccessLevel>')+21, employee.lastIndexOf('</securityAccessLevel>'));

        // Lägg till respektive employee till utskrift-variabeln
        htmlOutput += "<div class=\"resp-table-row\">\n";
        htmlOutput += "<div class=\"table-body-cell\">" + str_employeeCode + "</div>\n";
        htmlOutput += "<div class=\"table-body-cell-bigger\"><a href=\"http://localhost:3000/api/personnelregistry/" + str_employeeCode + "\">" + str_name + "</a></div>\n";
        htmlOutput += "<div class=\"table-body-cell\"> " + str_signatureDate + "</div>\n";
        htmlOutput += "<div class=\"table-body-cell\"> " + str_rank + "</div>\n";
        htmlOutput += "<div class=\"table-body-cell\"> " + str_securityAccessLevel + "</div>\n";
        htmlOutput += "</div>\n";
    }

    htmlOutput += "</div></div>\n\n";
    response.write(htmlOutput); // Skriv ut XML-datat
    
    response.write(htmlInfoStop);
    response.write(htmlFooter);
    response.write(htmlBottom);
    response.end();

});


// --------------------- Läs en specifik person, Metod 2: XML to JSON -----------------------------------------------
router.get('/:employeeid', function(request, response)
{
    const employeeid = request.params.employeeid;
    
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write(htmlHead);
    if (request.session.loggedin) { htmlLogggedinMenu = readHTML('./loggedinmenu.html');response.write(htmlLogggedinMenu);
    }
    response.write(htmlHeader);
    response.write(htmlMenu);
    response.write(htmlInfoStart);

   // Läs in alla (kort-info) variabler ur XML-filen
   const fsx = require('fs');
   let xml_string = fsx.readFileSync("./data/xml/personnel_registry.xml", "utf8");
   let count = (xml_string.match(/<employee>/g)).length;             // Räknar antalet <employee> i textsträngen
   var str_employeeCode, str_name, str_signatureDate, str_dateOfBirth, str_sex, str_bloodType, str_height, str_weight, str_rank, str_department, str_securityAccessLevel;
       
   // Konverterar XML-texten till en JSON-array
   xml2js.parseString(xml_string, function (err, result) 
   {
       let i;
       for(i=0; i<count; i++)
       {
           if(result['personnelRegistry']['employee'][i]['employeeCode'] == employeeid)
           {
               str_employeeCode = result['personnelRegistry']['employee'][i]['employeeCode'];
               str_name = result['personnelRegistry']['employee'][i]['name'];
               str_dateOfBirth = result['personnelRegistry']['employee'][i]['dateOfBirth'];
               str_sex = result['personnelRegistry']['employee'][i]['sex'];
               str_bloodType = result['personnelRegistry']['employee'][i]['bloodType'];
               str_height = result['personnelRegistry']['employee'][i]['height'];
               str_weight = result['personnelRegistry']['employee'][i]['weight'];
               str_rank = result['personnelRegistry']['employee'][i]['rank'];
               str_department = result['personnelRegistry']['employee'][i]['department'];
               str_securityAccessLevel = result['personnelRegistry']['employee'][i]['securityAccessLevel'];
           }
       }        
   });

     // Skapa HTML-textsträng för tabellen för utskrift av XML-data
     let htmlOutput =""+
     "<link rel=\"stylesheet\" href=\"css/personnel_registry_employee.css\" \/>\n"+ 
     "<h1>Personnel Registry - " + employeeid + "</h1>\n"+
     "<table id=\"infomiddle\">\n"+
     "<tr><td width=\"166\" valign=\"top\">\n"+
         "<table id=\"photocol\"><tr><td id=\"photobox\"><img src=\"photos/" + str_employeeCode + ".jpg\" alt=\"" + str_employeeCode + "\" width=\"164\" /></td></tr><tr><td class=\"tablespacer\"></tr>\n"+
         "<tr><td id=\"employeecode\">EMPLOYEE CODE: </b><br /><b>" + str_employeeCode + "</b></td></tr><tr><td class=\"tablespacer\"></tr>\n"+
         "<tr> <td id=\"securitylevel\">SECURITY CLEARANCE LEVEL: </b><br /><big><big><big>" +str_securityAccessLevel+ "</big></big></big></td></tr></table>\n"+
     "</td><td width=\"135\" valign=\"top\">\n"+
         "<table><tr><td class=\"variablecol\">NAME: &nbsp;</td></tr><tr><td class=\"tablespacer\"></tr>\n"+
         "<tr><td class=\"variablecol\">DATE OF BIRTH: &nbsp;</td></tr><tr><td class=\"tablespacer\"></tr>\n"+
         "<tr><td class=\"variablecol\">SEX: &nbsp;</td></tr><tr><td class=\"tablespacer\"></tr>\n"+
         "<tr><td class=\"variablecol\">BLOOD TYPE: &nbsp;</td></tr><tr><td class=\"tablespacer\"></tr>\n"+
         "<tr><td class=\"variablecol\">HEIGHT: &nbsp;</td></tr><tr><td class=\"tablespacer\"></tr>\n"+
         "<tr><td class=\"variablecol\">WEIGHT: &nbsp;</td></tr><tr><td class=\"tablespacer\"></tr>\n"+
         "<tr><td class=\"variablecol\">DEPARTMENT: &nbsp;</td></tr><tr><td class=\"tablespacer\"></tr>\n"+
         "<tr><td class=\"variablecol\">RANK: &nbsp;</td></tr><tr><td class=\"tablespacer\"></tr></table>\n"+
     "</td><td width=\"245\" valign=\"top\">\n"+
         "<table><tr><td class=\"valuecol\">" +str_name+ "</td></tr><tr><td class=\"blackline\"></td></tr><tr><td class=\"tablespacer\"></tr>\n"+
         "<tr><td class=\"valuecol\">" +str_dateOfBirth+ "</div></td></tr><tr><td class=\"blackline\"></td></tr><tr><td class=\"tablespacer\"></tr>\n"+
         "<tr><td class=\"valuecol\">" +str_sex+ "</td></tr><tr><td class=\"blackline\"></td></tr><tr><td class=\"tablespacer\"></tr>\n"+
         "<tr><td class=\"valuecol\">" +str_bloodType+ "</td></tr><tr><td class=\"blackline\"></td></tr><tr><td class=\"tablespacer\"></tr>\n"+
         "<tr><td class=\"valuecol\">" +str_height+ "</td></tr><tr><td class=\"blackline\"></td></tr><tr><td class=\"tablespacer\"></tr>\n"+
         "<tr><td class=\"valuecol\">" +str_weight+ "</td></tr><tr><td class=\"blackline\"></td></tr><tr><td class=\"tablespacer\"></tr>\n"+
         "<tr><td class=\"valuecol\">" +str_department+ "</td></tr><tr><td class=\"blackline\"></td></tr><tr><td class=\"tablespacer\"></tr>\n"+
         "<tr><td class=\"valuecol\">" +str_rank+ "</td></tr><tr><td class=\"blackline\"></td></tr><tr><td class=\"tablespacer\"></tr></table>\n"+
         "<td width=\"182\" valign=\"top\">\n"+
         "</td>\n"+
     "</td></tr></table>\n";  

    // Läs den personliga XML-filen
    xml_string = fsx.readFileSync("./data/xml/"+str_employeeCode+".xml", "utf8");
    xml_string = xml_string.replace(/[\n\t\r]/g,"");      // Radera bort koder för mellanslag och radbyten 
    var str_background, str_strengths, str_weaknesses;

    xml2js.parseString(xml_string, function (err, result) 
    {
        str_background = result['fields']['Background'];
        str_strengths = result['fields']['Strengths'];
        str_weaknesses = result['fields']['Weaknesses'];
    });

    htmlOutput =htmlOutput +
    "<h1>Background</h1>\n"+ str_background +
    "<p />"+
    "<h1>Strengths</h1>\n"+ str_strengths +
    "<p />"+
    "<h1>Weaknesses</h1>\n"+ str_weaknesses +
    "<p />";

    response.write(htmlOutput); // Skriv ut 

    response.write(htmlInfoStop);
    response.write(htmlFooter);
    response.write(htmlBottom);
    response.end();
});

module.exports = router;