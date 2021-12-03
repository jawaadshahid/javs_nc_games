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
