const {
  selectCommentsByReviewId,
  insertCommentByReviewId,
  deleteCommentByCommentId,
  patchCommentByCommentId,
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

exports.removeCommentByCommentId = (req, res, next) => {
  const { comment_id } = req.params;
  deleteCommentByCommentId(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

exports.patchCommentByCommentId = (req, res, next) => {
  const { comment_id } = req.params;
  const inc_votes =
    Object.keys(req.body).length === 1 ? req.body.inc_votes : undefined;
  patchCommentByCommentId(comment_id, inc_votes)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};