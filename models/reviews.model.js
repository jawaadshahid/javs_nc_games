const db = require("../db/connection");

exports.ifReviewExistsById = (review_id) => {
  return db
    .query(`SELECT EXISTS(SELECT 1 FROM reviews WHERE review_id = $1);`, [
      review_id,
    ])
    .then((results) => {
      if (!results.rows[0].exists) {
        return Promise.reject({
          status: 404,
          msg: "Not found: no reviews found",
        });
      }
    });
};

exports.selectReviews = (sort_by = "created_at", order = "desc", category) => {
  let queryStr = `
      SELECT
        reviews.*,
        COUNT(comments.review_id)::INT AS comment_count
      FROM reviews
      LEFT JOIN comments
      ON reviews.review_id = comments.review_id`;

  if (category) {
    queryStr += ` WHERE reviews.category = $1`;
  }

  // whitelist sort_by query
  if (
    ![
      "review_id",
      "title",
      "review_body",
      "designer",
      "votes",
      "category",
      "owner",
      "created_at",
      "comment_count",
    ].includes(sort_by)
  ) {
    return Promise.reject({
      status: 400,
      msg: "Bad request: Invalid sort query",
    });
  }
  // whitelist order query
  if (!["asc", "desc"].includes(order)) {
    return Promise.reject({
      status: 400,
      msg: "Bad request: Invalid order query",
    });
  }

  queryStr += ` GROUP BY reviews.review_id
  ORDER BY reviews.${sort_by} ${order};`;

  // pass category as arg only when its defined
  return db
    .query(queryStr, category ? [category] : undefined)
    .then((results) => {
      return results.rows;
    });
};

exports.selectReviewById = (review_id) => {
  if (isNaN(review_id)) {
    return Promise.reject({
      status: 400,
      msg: `Bad request: Invalid Review ID`,
    });
  }
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
          msg: "Not found: no reviews found",
        });
      }
    });
};

exports.incrementReviewVotesById = (review_id, inc_votes) => {
  if (isNaN(review_id)) {
    return Promise.reject({
      status: 400,
      msg: `Bad request: Invalid Review ID`,
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
      UPDATE reviews 
        SET votes = votes + $2
      WHERE review_id = $1
    ;`,
      [review_id, inc_votes]
    )
    .then(() => {
      return this.selectReviewById(review_id);
    });
};