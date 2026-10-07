const accountModel = require("../models/account.model");

const createAccount = async (req, res) => {
  const user = req.user;

  const account = await accountModel.create({
    user: user._id,
  });

  res.status(201).json({ account });
};

const getUserAccounts = async (req, res) => {
  const accounts = await accountModel.find({ user: req.user._id });
  res.status(200).json({ accounts });
};

const getUserBalanceByAccId = async (req, res) => {
  const { accountId } = req.params;

  console.log(accountId);

  const account = await accountModel.findOne({
    _id: accountId,
    user: req.user._id,
  });

  console.log(account);

  if (!account) {
    return res.status(404).json({ message: "Account not found" });
  }

  const balance = await account.getBalance();

  res.status(200).json({ accountId: account._id, balance });
};

module.exports = { createAccount, getUserAccounts, getUserBalanceByAccId };
