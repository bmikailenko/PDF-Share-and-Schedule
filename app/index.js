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

  // if no uploaded files just redirect to home
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.redirect('/');
  }

  // Save pdf file 1
  if (req.files.pdfInput[0] != null){
    var pdfFile1 = req.files.pdfInput[0];
    pdfFile1.mv('./files/' + date + '/' + pdfFile1.name.replace(/\s+/g, '-'), function(err) { if (err) return res.status(500).send(err)});
    var downloadLink1 = '<a href=' + ("./files/" + date + "/" + pdfFile1.name.replace(/\s+/g, '-')) + ' download>' + pdfFile1.name + '</a>';
  }

  // Save pdf file 2
  if (req.files.pdfInput[1] != null){
    var pdfFile2 = req.files.pdfInput[1];
    pdfFile2.mv('./files/' + date + '/' + pdfFile2.name.replace(/\s+/g, '-'), function(err) { if (err) return res.status(500).send(err)});
    var downloadLink2 = '<a href=' + ("./files/" + date + "/" + pdfFile2.name.replace(/\s+/g, '-')) + ' download>' + pdfFile2.name + '</a>';
  }

  // Save pdf file 3
  if (req.files.pdfInput[2] != null) {
    var pdfFile3 = req.files.pdfInput[2];
    pdfFile3.mv('./files/' + date + '/' + pdfFile3.name.replace(/\s+/g, '-'), function(err) { if (err) return res.status(500).send(err)});
    var downloadLink3 = '<a href=' + ("./files/" + date + "/" + pdfFile3.name.replace(/\s+/g, '-')) + ' download>' + pdfFile3.name + '</a>';
  }

  // Save pdf file 4
  if (req.files.pdfInput[3] != null) {
    var pdfFile4 = req.files.pdfInput[3];
    pdfFile4.mv('./files/' + date + '/' + pdfFile4.name.replace(/\s+/g, '-'), function(err) { if (err) return res.status(500).send(err)});
    var downloadLink4 = '<a href=' + ("./files/" + date + "/" + pdfFile4.name.replace(/\s+/g, '-')) + ' download>' + pdfFile4.name + '</a>';
  }

  // Save pdf file 5
  if (req.files.pdfInput[4] != null) {
    var pdfFile5 = req.files.pdfInput[4];
    pdfFile5.mv('./files/' + date + '/' + pdfFile5.name.replace(/\s+/g, '-'), function(err) { if (err) return res.status(500).send(err)});
    var downloadLink5 = '<a href=' + ("./files/" + date + "/" + pdfFile5.name.replace(/\s+/g, '-')) + ' download>' + pdfFile5.name + '</a>';
  }

  var downloadLinkList = [];
  if (downloadLink1 !== undefined) downloadLinkList.push(downloadLink1 + "<br>");
  if (downloadLink2 !== undefined) downloadLinkList.push(downloadLink2 + "<br>");
  if (downloadLink3 !== undefined) downloadLinkList.push(downloadLink3 + "<br>");
  if (downloadLink4 !== undefined) downloadLinkList.push(downloadLink4 + "<br>");
  if (downloadLink5 !== undefined) downloadLinkList.push(downloadLink5 + "<br>");

  // entry to main page
  var card = '<div class="card bg-light mb-3" id=\"' + date +'\" style="width: 18rem; text-align: center; margin: 0 auto;">' +
  '<div class="card-header">' +
  date +
  '</div>' +
  '<div class="card-body">' +
  downloadLinkList.join("") +
  '</div>' +
  '</div>';

  // write new entry to main page
  fs.readFile(__dirname + '/views/index.html', 'utf8', (err, data) => {
    const dom = new jsdom.JSDOM(data);
    const $ = jquery(dom.window);
    var content = $('#mainPage').html();
    $('#mainPage').html(content + card);

    // organize
    var mainPage = $('#mainPage');
    var dates = mainPage.children('div').get();
    dates.sort(function(a, b) {
      var compA = $(a).attr('id').toUpperCase();
      var compB = $(b).attr('id').toUpperCase();
      return (compA > compB) ? -1 : (compA < compB) ? 1 : 0;
    })
    $.each(dates, function(idx, itm) {
      mainPage.append(itm);
    })

    // write
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
  var newPdfFile1 = req.files.pdfInput[0];
  newPdfFile1.mv('./files/' + newDate + '/' + newPdfFile1.name, function(err) { if (err) return res.status(500).send(err)});

  // link to download file
  var downloadLink = '<a href=' + ("./files/" + newDate + "/" + newPdfFile1.name) + '>' + newPdfFile1.name + '</a>';

  // entry to main page
  var card = '<div class="card bg-light mb-3" id=\"' + newDate +'\" style="width: 18rem; text-align: center; margin: 0 auto;">' +
  '<div class="card-header">' +
  newDate +
  '</div>' +
  '<div class="card-body">' +
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
