const categoriesRouter = require("./categories.router");
const reviewsRouter = require("./reviews.router");

const apiRouter = require("express").Router();

apiRouter.get("/", (req, res, next) => {
  res.status(200).send("All OK from API Router");
});

apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/reviews", reviewsRouter);

module.exports = apiRouter;
