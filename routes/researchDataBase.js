const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
router.use(express.static('./public'));
const path = require('path');
const fs = require('fs');
const { join } = require('path');
const pug = require('pug');
const { response } = require('express');
const pug_loggedinmenu = pug.compileFile('./masterframe/loggedinmenu.html');

// --------------------- Läs in Masterframen --------------------------------
const readHTML = require('../readHTML.js');

const { json } = require('express');

var htmlHead = readHTML('./masterframe/head.html');
var htmlHeader = readHTML('./masterframe/header.html');
var htmlMenu = readHTML('./masterframe/menu.html');
var htmlInfoStart = readHTML('./masterframe/infoStart.html');
var htmlInfoStop = readHTML('./masterframe/infoStop.html');
var htmlFooter = readHTML('./masterframe/footer.html');
var htmlBottom = readHTML('./masterframe/bottom.html');

// ---------------------- Lista all personal, Metod 4: Databas -------------------------------
router.get('/', (request, response) => {
    // Öppna databasen
    const ADODB = require('node-adodb');
    const connection = ADODB.open('Provider=Microsoft.Jet.OLEDB.4.0;Data Source=./data/mdb/researchdata.mdb;');
    const connectionUser = ADODB.open('Provider=Microsoft.Jet.OLEDB.4.0;Data Source=./data/mdb/personnelregistry.mdb;');

    async function sqlQuery() {
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.write(htmlHead);
        if (request.session.loggedin) {
            htmlLoggedinMenuCSS = readHTML('./masterframe/loggedinmenu_css.html');
            response.write(htmlLoggedinMenuCSS);
            htmlLoggedinMenuJS = readHTML('./masterframe/loggedinmenu_js.html');
            response.write(htmlLoggedinMenuJS);
            htmlLoggedinMenu = readHTML('./masterframe/loggedinmenu.html');
            response.write(htmlLoggedinMenu);
            response.write(pug_loggedinmenu({
                employeecode: request.cookies.employeecode,
                name: request.cookies.name,
                logintimes: request.cookies.logintimes,
                lastlogin: request.cookies.lastlogin,

            }));

        }
        response.write(htmlHeader);
        response.write(htmlMenu);
        response.write(htmlInfoStart);

        // Skapa HTML-textsträng för tabellen för utskrift av XML-data
        let htmlOutput = "" +
            "<link rel=\"stylesheet\" href=\"css/personnel_registry.css\" \/>" +
            "<link rel=\"stylesheet\" href=\"css/researchDataBase.css\" \/>" +
            "<script src=\"https://kit.fontawesome.com/6a4f24c0b1.js\" crossorigin=\"anonymous\"></script>" +
            "<script src=\"https://kit.fontawesome.com/8941e79a79.js\" crossorigin=\"anonymous\"></script>" +
            "<h2>Reaserch Object Database:</h2>\n" +
            "<div id=\"table-resp\">" +
            "<div id=\"table-header\">\n" +
            "<div class=\"table-header-cell-light\">Number</div>\n" +
            "<div class=\"table-header-cell-dark\">Name</div>\n" +
            "<div class=\"table-header-cell-light\">Created</div>\n" +
            "<div class=\"table-header-cell-light\">By</div>\n" +
            "<div class=\"table-header-cell-light\">Entries</div>\n" +
            "<div class=\"table-header-cell-light\">Last Entry</div>\n";
        if (request.session.loggedin && request.session.securityAccessLevel !== "C") {
            htmlOutput += "<div class=\"table-header-cell-light\">Edit</div>\n" +
                "<div class=\"table-header-cell-light\">Delete</div>\n";
        }
        htmlOutput += "</div>\n\n" +
            "<div id=\"table-body\">\n";
        "";


        // Skicka SQL-query till databasen och läs in variabler
        const result = await connection.query('SELECT objectNumber, objectName, objectCreatedDate, objecCreator, entryDate, objectCreatorName  FROM  ResearchObjects, ResearchEntries WHERE ResearchObjects.ID BETWEEN 1 AND 13');
        const resultUser = await connectionUser.query('SELECT securityAccessLevel FROM employee WHERE employee.id BETWEEN 1 AND 19');
        // Ta reda på antalet virus
        var count = result.length;
        // Loopa genom och skriv ut varje virus
        let i;
        for (i = 0; i < 12; i++) {
            str_objNumber = result[i]['objectNumber'];
            str_objName = result[i]['objectName'];
            str_objCreatedDate = result[i]['objectCreatedDate'];
            str_objCreator = result[i]['objecCreator'];
            str_entries = result[i]['entries'];
            str_lastEntries = result[i]['entryDate'];


            htmlOutput += "<div class=\"resp-table-row\">\n";
            htmlOutput += "<div class=\"table-body-cell\"> " + str_objNumber + "</div>\n";
            htmlOutput += "<div class=\"table-body-cell-bigger\"><a href=\"http://localhost:3000/api/researchDataBase/" + str_objNumber + "\">" + str_objName + "</a></div>\n";
            htmlOutput += "<div class=\"table-body-cell\"> " + str_objCreatedDate + "</div>\n";
            htmlOutput += "<div class=\"table-body-cell\"> " + str_objCreator + "</div>\n";
            htmlOutput += "<div class=\"table-body-cell\"> " + str_entries + "</div>\n";
            htmlOutput += "<div class=\"table-body-cell\"> " + str_lastEntries + "</div>\n";

            if (request.session.loggedin === true && request.session.securityAccessLevel !== "C") {

                htmlOutput += "<div class=\"table-header-cell-light\"><button>Edit</button></div>\n" +
                    "<div class=\"table-header-cell-light\"><button>Delete</button></div>\n";
            }
            htmlOutput += "</div>\n\n" +
                "<div id=\"table-body\">\n";
            "";
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
router.get('/:objectNumber', function (request, response) {
    var objectNumber = request.params.objectNumber;

    // Öppna databasen
    const ADODB = require('node-adodb');
    const connection = ADODB.open('Provider=Microsoft.Jet.OLEDB.4.0;Data Source=./data/mdb/researchdata.mdb;');

    async function sqlQuery() {
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.write(htmlHead);

        if (request.session.loggedin) {
            htmlLoggedinMenuCSS = readHTML('./masterframe/loggedinmenu_css.html');
            response.write(htmlLoggedinMenuCSS);
            htmlLoggedinMenuJS = readHTML('./masterframe/loggedinmenu_js.html');
            response.write(htmlLoggedinMenuJS);
            htmlLoggedinMenu = readHTML('./masterframe/loggedinmenu.html');
            response.write(htmlLoggedinMenu);
            response.write(pug_loggedinmenu({
                employeecode: request.cookies.employeecode,
                name: request.cookies.name,
                logintimes: request.cookies.logintimes,
                lastlogin: request.cookies.lastlogin,

            }));
        }

        response.write(htmlHeader);
        response.write(htmlMenu);
        response.write(htmlInfoStart);

        // Skicka SQL-query till databasen och läs in variabler
        const result = await connection.query("SELECT objectNumber, objectName, objecCreator, objectCreatedDate, objectText, presentationVideoLink, securityVideoLink, objectCreatorName FROM ResearchObjects WHERE objectNumber='" + objectNumber + "'");
        str_objNumber = result[0]['objectNumber'];
        str_objName = result[0]['objectName'];
        str_objText = result[0]['objectText'];
        str_objCreatedDate = result[0]['objectCreatedDate'];
        str_objCreator = result[0]['objecCreator'];
        str_objCreatorName = result[0]['objectCreatorName']
        str_objpresentationVideoLink = result[0]['presentationVideoLink'];
        str_objsecurityVideoLink = result[0]['securityVideoLink'];
        // Skapa HTML-textsträng för tabellen för utskrift av XML-data

        let htmlOutput = "" +
            "<link rel=\"stylesheet\" href=\"css/researchDataBase.css\" \/> <link rel=\"stylesheet\" href=\"css/personnel_registry_employee.css\" \/>\n" +
            "<div class=\"created-virus-date\">" + "<h1>" + objectNumber + "<small>" + " " + str_objName + "<span>" + "  Created: " + str_objCreatedDate + "</span>" + "</small>" + "</h1>" + "</div>" + "</ p>" + "<div class=\"virus-by\">" + " By: " + str_objCreator + "(" + str_objCreatorName + ")" + "</div>" + "<textarea>" + str_objText + "</textarea>" + "</ p>" + "<button class=\"edit-button\">Edit Info</button>";

        htmlOutput += "<div class=\"security-info\">   <h2 class=\"security-link\">" + " Security data sheet:   "+ objectNumber + "    " + str_objName;
        if (request.session.loggedin === true && request.session.securityAccessLevel !== "C") {
            htmlOutput += "<button>Edit</button>" + "<button>Delete</button>" + "</h2>";
        }

        htmlOutput += "<h2 class=\"security-link\"> " + " Security Presentation Video: " + "<small class=\"link-virus-sec\">" + str_objpresentationVideoLink + "</small> </h2> ";
        if (request.session.loggedin === true && request.session.securityAccessLevel !== "C") {
            htmlOutput += "<button>Edit</button>";
        }
        htmlOutput += "<h2 class=\"security-link \"> " + " Security Handling Video: " + "<small class=\"link-virus-sec\" >" + str_objsecurityVideoLink + "</small> ";

        if (request.session.loggedin === true && request.session.securityAccessLevel !== "C") {
            htmlOutput += "<button>Edit</button>" + "</h2>";
        }



        htmlOutput += "</div>   <div>";


        if (request.session.loggedin === true && request.session.securityAccessLevel !== "C") {
            htmlOutput += `<form method="post" enctype="multipart/form-data" action="/api/researchDataBase/${str_objNumber}/upload">
  <input type="file" name="pdfFile" accept="application/pdf"> </p >
  <button class=\"upload-button\" type="submit">Upload file</button>
</form>
`;
        }

        // ...
        htmlOutput += "<h3>Attachments</h3>  <div class=\"attachments\" >";
        var folderPath = join(__dirname, '..', 'data', objectNumber, 'attachments');
        console.log(folderPath);

        fs.readdir(folderPath, (err, files) => {
            if (err) {
                console.log("Error reading directory:", err);
                response.send("Error reading directory");
                return;
            }

            if (files.length === 0) {
                console.log("No files found in directory.");
                response.send("No files found in directory");
                return;
            }


            var fileNames = []; // Store file paths in an array

            console.log("Files in directory:", files);

            files.forEach((file) => {
                const filePath = join(folderPath, file);
                const fileName = path.basename(filePath); // Extract the file name 
                console.log("File path:", fileName);
                fileNames.push(fileName); // Add the file path to the filePaths array

                const stats = fs.statSync(filePath); // Synchronously retrieve file stats
                const fileCreationDate = stats.birthtime.toDateString();
                const fileSizeInBytes = stats.size;
                const fileSizeInKb = fileSizeInBytes / 1024;
                const fileSizeDisplay = fileSizeInKb.toFixed(2) + " KB";


                htmlOutput += "<h3 class=\"attachments_h3\">" + fileName + "</h3>" + "<h3 class=\"attachments_h3\">" + fileSizeDisplay + " </h3> " + "<h3class=\"attachments_h3\" >" + fileCreationDate + " </h3class=> ";
                // htmlOutput += "<span class=\"black-line\"></span>"; // Add bl


                if (request.session.loggedin === true && request.session.securityAccessLevel !== "C") {

                    htmlOutput += "<button class=\"delete-button\"><a href=\"/api/researchDataBase/" + objectNumber + "/delete/" + file + "\" style=\"color:#336699;text-decoration:none;\">Delete</a></button>\n";
                }

            });


            htmlOutput += "</h3>\n" + "</div>\n";


            response.write(htmlOutput);


            response.write(htmlInfoStop);
            response.write(htmlFooter);
            response.write(htmlBottom);
            response.end();
        });



        // ...

    }
    sqlQuery();
});




router.get('/:objectNumber/delete/:file', function (request, response) {
    var objectNumber = request.params.objectNumber;
    var fileName = request.params.file; // Update parameter name to `file`

    var folderPath = join(__dirname, '..', 'data', objectNumber, 'attachments'); // Create the folder path
    const filePath = join(folderPath, fileName);

    async function sqlQuery() {
        response.setHeader('Content-type', 'text/html');
        response.write(htmlHead);
        if (request.session.loggedin) {
            response.write(htmlLoggedinMenuCSS);
            response.write(htmlLoggedinMenuJS);
            //response.write(htmlLoggedinMenu);
            response.write(pug_loggedinmenu({
                employeecode: request.cookies.employeecode,
                name: request.cookies.name,
                logintimes: request.cookies.logintimes,
                lastlogin: request.cookies.lastlogin,
            }));
        }
        response.write(htmlHeader);
        response.write(htmlMenu);
        response.write(htmlInfoStart);

        if (request.session.loggedin) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error("Error deleting file:", err);
                    response.send("Error deleting file");
                } else {
                    console.log("File deleted:", filePath);

                }

            });
        }
        response.write("File deleted successfully<br/><p /><a href=\"http://localhost:3000/api/researchDataBase//" + objectNumber + "\" style=\"color:#336699;text-decoration:none;\">Back to the virus info</a>");
        response.write(htmlInfoStop);
        response.write(htmlFooter);
        response.write(htmlBottom);
        response.end();
    }
    sqlQuery();


});



