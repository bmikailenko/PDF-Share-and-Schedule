var express = require("express");
var app = express();
var router = express.Router();
var fileUpload = require("express-fileupload");
var bodyParser = require("body-parser");
var mv = require("mv");
var fs = require("fs");
var path = require("path");


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(fileUpload());

app.get('/',function(req,res){
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/", function(req, res) {
  var pdfFile = req.body.pdfFile;
  console.log(req.body)
  //pdfFile.mv('/files');
});

app.listen(3000,function(){
  console.log("Live at Port 3000");
});
