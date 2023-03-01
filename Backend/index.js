const http = require("http");
var express = require("express");
var bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");

const port = 3000;
dotenv.config();

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Nothing to see here😌");
});
app.use("/users", require("./Routes/userRouter"));
app.use("/application", require("./Routes/applicationRouter"));

app.listen(port);