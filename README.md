<!-- question  -->

<!-- code -->

<!-- code A -->
app.use("/", (req, res) => {
  res.send("hi, server");
});

app.use("/test", (req, res) => {
  res.send("check routers");
});

app.use("/hello", (req, res) => {
  res.send("Hello server");
});
 
<!-- code B -->

app.use("/", (req, res) => {
  res.send("hi, server");
});

app.use("/test", (req, res) => {
  res.send("check routers");
});

app.use("/hello", (req, res) => {
  res.send("Hello server");
});

What will be the response when a user visits the following URLs?

/

/test

/hello

/unknown

Explain why this happens based on how app.use() and route matching work in Express.