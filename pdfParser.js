


var successCallback;

var _ = require('underscore'),
    PDFParser = require('pdf2json');

var pdfParser;

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

    successCallback(pdf.data);


    console.log('done');

    //console.log(JSON.stringify(pdf.data));

    //var fs = require('fs');
    //fs.writeFile('output.json', JSON.stringify(pdf.data), function (err,data) {
    //    if (err)
    //    {
    //        console.log(err);
    //    }
    //});
};

// Create an error handling function
var _onPDFBinDataError = function (error) {
    console.log(error);
};



function convertPdfToJson(filename, success, failure) {
    successCallback = success;

    pdfParser = new PDFParser();
    pdfParser.on('pdfParser_dataReady', _.bind(_onPDFBinDataReady, this));
    pdfParser.on('pdfParser_dataError', _.bind(_onPDFBinDataError, this));


    var pdfFilePath = 'sample_pdfs/' +  filename;  //bezeqint.pdf';

    console.log(pdfFilePath);

    pdfParser.loadPDF(pdfFilePath);

}

module.exports =  convertPdfToJson;
