const { selectCommentsByReviewId } = require("../models/comments.model");
const { selectReviewById } = require("../models/reviews.model");

exports.getCommentsByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  selectReviewById(review_id)
    .then(() => {
      return selectCommentsByReviewId(review_id).then((comments) => {
        res.status(200).send({ comments });
      });
    })
    .catch(next);
};
