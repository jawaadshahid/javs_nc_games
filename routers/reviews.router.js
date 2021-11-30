const { getReviews } = require("../controllers/reviews.controller");

const reviewsRouter = require("express").Router();

reviewsRouter.route("/").get(getReviews);

module.exports = reviewsRouter;
