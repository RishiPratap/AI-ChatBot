const express = require("express");
const applicationController = require("../Controllers/applicationController");

const router = express.Router();

router.post("/ask", applicationController.get_text_response);
router.post("/play", applicationController.play_akinator);

module.exports = router;