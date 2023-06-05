const express = require("express");
const authControllers = require("../controllers/auth.js");
const tokenMiddleware = require("../security/security.js").authenticateToken;

const router = express.Router();

router.get("/auth-test", tokenMiddleware, authControllers.authTest);
router.post("/login", authControllers.login);
router.get("/get-user/:id", tokenMiddleware, authControllers.readUser);
router.post("/register-user", authControllers.createUser);
router.patch("/update-user/:id", authControllers.updateUser);
router.delete("/delete-user/:id", authControllers.deleteUser);

module.exports = router;
