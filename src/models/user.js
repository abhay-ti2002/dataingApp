const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    phoneNo: { type: Number },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("EMAIL IS NOT VALID");
        }
      },
    },
    password: { type: String },
    userName: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      default: 20,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("gender data is not match");
        }
      },
    },
    photourl: {
      type: String,
      default:
        "https://media.istockphoto.com/id/6829a5e08ae0dbcc14bf69cf/vector/user-profile-icon-avatar-person-sign-profile-picture-portrait-symbol-easily-editable-line.jpg?s=1024x1024&w=is&k=20&c=8Ab0fuDU7NgRHyww4QmftNUOywbKPBtjBMxUyHfGvT4=",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Photo url is not correct" + " " + value);
        }
      },
    },
    about: {
      type: String,
      default: " This is a about section from user",
    },
    skills: {
      type: [String],
    },
    // -------------email-verification------------
    isEmailVerification: {
      type: Boolean,
      default: false,
    },

    emailOtp: {
      type: String,
    },

    emailOtpExpire: {
      type: Date,
    },
  },
  { timestamps: true },
);

userSchema.methods.getJWT = async function () {
  // console.log(this);
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "DEV@Tinder#777", {
    expiresIn: "7d",
  });

  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  // console.log(typeof passwordInputByUser);
  const user = this;
  const passwordHash = user.password;

  const isValidatePassword = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );
  return isValidatePassword;
};
//model
module.exports = mongoose.model("User", userSchema);
