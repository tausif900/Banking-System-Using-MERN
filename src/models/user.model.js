const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// User Schema i.e. Structure of an User
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: [true, "email already exist"],
      required: [true, "email is required for the registration"],
      trim: true,
      lowerCase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please provide a valid email",
      ],
    },
    name: {
      type: String,
      required: [true, "username is required"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [
        6,
        "password should contain atleast 6 or more than 6 characters",
      ],
      select: false,
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "password should contains atleast one UpperCase Letter, one LowerCase Letter,one Number and one special Character",
      ],
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  // Agar password modified nahi hua h to yahi se return hojao and next kaam kro
  if (!this.isModified("password")) {
    return;
  }

  const hashPassword = await bcrypt.hash(this.password, 10);
  this.password = hashPassword;

  return;
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
