const express = require("express");
const applicationController = require("../Controllers/applicationController");

const router = express.Router();

router.post("/ask", applicationController.getTextResponse);
router.post("/image", applicationController.playAkinator);
router.post("/upgrade", applicationController.pay);
router.post("/verify", applicationController.verifyPayment);
// router.post("/play", applicationController.getImageResponse);

module.exports = router;