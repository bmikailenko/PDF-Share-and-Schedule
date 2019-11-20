var express = require("express");
var app = express();
var router = express.Router();
var fileUpload = require("express-fileupload");
var mv = require("mv");
var fs = require("fs");
const jsdom = require("jsdom");
var jquery = require("jquery");
var del = require("del");
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });

// express file uploading framework
app.use(fileUpload());

app.use('/files', express.static('files'));

// get the main page
app.get('/', function(req,res){
  res.sendFile(__dirname + "/views/index.html");
});

// when files are uploaded
app.post('/upload', function(req,res){

  // get date input;
  var date = req.body.addDate;

  // if directory doesn't exist, make one
  if (!fs.existsSync('./files/' + date)){
    fs.mkdirSync('./files/' + date);
  }

  // if no uploaded files just exit
  if (!req.files || Object.keys(req.files).length === 0) {
    console.log("quiiit");
    return res.redirect('/');
  }

  // Save pdf file 1
  var pdfFile1 = req.files.pdfFile1;
  pdfFile1.mv('./files/' + date + '/' + pdfFile1.name, function(err) { if (err) return res.status(500).send(err)});


  // // Save pdf file 2
  // if (req.files.pdfFile2 != null){
  //   var pdfFile2 = req.files.pdfFile2;
  //   pdfFile2.mv('./files/' + pdfFile2.name, function(err) { if (err) return res.status(500).send(err)});
  // }
  //
  // // Save pdf file 3
  // if (req.files.pdfFile3 != null) {
  //   var pdfFile3 = req.files.pdfFile3;
  //   pdfFile3.mv('./files/' + pdfFile3.name, function(err) { if (err) return res.status(500).send(err)});
  // }
  //
  // // Save pdf file 4
  // if (req.files.pdfFile4 != null) {
  //   var pdfFile4 = req.files.pdfFile4;
  //   pdfFile4.mv('./files/' + pdfFile4.name, function(err) { if (err) return res.status(500).send(err)});
  // }
  //
  // // Save pdf file 5
  // if (req.files.pdfFile5 != null) {
  //   var pdfFile5 = req.files.pdfFile5;
  //   pdfFile5.mv('./files/' + pdfFile5.name, function(err) { if (err) return res.status(500).send(err)});
  // }

  // link to download file
  var downloadLink = '<a href=' + ("./files/" + date + "/" + pdfFile1.name) + ' download>' + pdfFile1.name + '</a>';

  // entry to main page
  var card = '<div class="card" id=\"' + date +'\" style="width: 18rem; text-align: center; margin: 0 auto;">' +
  '<div class="card-body">' +
  '<h5 class="card-title">' +
  date +
  '</h5>' +
  downloadLink +
  '</div>' +
  '</div>';

  // write new entry to main page
  fs.readFile(__dirname + '/views/index.html', 'utf8', (err, data) => {
    const dom = new jsdom.JSDOM(data);
    const $ = jquery(dom.window);
    var content = $('#mainPage').html();
    $('#mainPage').html(content + card);
    fs.writeFile(__dirname + '/views/index.html', dom.serialize(), err => {
    });
  });

  // redirect to home page
  res.redirect('/');

});

// when files are deleted
app.post('/delete', function(req,res){

  // get date input;
  var date = req.body.deleteDate;

  // delete folder from date input
  // if (!fs.existsSync('./files/' + date)){
  //   console.log("exists!!!");
  //   del.sync('./files/' + date);
  // }


  // write new entry to main page
  fs.readFile(__dirname + '/views/index.html', 'utf8', (err, data) => {
    const dom = new jsdom.JSDOM(data);
    const $ = jquery(dom.window);
    $('#' + date).remove();
    fs.writeFile(__dirname + '/views/index.html', dom.serialize(), err => {
      console.log(err);
    });
  });

  res.redirect('/');

});

// when entries are edited
app.post('/edit', function(req,res){

  // get date inputs;
  var oldDate = req.body.oldDate;
  var newDate = req.body.newDate;

  // if directory doesn't exist, make one
  if (!fs.existsSync('./files/' + newDate)){
    fs.mkdirSync('./files/' + newDate);
  }

  // Save pdf file 1
  var newPdfFile1 = req.files.newPdfFile1;
  newPdfFile1.mv('./files/' + newDate + '/' + newPdfFile1.name, function(err) { if (err) return res.status(500).send(err)});

  // link to download file
  var downloadLink = '<a href=' + ("./files/" + newDate + "/" + newPdfFile1.name) + '>' + newPdfFile1.name + '</a>';

  // entry to main page
  var card = '<div class="card" id=\"' + newDate +'\" style="width: 18rem; text-align: center; margin: 0 auto;">' +
  '<div class="card-body">' +
  '<h5 class="card-title">' +
  newDate +
  '</h5>' +
  downloadLink +
  '</div>' +
  '</div>';

  // write new entry to main page
  fs.readFile(__dirname + '/views/index.html', 'utf8', (err, data) => {
    const dom = new jsdom.JSDOM(data);
    const $ = jquery(dom.window);
    $('#' + oldDate).remove();
    var content = $('#mainPage').html();
    $('#mainPage').html(content + card);
    fs.writeFile(__dirname + '/views/index.html', dom.serialize(), err => {
    });
  });

  res.redirect('/');

});

app.listen(3000,function(){
  console.log("Live at Port 3000");

});
