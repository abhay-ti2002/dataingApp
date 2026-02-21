const validator = require("validator");
//helper function to validate data
const validationSignUpData = (req) => {
  const { name, userName, email, password } = req.body;

  if (!name || !userName) {
    throw new Error("Name is Empty");
  }  else if (!validator.isEmail(email)) {
    throw new Error("Email is not correct");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password not correct form");
    }
    
};

module.exports = { validationSignUpData };
