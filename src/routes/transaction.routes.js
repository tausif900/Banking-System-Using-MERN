const express = require("express");
const { authMiddleware, authSystemUserMiddleware } = require("../middleware/auth.middleware");
const { createTransaction, createInitialFundsTransaction } = require("../controllers/transaction.controller");

const router = express.Router();

/**
 * - POST /transaction/create-transaction
 * - Create a new transaction
 */
router.post("/create-transaction", authMiddleware, createTransaction);

/**
 *  - POST /transactions/system/initial-funds
 *  - Create initial funds transaction
 */
router.post("/system/initial-funds",authSystemUserMiddleware,createInitialFundsTransaction)



module.exports = router;
