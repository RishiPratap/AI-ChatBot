const Anthropic = require('@anthropic-ai/sdk');
const Razorpay = require("razorpay");
const crypto = require("crypto");
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

const pay = async (req, res) => {
  try{
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_API_KEY,
      key_secret: process.env.RAZORPAY_SECRET_KEY,
    });
    const options = { 
      amount: 5000, 
      currency: "INR",
      receipt: crypto.randomBytes(20).toString("hex"),
    };
    instance.orders.create(options, (err, order) => {
      if(err){
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
      }else{
        console.log(order);
        res.status(200).json({data: order});
      }
    });
  }catch(err){
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const verifyPayment = async(req, res) => {
  try{
    const{razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body;
    const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET_KEY);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest("hex");
    if(digest === razorpay_signature){
      res.status(200).json({success: true});
    }
    else{
      res.status(400).json({error: "Payment verification failed"});
    }
  }catch(err){
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
}
}
const playAkinator = async (req, res) => {
  const category = req.body.category;
  console.log(`Let's play akinator on ${category}!`);
  res.send("Yet to work on this");
};

module.exports = {
  getTextResponse,
  playAkinator,
  pay,
  verifyPayment
};
