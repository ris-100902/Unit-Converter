const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const convertCmToMm = n => n*10;
const convertMtoMm = n => n*100;
const convertKmToMm = n => n*1000;
const convertToCm = n => n/10;
const convertToM = n => n/100;
const convertToKm = n => n/1000;

const convertKgToG = n => n*1000;
const convertOuToG = n => n*28.3495;
const convertPoToG = n => n*453.592;
const convertToKg = n => n/1000;
const convertToOu = n => n/28.3495;
const convertToPo = n => n/453.592;

const convertCelsiusToKelvin = n => n + 273.15;
const convertFarenToKelvin = n => (n - 32)*5/9 + 273.15;
const convertToCelsius = n => n -273.15;
const convertToFaren = n => (n - 273.15)*9/5 +32;

const style = 'style="text-decoration: underline; color: blue;"';
function createResultString(lengthStyle, weightStyle, tempStyle, num1, unit1, num2, unit2, resetTo) {
    let resultString = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="style.css">
            <title>Document</title>
        </head>
        <body>
            <form>
                <div id="title">
                    <h1>Unit Converter</h1>
                </div>
                <div id="navbar">
                    <nav>
                        <a href="http://localhost:8080/length.html" ${lengthStyle}>Length</a>
                        <a href="http://localhost:8080/weight.html" ${weightStyle}>Weight</a>
                        <a href="http://localhost:8080/temp.html" ${tempStyle}>Temperature</a>
                    </nav>
                </div>
                <div>
                    <h4>Result of your calculation</h4>
                    <h3>${num1} ${unit1} = ${num2} ${unit2}</h3>
                    <button>
                        <a href="http://localhost:8080/${resetTo}">Reset</a>
                    </button>
                </div>
            </form>
        </body>
        </html>`;
    return resultString;
}


const server = http.createServer((req,res) => {
    let q = url.parse(req.url, true);
    
    if (req.url == '/' || req.url == '/length.html') {
        res.writeHead(200, {'Content-Type' : 'text/html'});
        fs.readFile(path.join(__dirname, 'length.html'), (err,data) => {
            if (data) return res.end(data);
        });
    }
    else if (req.url == '/weight.html') {
        res.writeHead(200, {'Content-Type' : 'text/html'});
        fs.readFile(path.join(__dirname, 'weight.html'), (err,data) => {
            if (data) return res.end(data);
        });
    }
    else if (req.url == '/temp.html') {
        res.writeHead(200, {'Content-Type' : 'temp.html'});
        fs.readFile(path.join(__dirname, 'temp.html'), (err,data) => {
            if (data) return res.end(data);
        });
    }
    else if (req.url == '/style.css') {
        res.writeHead(200, {'Content' : 'text/css'});
        fs.readFile(path.join(__dirname, 'style.css'), (err,data) => {
            if (data) return res.end(data);
        });
    }
    else if (q.pathname == '/length.html') {
        res.writeHead(200, {'Content' : 'text/plain'});
        let unitTo = q.query.unitTo, unitFrom = q.query.unitFrom, src = parseInt(q.query.length);
        switch (unitFrom) {
            case('cm'):
                src = convertCmToMm(src);
                break;
            case('m'):
                src = convertMtoMm(src);
                break;
            case('km'):
                src = convertKmToMm(src);
                break;
        }
        let tar = src;
        switch(unitTo) {
            case('cm'):
                tar = convertToCm(src);
                break;
            case('m'):
                tar = convertToM(src);
                break;
            case('km'):
                tar = convertToKm(src);
                break;
        }
        return res.end(createResultString(style, "","", q.query.length, unitFrom, tar, unitTo, 'length.html'));
    }
    else if (q.pathname == '/weight.html') {
        res.writeHead(200, {'Content' : 'text/plain'});
        let unitTo = q.query.unitTo, unitFrom = q.query.unitFrom, src = parseInt(q.query.weight);
        switch (unitFrom) {
            case('kilogram'):
                src = convertKgToG(src);
                break;
            case('ounce'):
                src = convertOuToG(src);
                break;
            case('pound'):
                src = convertPoToG(src);
                break;
        }
        let tar = src;
        switch(unitTo) {
            case('kilogram'):
                tar = convertToKg(src);
                break;
            case('ounce'):
                tar = convertToOu(src);
                break;
            case('pound'):
                tar = convertToPo(src);
                break;
        }
        return res.end(createResultString("",style,"", q.query.weight, unitFrom, tar, unitTo, 'weight.html'));
    }
    else if (q.pathname == '/temp.html') {
        res.writeHead(200, {'Content' : 'text/plain'});
        let unitTo = q.query.unitTo, unitFrom = q.query.unitFrom, src = parseInt(q.query.temp);
        switch (unitFrom) {
            case('farenheit'):
                src = convertFarenToKelvin(src);
                break;
            case('celsius'):
                src = convertCelsiusToKelvin(src);
                break;
        }
        let tar = src;
        switch(unitTo) {
            case('farenheit'):
                tar = convertToFaren(src);
                break;
            case('celsius'):
                tar = convertToCelsius(src);
                break;
        }
        let endString = createResultString("", "", style, q.query.temp, unitFrom, tar, unitTo, 'temp.html');
        return res.end(endString);
    }
});

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
});