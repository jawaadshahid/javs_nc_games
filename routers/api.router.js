const categoriesRouter = require("./categories.router");

const apiRouter = require("express").Router();

apiRouter.get("/", (req, res, next) => {
  res.status(200).send("All OK from API Router");
});

apiRouter.use("/categories", categoriesRouter);

module.exports = apiRouter;
