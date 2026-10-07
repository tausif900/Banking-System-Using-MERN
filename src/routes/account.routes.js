const express = require("express");
const { authMiddleware } = require("../middleware/auth.middleware");
const {
  createAccount,
  getUserAccounts,
  getUserBalanceByAccId,
} = require("../controllers/account.controller");

const router = express.Router();

/**
 * - POST /account
 * - Create a new Account
 */
router.post("/create-account", authMiddleware, createAccount);

/**
 * - GET /account
 * - Get all accounts of the logged-in User
 */
router.get("/get-all-accounts", authMiddleware, getUserAccounts);

/**
 * - GET /get-balance/:accountId
 * - Get balance of User by account id.
 */

router.get("/get-balance/:accountId", authMiddleware, getUserBalanceByAccId);

module.exports = router;
