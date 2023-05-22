const express = require("express");
const applicationController = require("../Controllers/applicationController");

const router = express.Router();

router.post("/recaptcha", applicationController.recaptcha);

module.exports = router;