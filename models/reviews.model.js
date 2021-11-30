const db = require("../db/connection");

exports.selectReviews = () => {
  return db
    .query(
      `
    SELECT
      reviews.*,
      COUNT(comments.review_id)::INT AS comment_count
    FROM reviews
    LEFT JOIN comments
    ON reviews.review_id = comments.review_id
    GROUP BY reviews.review_id
    ORDER BY reviews.review_id ASC
    ;`
    )
    .then((results) => results.rows);
};
