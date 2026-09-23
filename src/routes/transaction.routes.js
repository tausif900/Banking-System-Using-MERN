const express = require("express");
const { authMiddleware } = require("../middleware/auth.middleware");

const router = express.Router();

/**
 * - POST /transaction/create-transaction
 * - Create a new transaction
 */
router.post("/create-transaction", authMiddleware);

module.exports = router;
