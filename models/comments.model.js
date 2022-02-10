const format = require("pg-format");
const db = require("../db/connection");

exports.selectCommentsByReviewId = (review_id) => {
  return db
    .query(
      `
      SELECT 
        comment_id,
        author,
        votes,
        created_at,
        body
      FROM comments
      WHERE review_id = $1
      ;`,
      [review_id]
    )
    .then((results) => {
      if (results.rows.length > 0) {
        return results.rows;
      } else {
        return Promise.reject({
          status: 404,
          msg: "Not found: no comments found",
        });
      }
    });
};

exports.insertCommentByReviewId = (review_id, author, body) => {
  const commentToInsert = [author, review_id, body];
  const queryStr = format(
    `
    INSERT INTO comments
      (author, review_id, body)
    VALUES
      %L
    RETURNING *;`,
    [commentToInsert]
  );
  return db.query(queryStr).then((results) => {
    return results.rows[0];
  });
};

exports.deleteCommentByCommentId = (comment_id) => {
  return db.query(
    `
      DELETE FROM comments
      WHERE comment_id = $1
      ;`,
    [comment_id]
  );
};

exports.patchCommentByCommentId = (comment_id, inc_votes) => {
  if (isNaN(comment_id)) {
    return Promise.reject({
      status: 400,
      msg: `Bad request: Invalid Comment ID`,
    });
  }
  if (isNaN(inc_votes)) {
    return Promise.reject({
      status: 422,
      msg: `Unprocessable Entity: Invalid request`,
    });
  }
  return db
    .query(
      `
      UPDATE comments 
        SET votes = votes + $2
      WHERE comment_id = $1
      RETURNING *
    ;`,
      [comment_id, inc_votes]
    )
    .then((results) => {
      if (results.rows.length > 0) {
        return results.rows[0];
      } else {
        return Promise.reject({
          status: 404,
          msg: "Not found: no comments found",
        });
      }
    });
};