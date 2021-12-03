const db = require("../connection");
const format = require("pg-format");

const seed = (data) => {
  const { categoryData, commentData, reviewData, userData } = data;
  return db
    .query(`DROP TABLE IF EXISTS comments;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS reviews;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS categories;`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE categories (
          slug VARCHAR(50) UNIQUE PRIMARY KEY,
          description TEXT 
        );`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE users (
          username VARCHAR(50) UNIQUE PRIMARY KEY,
          avatar_url VARCHAR(200),
          name VARCHAR(50)
        );`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE reviews (
          review_id SERIAL PRIMARY KEY,
          title VARCHAR(200),
          review_body TEXT,
          designer VARCHAR(50),
          review_img_url VARCHAR(200) DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
          votes INT DEFAULT 0,
          category VARCHAR(50),
          owner VARCHAR(50),
          created_at DATE DEFAULT CURRENT_DATE,
          FOREIGN KEY (category) REFERENCES categories(slug),
          FOREIGN KEY (owner) REFERENCES users(username)
        );`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE comments (
          comment_id SERIAL PRIMARY KEY,
          author VARCHAR(50),
          review_id INT,
          votes INT DEFAULT 0,
          created_at DATE DEFAULT CURRENT_DATE,
          body TEXT,
          FOREIGN KEY (author) REFERENCES users(username),
          FOREIGN KEY (review_id) REFERENCES reviews(review_id)
        );`);
    })
    .then(() => {
      const formattedCategoriesData = categoryData.map((categoryObj) => {
        return [categoryObj.slug, categoryObj.description];
      });
      const queryStr = format(
        `
        INSERT INTO categories
          (slug, description)
        VALUES 
          %L;`,
        formattedCategoriesData
      );
      return db.query(queryStr);
    })
    .then(() => {
      const formattedUsersData = userData.map((usersObj) => {
        return [usersObj.username, usersObj.avatar_url, usersObj.name];
      });
      const queryStr = format(
        `
        INSERT INTO users
          (username, avatar_url, name)
        VALUES
          %L;`,
        formattedUsersData
      );
      return db.query(queryStr);
    })
    .then(() => {
      const formattedReviewsData = reviewData.map((reviewsObj) => {
        return [
          reviewsObj.title,
          reviewsObj.review_body,
          reviewsObj.designer,
          reviewsObj.review_img_url,
          reviewsObj.votes,
          reviewsObj.category,
          reviewsObj.owner,
          reviewsObj.created_at,
        ];
      });
      const queryStr = format(
        `
        INSERT INTO reviews
          (title, review_body, designer, review_img_url, votes, category, owner, created_at)
        VALUES
          %L;`,
        formattedReviewsData
      );
      return db.query(queryStr);
    })
    .then(() => {
      const formattedCommentData = commentData.map((commentObj) => {
        return [
          commentObj.author,
          commentObj.review_id,
          commentObj.votes,
          commentObj.created_at,
          commentObj.body,
        ];
      });
      const queryStr = format(
        `
        INSERT INTO comments
          (author, review_id, votes, created_at, body)
        VALUES
          %L;`,
        formattedCommentData
      );
      return db.query(queryStr);
    });
};

module.exports = seed;
