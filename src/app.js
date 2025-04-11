const express = require("express");
const app = express();
// console.log(app);
const port = 4000;

app.get("/", (req, res) => {
  res.send("hi, server");
});

app.get("/hello", (req, res) => {
  res.send("Hello server");
});

app.listen(port, () => {
  console.log("Serevr start sucessfully in port 4000...");
});
