const {
  selectCommentsByReviewId,
  insertCommentByReviewId,
} = require("../models/comments.model");
const { ifReviewExistsById } = require("../models/reviews.model");

exports.getCommentsByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  ifReviewExistsById(review_id)
    .then(() => {
      return selectCommentsByReviewId(review_id).then((comments) => {
        res.status(200).send({ comments });
      });
    })
    .catch(next);
};

exports.postCommentByUsername = (req, res, next) => {
  const { review_id } = req.params;
  ifReviewExistsById(review_id)
    .then(() => {
      const author = req.body.username;
      const { body } = req.body;
      return insertCommentByReviewId(review_id, author, body).then(
        (comment) => {
          res.status(201).send({ comment });
        }
      );
    })
    .catch(next);
};
