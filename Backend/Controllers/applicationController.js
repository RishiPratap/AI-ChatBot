const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

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

const recaptcha = async (req, res) => {
    //Destructuring response token from request body
    const {token} = req.body;

//sends secret key and response token to google
    await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=6LdaPeUkAAAAAOhwINmyahYEm-8TEoxrmhS9q0Qq&response=${token}`
      );

//check response status and send back to the client-side
      if (res.status(200)) {
        res.send("Human");
    }else{
      res.send("Robot");
    }
}
    

module.exports = {
    get_text_response,
    play_akinator,
    recaptcha
}