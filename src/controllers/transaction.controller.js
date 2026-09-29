const accountModel = require("../models/account.model");
const ledgerModel = require("../models/ledger.model");
const transactionModel = require("../models/transaction.model");
const { sendTransactionEmail } = require("../services/email.service");
const mongoose = require("mongoose");

const createTransaction = async (req, res) => {
  /**
   * - Validate request
   */
  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    return res
      .status(400)
      .json({ message: "Something is missing from the fields" });
  }

  // Jis account se Paise transafer hore hai
  const fromAcc = await accountModel.findOne({ _id: fromAccount });

  // Jis account me Paise transfer hora hai
  const toAcc = await accountModel.findOne({ _id: toAccount });

  if (!fromAcc || !toAcc) {
    return res.status(400).json({ message: "Invalid Account" });
  }

  /**
   * - Validate IdempotencyKey
   */

  const isTransactionAlreadyExists = await transactionModel.findOne({
    idempotencyKey,
  });

  if (isTransactionAlreadyExists) {
    if (isTransactionAlreadyExists.status === "COMPLETED") {
      return res.status(200).json({
        message: "Transaction already processed",
        transaction: isTransactionAlreadyExists,
      });
    }

    if (isTransactionAlreadyExists.status === "PENDING") {
      return res
        .status(200)
        .json({ message: "Transaction is still in a pending state" });
    }

    if (isTransactionAlreadyExists.status === "FAILED") {
      return res.status(500).json({
        message: "Transaction process Failed, Please try again later",
      });
    }

    if (isTransactionAlreadyExists.status === "REVERSED") {
      return res.status(500).json({
        message: "Transaction is reversed, Please try again later",
      });
    }
  }

  /**
   * - Check Acount status
   */

  if (fromAcc.status !== "ACTIVE" || toAcc.status !== "ACTIVE") {
    return res.status(400).json({
      message:
        "from account and to Account must be ACTIVE to process transaction",
    });
  }

  /**
   * Derive sender balance from ledger
   */

  const balance = await fromAcc.getBalance();

  if (balance < amount) {
    return res.status(400).json({
      message: `You have ${balance} left, which is not sufficinet to make transaction`,
    });
  }

  /**
   * -  Create transaction
   */

  const session = await mongoose.startSession();
  session.startTransaction();

  const transaction = await transactionModel.create(
    {
      fromAccount,
      toAccount,
      amount,
      idempotencyKey,
      status: "PENDING",
    },
    { session },
  );

  const debitLedgerEntry = await ledgerModel.create(
    {
      account: fromAccount,
      amount: amount,
      transaction: transaction._id,
      type: "DEBIT",
    },
    { session },
  );

  const creditLedgerEntry = await ledgerModel.create(
    {
      account: toAccount,
      amount: amount,
      transaction: transaction._id,
      type: "CREDIT",
    },
    { session },
  );

  transaction.status = "COMPLETED";
  await transaction.save({ session });

  await session.commitTransaction();
  session.endSession();

  /**
   *  - Email
   */

  await sendTransactionEmail(req.user.email, req.user.name, amount, toAccount);
  return res.status(201).json({
    message: "Transaction completed successfully",
    transaction,
  });
};

module.exports = { createTransaction };
