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

exports.selectReviewById = (review_id) => {
  if (isNaN(review_id))
    return Promise.reject({
      status: 400,
      msg: "Bad request: Invalid Review ID",
    });
  return db
    .query(
      `
      SELECT
        reviews.*,
        COUNT(comments.review_id)::INT AS comment_count
      FROM reviews
      LEFT JOIN comments
      ON reviews.review_id = comments.review_id
      WHERE reviews.review_id = $1
      GROUP BY reviews.review_id
    ;`,
      [review_id]
    )
    .then((results) => {
      if (results.rows.length > 0) {
        return results.rows[0];
      } else {
        return Promise.reject({
          status: 404,
          msg: "Review not found",
        });
      }
    });
};