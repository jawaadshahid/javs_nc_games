const db = require("../db/connection");

exports.selectUsersUsernames = () => {
  return db
    .query(`SELECT username FROM users;`)
    .then((results) => results.rows);
};
