const express = require('express');
const router = express.Router();

router.use(express.static('./public'));
const path = require('path');

// --------------------- Läs in Masterframen --------------------------------
const readHTML = require('../readHTML.js');
const fs = require('fs');
const { json } = require('express');

    var htmlHead = readHTML('./head.html');
    var htmlHeader = readHTML('./header.html');
    var htmlMenu = readHTML('./menu.html');    
    var htmlInfoStart = readHTML('./infoStart.html');
    var htmlInfoStop = readHTML('./infoStop.html');
    var htmlFooter = readHTML('./footer.html');
    var htmlBottom = readHTML('./bottom.html');

// ---------------------- Lista all personal, Metod 4: Databas -------------------------------
router.get('/', (request, response) =>
{    
    // Öppna databasen
    const ADODB = require('node-adodb');
    const connection = ADODB.open('Provider=Microsoft.Jet.OLEDB.4.0;Data Source=./data/mdb/researchdata.mdb;');

    async function sqlQuery()
    {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(htmlHead);
        if(request.session.loggedin){htmlLoggedinMenu = readHTML('./loggedinmenu.html');response.write(htmlLoggedinMenu);}
        response.write(htmlHeader);
        response.write(htmlMenu);
        response.write(htmlInfoStart);

        // Skapa HTML-textsträng för tabellen för utskrift av XML-data
        let htmlOutput =""+
         "<link rel=\"stylesheet\" href=\"css/personnel_registry.css\" \/>" +
         "<script src=\"https://kit.fontawesome.com/6a4f24c0b1.js\" crossorigin=\"anonymous\"></script>"+
        "<h2>Reaserch Object Database:</h2>\n"+
        "<div id=\"table-resp\">"+
        "<div id=\"table-header\">\n"+
        "<div class=\"table-header-cell-light\">Number</div>\n"+
         "<div class=\"table-header-cell-dark\">Name</div>\n" +
         "<div class=\"table-header-cell-light\">Created</div>\n"+
        "<div class=\"table-header-cell-light\">By</div>\n"+
        "<div class=\"table-header-cell-light\">Entries</div>\n"+
         "<div class=\"table-header-cell-light\">Last Entry</div>\n" +
         "<div class=\"table-header-cell-light\">Edit</div>\n" +
         "<div class=\"table-header-cell-light\">Delete</div>\n" +
        "</div>\n\n"+
        "<div id=\"table-body\">\n";
        "";

        // Skicka SQL-query till databasen och läs in variabler
        const result = await connection.query('SELECT objectNumber, objectName, objectCreatedDate, objectCreator, entries, entryDate FROM ReaserchEntries, ReaserchObjects');
            
        // Ta reda på antalet virus
        var count =  result.length;

        // Loopa genom och skriv ut varje virus
        let i;
        for(i=0; i<count; i++)
        {         
            str_objNumber = result[i]['objectNumber'];
            str_objName = result[i]['objectName'];
            str_objCreatedDate = result[i]['objectCreatedDate'];
            str_objCreator = result[i]['objectCreator'];
            str_entries = result[i]['entries'];
         str_lastEntries = result[i]['entryDate'];                 
           
            htmlOutput += "<div class=\"table-body-cell-bigger\"><a href=\"http://localhost:3000/api/reserchDataBase/" + str_objNumber + "\">" + str_objName + "</a></div>\n";
            htmlOutput += "<div class=\"table-body-cell\"> " + str_objCreator + "</div>\n";
            htmlOutput += "<div class=\"table-body-cell\"> " + str_objCreatedDate + "</div>\n";
            htmlOutput += "<div class=\"table-body-cell\"> " + str_objCreatedDate + "</div>\n";
            htmlOutput += "<div class=\"table-body-cell\"> " + str_objCreator +  "</div>\n";
            htmlOutput += "<div class=\"table-body-cell\"> " + str_entries + "</div>\n";
            htmlOutput += "<div class=\"table-body-cell\"> " + str_lastEntries + "</div>\n";
            htmlOutput += "<button><i class=\"fa-thin fa-pen-to-square\"></i></button>"
            htmlOutput += "<button><i class=\"fa-thin fa-circle-xmark\"></i></button>";
         
            htmlOutput += "</div>\n";
        }  

        htmlOutput += "</div></div>\n\n";
        response.write(htmlOutput); 

        response.write(htmlInfoStop);
        response.write(htmlFooter);
        response.write(htmlBottom);
        response.end();
    }
    sqlQuery();
});


// --------------------- Läs en specifik virus, Metod 4: Databas -----------------------------
router.get('/:objectNumber', function(request, response)
{
    var objectNumber = request.params.objectNumber;
    
    // Öppna databasen
    const ADODB = require('node-adodb');
    const connection = ADODB.open('Provider=Microsoft.Jet.OLEDB.4.0;Data Source=./data/mdb/researchdata.mdb;');

    async function sqlQuery()
    {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(htmlHead);

        if (request.session.loggedin) { htmlLoggedinMenu = readHTML('./loggedinmenu.html'); response.write(htmlLoggedinMenu); }

        response.write(htmlHeader);
        response.write(htmlMenu);
        response.write(htmlInfoStart);
        
        // Skicka SQL-query till databasen och läs in variabler
        const result = await connection.query("SELECT objectNumber, objectName, objectText, objectCreatedDate, objectCreator FROM ResearchEntries, presentationVideoLink, securityVideoLink ResearchObjects WHERE objectNumber='"+objectNumber+"'");
        str_objNumber = result[0]['objectNumber'];
        str_objName = result[0]['objectName'];
        str_objText = result[0]['objText'];
        str_objCreatedDate = result[0]['objectCreatedDate'];
        str_objCreator = result[0]['objCreator'];
     str_objpresentationVideoLink = result[0]['presentationVideoLink'];
     str_objsecurityVideoLink = result[0]['securityVideoLink'];
         // Skapa HTML-textsträng för tabellen för utskrift av XML-data
     
        let htmlOutput =""+
        "<link rel=\"stylesheet\" href=\"css/researchDataBase.css\" \/> <link rel=\"stylesheet\" href=\"css/personnel_registry_employee.css\" \/>\n"+ 
        "<h1>" + objectNumber + "</h1>" + "<span>" + str_objName + "</span>\n"+
        "<table id=\"infomiddle\">\n"+
        "<tr><td width=\"166\" valign=\"top\">\n"+
             "<table id=\"photocol\"><tr><td id=\"photobox\"><img src=\"photos/" + str_employeeCode + ".jpg\" alt=\"" + str_employeeCode + "\" width=\"164\" /></td></tr><tr><td class=\"tablespacer\"></tr>\n"+
         "<div><textarea>" + objText + "</textarea></div>" + 
         "<button class=\"btn\">Edit Info</button>"+
     "<div class=\"researchSheet\">" +
      "<td>" + "<h4> Security Data Sheet: </h4>" + str_objectNumber + str_objName + str_objCreatedDate +  "<button><i class=\"fa-thin fa-pen-to-square\"></i></button>" + "<button><i class=\"fa-thin fa-circle-xmark\"></i></button>" + "</td>" +
      "<td>" + "<h4> Security Presentation Video: </h4>" + str_objpresentationVideoLink + "<button><i class=\"fa-thin fa-pen-to-square\"></i></button>" + "</td>" +
      "<td>"+ "<h4> Security Handling Video: </h4>" + str_objsecurityVideoLink + "<button><i class=\"fa-thin fa-pen-to-square\"></i></button>" + "</td>"+
      "</div>" +
         
        "</table>\n";  

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
    }
    sqlQuery();
});

module.exports = router;