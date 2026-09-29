const express = require("express");
const { authMiddleware } = require("../middleware/auth.middleware");
const { createTransaction } = require("../controllers/transaction.controller");

const router = express.Router();

/**
 * - POST /transaction/create-transaction
 * - Create a new transaction
 */
router.post("/create-transaction", authMiddleware, createTransaction);

module.exports = router;
