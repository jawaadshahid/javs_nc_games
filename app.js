const express = require("express");
const cors = require("cors");
app.use(cors());

const app = express();
app.use(express.json());

const {
  handleServerErrors,
  handleCustomErrors,
  handleSQLErrors,
} = require("./errors");
const apiRouter = require("./routers/api.router");

app.use("/api", apiRouter);

app.use(handleCustomErrors);
app.use(handleSQLErrors);
app.use(handleServerErrors);

module.exports = app;
