const db = require("../db/connection");

exports.selectCategories = () => {
  return db.query(`SELECT * FROM categories;`).then((results) => results.rows);
};

exports.ifCategoryExistsBySlug = (slug) => {
  return db
    .query(`SELECT EXISTS(SELECT 1 FROM categories WHERE slug = $1);`, [slug])
    .then((results) => {
      if (!results.rows[0].exists) {
        return Promise.reject({
          status: 404,
          msg: "Not found: no categories found",
        });
      }
    });
};