const {
  removeCommentByCommentId,
} = require("../controllers/comments.controller");

const commentsRouter = require("express").Router();

commentsRouter.route("/:comment_id").delete(removeCommentByCommentId);

module.exports = commentsRouter;
