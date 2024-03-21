const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");

const { PORT = 3001 } = process.env;
const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/AviNews", (r) => {
  console.log("Connected to AviNews", r);
});

app.use(express.json());

app.use(routes);

app.listen(PORT, () => {
  console.log(`App is listening on ${PORT}`);
  console.log("App is running");
});
