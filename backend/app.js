const Api = require("./api_helpers.js");
const express = require("express");

// setup
const app = express();
const port = 3000;

// route handlers
const rootHandler = (req, res) => {
  const data = {
    message: "hello world",
  };
  res.send(Api.success(data));
}

// routes
app.get('/', rootHandler);

// start script
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
