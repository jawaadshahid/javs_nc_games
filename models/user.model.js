const db = require("../db/connection");

exports.selectUsersUsernames = () => {
  return db
    .query(`SELECT username FROM users;`)
    .then((results) => results.rows);
};

exports.selectUserByUsername = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1;`, [username])
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