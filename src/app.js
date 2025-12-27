const express = require("express");
const { connectDB } = require("./config/database");
const app = express();
// const port = 4000;
const cookiesParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

// console.log(process.env);

// const User = require("./models/user");
// const { validationSignUpData } = require("./utils/validation");
// const bcrypt = require("bcrypt");
// const { validateLoginEmail } = require("./utils/loginValidation");
// const { userAuth } = require("./middleWare/auth");
// const jwt = require("jsonwebtoken");

app.use(
  cors({
    origin: ["https://heartmatch.app", "http://localhost:5173"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookiesParser());

const authRouter = require("./routes/authrouter");
const profileRouter = require("./routes/profile");
const connectionRouter = require("./routes/request");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);

// let's build a API
// app.post("/signup", async (req, res) => {
//   //  validation of data

//   //encrypt the password

//   console.log(req.body);
//   // const userObj = {
//   //   name: "Abhay Tiwari",
//   //   userName: "@POWER STAR",
//   //   email: "abhai.tiwari@gmail.com",
//   //   password: "123456",
//   //   age: 23,
//   //   phoneno: 123453423,
//   //   gender: "Male",
//   // };

//   try {
//     validationSignUpData(req);

//     const { name, userName, email, password, age, phoneno, gender } = req.body;
//     const saltRounds = 10;
//     const passwordHash = await bcrypt.hash(password, saltRounds);
//     console.log(passwordHash);
//     const user = await new User({
//       name,
//       userName,
//       email,
//       password: passwordHash,
//       age,
//       phoneno,
//       gender,
//     });
//     await user.save();
//     res.send("chlo bhai aaj ka task complete hua");
//   } catch (error) {
//     res.status(400).send("Error in add a user data" + " " + error.message);
//   }
// });

//login api
// app.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     validateLoginEmail(email);
//     const user = await User.findOne({ email: email });
//     // console.log("nn",user);
//     if (!user) {
//       throw new Error("Invalid credential");
//     }

//     const isValidPassword = user.validatePassword(password);

//     // const isValidPassword = await bcrypt.compare(password, user.password);
//     // console.log(isValidPassword);
//     if (isValidPassword) {
//       // create a jwt token
//       const token = await user.getJWT();

//       // const token = await jwt.sign({ _id: user._id }, "DEV@Tinder#777");
//       // console.log(token);
//       //Add the token to cookie and send the response
//       res.cookie("token", token);
//       res.send("Login successfully");
//     } else {
//       throw new Error("password is not correct and account is not exists");
//     }
//   } catch (error) {
//     res.status(400).send("Error:" + " " + error.message);
//   }
// });

//user profile
// app.get("/profile", userAuth, async (req, res) => {
//   try {
//     console.log(req);
//     const user = req.user;
//     res.send(user);
//   } catch (error) {
//     res.status(505).send("Token is not find" + " " + error);
//   }
// });

// get user by email
// app.get("/user", async (req, res) => {
//   const userEmail = req.body.email;
//   const userName = req.body.name;
//   const id = req.body._id;

//   try {
//     const users = await User.find({ email: userEmail });
//     console.log(users);
//     if (users.length === 0) {
//       res.status(404).send("User Not found");
//     } else {
//       res.send(users);
//     }
//   } catch (err) {
//     res.status(404).send("404 not found" + err.message);
//   }
// });

// FEED API->get all the user from database

// app.get("/feed", async (req, res) => {
//   try {
//     const allUsers = await User.find({});
//     res.send(allUsers);
//   } catch (err) {
//     res.status(404).send("NOt data from Any User" + " " + err.message);
//   }
// });

//delete a user document
// app.delete("/remove", async (req, res) => {
//   const id = req.body._id;

//   try {
//     const remuser = await User.findByIdAndDelete(id);
//     res.send(remuser);
//   } catch (err) {
//     res.status(404).send("user not found to delete" + " " + err.message);
//   }
// });

// update a user document
// app.patch("/updateUser/:_id", async (req, res) => {
//   const id = req.params?._id;
//   const data = req.body;
//   const validateData = {
//     runValidators: true,
//   };

//   try {
//     const Allowed_Update = [
//       "name",
//       "password",
//       "skills",
//       "about",
//       "gender",
//       "photourl",
//       "phoneNo",
//     ];

//     const permissionToUpDate = Object.keys(data).every((k) =>
//       Allowed_Update.includes(k)
//     );

//     if (!permissionToUpDate) {
//       throw new Error("update is not allowed");
//     }

//     const upUser = await User.findByIdAndUpdate(id, data, validateData);
//     res.send("Update user data");
//   } catch (err) {
//     res.status(404).send("error to update user data" + " " + err.message);
//   }
// });

// connection of database mongobd
connectDB()
  .then(() => {
    console.log("Connected to database");
    app.listen(process.env.PORT, () => {
      console.log("Serevr start sucessfully in port 4000...");
    });
  })
  .catch((error) => {
    console.log("Not connect to database");
  });

  