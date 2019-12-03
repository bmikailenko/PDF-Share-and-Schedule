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
  
  // list of download links
  var downloadLinkList = [];

  // for each file
  if (req.files.pdfInput.constructor === Array) {
    req.files.pdfInput.forEach(function(item, index) {

      // save the file to it's directory
      item.mv('./files/' + date + '/' + item.name.replace(/\s+/g, '-'), function(err) { if (err) return res.status(500).send(err)});

      // create a download link
      var downloadLink = '<a href=' + ("./files/" + date + "/" + item.name.replace(/\s+/g, '-')) + ' download>' + item.name + '</a> <br>'

      // and push it to the list of download links
      downloadLinkList.push(downloadLink);
    });
  } else {
    item = req.files.pdfInput;
    item.mv('./files/' + date + '/' + item.name.replace(/\s+/g, '-'), function(err) { if (err) return res.status(500).send(err)});

    // create a download link
    var downloadLink = '<a href=' + ("./files/" + date + "/" + item.name.replace(/\s+/g, '-')) + ' download>' + item.name + '</a> <br>'

    // and push it to the list of download links
    downloadLinkList.push(downloadLink);
  }

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

    // write new date
    var content = $('#mainPage').html();
    $('#mainPage').html(content + card);

    // organize
    var mainPage = $('#mainPage');
    var dates = mainPage.children('div').get();
    dates.sort(function(a, b) {
      var compA = $(a).attr('id').toUpperCase();
      var compB = $(b).attr('id').toUpperCase();
      return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
    })
    $.each(dates, function(idx, itm) {
      mainPage.append(itm);
    })

    // write
    fs.writeFile(__dirname + '/views/index.html', dom.serialize(), err => {
    });
  });

  res.redirect('/');

});

// when files are deleted
app.post('/delete', function(req,res){

  // get date input;
  var date = req.body.deleteDate;

  // delete folder from date input
  if (!fs.existsSync('../files/' + date)){
    del.sync('./files/' + date);
  }

  // remove entry from main page
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

  // if no uploaded files just redirect to home
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.redirect('/');
  }

  // list of download links
  var downloadLinkList = [];

  if (req.files.pdfInput.constructor === Array) {
    // for each file
    req.files.pdfInput.forEach(function(item, index) {

      // save the file to it's directory
      item.mv('./files/' + newDate + '/' + item.name.replace(/\s+/g, '-'), function(err) { if (err) return res.status(500).send(err)});

      // create a download link
      var downloadLink = '<a href=' + ("./files/" + newDate + "/" + item.name.replace(/\s+/g, '-')) + ' download>' + item.name + '</a> <br>'

      // and push it to the list of download links
      downloadLinkList.push(downloadLink);
    });
  } else {
    item = req.files.pdfInput;
    item.mv('./files/' + newDate + '/' + item.name.replace(/\s+/g, '-'), function(err) { if (err) return res.status(500).send(err)});

    // create a download link
    var downloadLink = '<a href=' + ("./files/" + newDate + "/" + item.name.replace(/\s+/g, '-')) + ' download>' + item.name + '</a> <br>'

    // and push it to the list of download links
    downloadLinkList.push(downloadLink);
  }

  // entry to main page
  var card = '<div class="card bg-light mb-3" id=\"' + newDate +'\" style="width: 18rem; text-align: center; margin: 0 auto;">' +
  '<div class="card-header">' +
  newDate +
  '</div>' +
  '<div class="card-body">' +
  downloadLinkList.join("") +
  '</div>' +
  '</div>';

  // write new entry to main page
  fs.readFile(__dirname + '/views/index.html', 'utf8', (err, data) => {
    const dom = new jsdom.JSDOM(data);
    const $ = jquery(dom.window);

    // remove old date
    $('#' + oldDate).remove();

    // write new date
    var content = $('#mainPage').html();
    $('#mainPage').html(content + card);

    // organize
    var mainPage = $('#mainPage');
    var dates = mainPage.children('div').get();
    dates.sort(function(a, b) {
      var compA = $(a).attr('id').toUpperCase();
      var compB = $(b).attr('id').toUpperCase();
      return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
    })
    $.each(dates, function(idx, itm) {
      mainPage.append(itm);
    })

    // write
    fs.writeFile(__dirname + '/views/index.html', dom.serialize(), err => {
    });
  });

  res.redirect('/');

});

app.listen(3000,function(){
  console.log("Live at Port 3000");

});
