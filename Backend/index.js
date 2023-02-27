const http = require("http");
var express = require("express");
var bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");

const port = 3000;
dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const getRes = async (openai, userPrompt) => {
  let res = await openai.createCompletion({
    model: "text-curie-001",
    // Find the other models here: https://platform.openai.com/playground/
    prompt: userPrompt,
    temperature: 0.7,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  console.log(res.data.choices[0].text);
  return res.data.choices[0].text;
};

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Nothing to see here😌");
});

app.post("/ask", async (req, res) => {
  const userPrompt = req.body.prompt;
  const response = await getRes(openai, userPrompt);
  res.send(response);
});

app.post("/play", async (req, res) => {
  const category = req.body.category;
  console.log(`Let's play akinator on ${category}!`);
  res.send("Yet to work on this");
});

app.listen(port);