const express = require("express");
const mongoose = require("mongoose");
const { errors } = require("celebrate");
const cors = require("cors");
const routes = require("./routes");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const errorHandler = require("./middlewares/errorHandler");

const { PORT = 3001 } = process.env;
const app = express();

app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/AviNews", (r) => {
  console.log("Connected to AviNews", r);
});

app.use(express.json());

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use(requestLogger);

app.use(routes);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App is listening on ${PORT}`);
  console.log("App is running");
});
