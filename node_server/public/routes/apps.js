const express = require("express");
const appControllers = require("../controllers/apps.js");
const tokenMiddleware = require("../security/security.js").authenticateToken;

const router = express.Router();

router.get("/calculator", appControllers.getCalculator);

module.exports = router;
