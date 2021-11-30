const express = require("express");
const { handleServerErrors } = require("./errors");
const apiRouter = require("./routers/api.router");

const app = express();

app.use("/api", apiRouter);

app.use(handleServerErrors);

module.exports = app;
