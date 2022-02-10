const {
  removeCommentByCommentId,
  patchCommentByCommentId,
} = require("../controllers/comments.controller");

const commentsRouter = require("express").Router();

commentsRouter
  .route("/:comment_id")
  .delete(removeCommentByCommentId)
  .patch(patchCommentByCommentId);

module.exports = commentsRouter;
