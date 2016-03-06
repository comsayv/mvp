
// Get the dependencies that have already been installed
// to ./node_modules with `npm install <dep>`in the root director
// of your app

var _ = require('underscore'),
    PDFParser = require('pdf2json');

var pdfParser = new PDFParser();

// Create a function to handle the pdf once it has been parsed.
// In this case we cycle through all the pages and extraxt
// All the text blocks and print them to console.
// If you do `console.log(JSON.stringify(pdf))` you will
// see how the parsed pdf is composed. Drill down into it
// to find the data you are looking for.
var _onPDFBinDataReady = function (pdf) {
    console.log('Loaded pdf:\n');

    for (var i in pdf.data.Pages)
    {
        var page = pdf.data.Pages[i];
        for (var j in page.Texts)
        {

            var hebrewChars = new RegExp("[\u0590-\u05FF]+");

            page.Texts[j].R[0].T =  decodeURIComponent(page.Texts[j].R[0].T);

            if (hebrewChars.test(page.Texts[j].R[0].T)) {
                page.Texts[j].R[0].T = page.Texts[j].R[0].T.split("").reverse().join("");
            }

        }
    }

    //console.log(JSON.stringify(pdf.data));

    var fs = require('fs');
    fs.writeFile('output.json', JSON.stringify(pdf.data), function (err,data) {
        if (err)
        {
            console.log(err);
        }
    });

    console.log('DONE!');
};

// Create an error handling function
var _onPDFBinDataError = function (error) {
    console.log(error);
};

// Use underscore to bind the data ready function to the pdfParser
// so that when the data ready event is emitted your function will
// be called. As opposed to the example, I have used `this` instead
// of `self` since self had no meaning in this context
pdfParser.on('pdfParser_dataReady', _.bind(_onPDFBinDataReady, this));

// Register error handling function
pdfParser.on('pdfParser_dataError', _.bind(_onPDFBinDataError, this));

// Construct the file path of the pdf
//var pdfFilePath = 'test3.pdf';

var pdfFilePath = 'sample_pdfs/bezeqint.pdf';


// Load the pdf. When it is loaded your data ready function will be called.
pdfParser.loadPDF(pdfFilePath);