router.post('/:objectNumber/upload', function (request, response) {
    var objectNumber = request.params.objectNumber;
    var folderPath = join(__dirname, '..', 'data', objectNumber, 'attachments');
    /*var storage = multer.diskStorage({
    destination: folderPath,
    filename: function (req, file, cb) {
      var originalName = file.originalname;
      var extension = path.extname(originalName);
      var uniqueFilename = uuidv4() + extension;
      cb(null, uniqueFilename);
    }
  });*/

    var storage = multer.diskStorage({
        destination: folderPath,
        filename: function (req, file, cb) {
            cb(null, file.originalname); // Use the original filename
        }
    });
    var upload = multer({ storage: storage }).single('pdfFile');

    async function sqlQuery() {
        response.setHeader('Content-type', 'text/html');
        response.write(htmlHead);
        if (request.session.loggedin) {
            response.write(htmlLoggedinMenuCSS);
            response.write(htmlLoggedinMenuJS);
            //response.write(htmlLoggedinMenu);
            response.write(pug_loggedinmenu({
                employeecode: request.cookies.employeecode,
                name: request.cookies.name,
                logintimes: request.cookies.logintimes,
                lastlogin: request.cookies.lastlogin,
            }));
        }
        response.write(htmlHeader);
        response.write(htmlMenu);
        response.write(htmlInfoStart);


        upload(request, response, function (err) {
            if (err) {
                console.error("Error uploading file:", err);
                response.send("Error uploading file");
            } else {
                console.log("File uploaded successfully");
            }
        });
        response.write("File uploaded successfully<br/><p /><a href=\"http://localhost:3000/api/researchDataBase//" + objectNumber + "\" style=\"color:#336699;text-decoration:none;\">Back to the virus info</a>");
        response.write(htmlInfoStop);
        response.write(htmlFooter);
        response.write(htmlBottom);
        response.end();
    }
    sqlQuery();

});





module.exports = router;