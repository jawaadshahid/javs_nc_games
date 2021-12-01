const express = require("express");
const { handleServerErrors, handleCustomErrors } = require("./errors");
const apiRouter = require("./routers/api.router");

const app = express();
app.use(express.json());

app.use("/api", apiRouter);

app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
