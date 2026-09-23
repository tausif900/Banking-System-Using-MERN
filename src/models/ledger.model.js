const mongoose = require("mongoose");

const ledgerSchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "account",
    required: [true, "Ledger must be associated with an account"],
    index: true,
    immutable: true,
  },

  ammount: {
    type: Number,
    required: [true, "Amount is required for creating a ledger"],
    immutable: true,
  },

  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "transaction",
    required: [true, "Ledger must be associated with the transaction"],
    index: true,
    immutable: true,
  },

  type: {
    type: String,
    enum: ["CREDIT", "DEBIT"],
    index: true,
    immutable: true,
  },
});

function preventModification() {
  throw new Error(
    "Ledger entries cann't be modified or deleted as it is immutable",
  );
}

// whenever anyone tries to modify ledger this function will be called

ledgerSchema.pre("findOneAndUpdate", preventModification);
ledgerSchema.pre("updateOne", preventModification);
ledgerSchema.pre("deleteOne", preventModification);
ledgerSchema.pre("remove", preventModification);
ledgerSchema.pre("deleteMany", preventModification);
ledgerSchema.pre("updateMany", preventModification);
ledgerSchema.pre("findOneAndDelete", preventModification);
ledgerSchema.pre("findOneAndReplace", preventModification);

const ledgerModel = mongoose.model("ledger", ledgerSchema);

module.exports = ledgerModel;
