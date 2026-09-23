const express = require("express");
const { authMiddleware } = require("../middleware/auth.middleware");
const { createAccount } = require("../controllers/account.controller");

const router = express.Router();

/**
 * - POST /account
 * - Create a new Account
 */
router.post("/create-account", authMiddleware, createAccount);

module.exports = router;
