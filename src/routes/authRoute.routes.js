const express = require("express");
const {
  userRegistration,
  userLogin,
} = require("../controllers/authController.controller");

const router = express.Router();

// Route for registration  POST /auth/register api
router.post("/register", userRegistration);

/**
 * - POST auth/login
 */
router.post("/login", userLogin);

module.exports = router;
