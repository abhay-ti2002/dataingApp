const express = require("express");
const app = express();
// console.log(app);
const port = 4000;

//get Method
app.get("/user", (req, res) => {
  res.send("Get method");
});

//Post Method
app.post("/user", (req, res) => {
  res.send("Post Method");
});

//delete Method

app.delete("/user", (req, res) => {
  res.send("Delete Method");
});

app.use("/test", (req, res) => {
  res.send("check routers");
});



app.listen(port, () => {
  console.log("Serevr start sucessfully in port 4000...");
});
