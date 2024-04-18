const Anthropic = require('@anthropic-ai/sdk');
require("dotenv").config();

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

const getRes = async (anthropic, userPrompt) => {
  try {
    const res = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1256,
      messages: [{ role: "user", content: userPrompt }],
    });
    console.log(res);
    
    return res;
  } catch (error) {
    console.error("Error getting response:", error);
    throw error;
  }
};

const getTextResponse = async (req, res) => {
  try {
    console.log("text requested");
    const userPrompt = req.body.prompt;
    const response = await getRes(anthropic, userPrompt);
    res.send(response);
  } catch (error) {
    console.error("Error handling text request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const playAkinator = async (req, res) => {
  const category = req.body.category;
  console.log(`Let's play akinator on ${category}!`);
  res.send("Yet to work on this");
};

module.exports = {
  getTextResponse,
  playAkinator,
};
