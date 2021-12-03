const {
  getCommentsByReviewId,
  postCommentByUsername,
} = require("../controllers/comments.controller");
const {
  getReviews,
  getReviewById,
  patchReviewById,
} = require("../controllers/reviews.controller");

const reviewsRouter = require("express").Router();

reviewsRouter.route("/").get(getReviews);
reviewsRouter.route("/:review_id").get(getReviewById).patch(patchReviewById);
reviewsRouter
  .route("/:review_id/comments")
  .get(getCommentsByReviewId)
  .post(postCommentByUsername);

module.exports = reviewsRouter;
