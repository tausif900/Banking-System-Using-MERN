const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, "email is required for the registration"],
    trim: true,
    lowerCase: true,
    match:[]
  },
});
