const { Configuration, OpenAIApi } = require("openai");

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

const get_text_response = async (req, res) => {
  console.log(req.body.prompt);
  const userPrompt = req.body.prompt;
  const response = await getRes(openai, userPrompt);
  res.send(response);
}

const play_akinator = async (req, res) => {
    const category = req.body.category;
    console.log(`Let's play akinator on ${category}!`);
    res.send("Yet to work on this");
}

module.exports = {
    get_text_response,
    play_akinator,
}