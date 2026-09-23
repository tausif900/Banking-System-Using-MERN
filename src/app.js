const express = require("express");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/authRoute.routes");
const accountRouter = require("./routes/account.routes");
const transactionRouter = require("./routes/transaction.routes");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRouter);
app.use("/account", accountRouter);
app.use("/transaction", transactionRouter);

module.exports = app;
