const http = require("http");
var express = require("express");
var bodyParser = require("body-parser");
const cors = require("cors");
const port = 3000;

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(port);