const express = require("express");
const {
  userRegistration,
  userLogin,
  userLogout,
} = require("../controllers/authController.controller");

const router = express.Router();

// Route for registration  POST /auth/register api
router.post("/register", userRegistration);

/**
 * - POST auth/login
 */
router.post("/login", userLogin);

router.post("/logout",userLogout)

module.exports = router;
