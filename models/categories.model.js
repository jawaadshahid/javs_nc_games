const db = require("../db/connection");

exports.selectCategories = () => {
  return db.query(`SELECT * FROM categories;`).then((results) => results.rows);
};

exports.selectCategoryBySlug = (slug) => {
  return db
    .query(
      `
      SELECT *
      FROM categories
      WHERE slug = $1;
      `,
      [slug]
    )
    .then((results) => {
      if (results.rows.length > 0) {
        return results.rows[0];
      } else {
        return Promise.reject({
          status: 404,
          msg: "Not found: no categories found",
        });
      }
    });
};