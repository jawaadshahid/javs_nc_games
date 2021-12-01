const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app");

beforeEach(() => seed(testData));
afterAll(() => db.end());

// describe("endpoint: '/api'", () => {
//   test("status 200: JSON describing all the available endpoints on your API'", () => {
//     return request(app)
//       .get("/api")
//       .expect(200)
//       .then(({ text }) => {
//         // TODO: adjust text to match description
//         expect(text).toBe("All OK from API Router");
//       });
//   });
// });

const reviewObjTest = (reviewObj) => {
  expect(reviewObj).toEqual(
    expect.objectContaining({
      review_id: expect.any(Number),
      title: expect.any(String),
      review_body: expect.any(String),
      designer: expect.any(String),
      review_img_url: expect.any(String),
      votes: expect.any(Number),
      category: expect.any(String),
      owner: expect.any(String),
      // TODO: is there a better test for a date?
      created_at: expect.any(String),
      comment_count: expect.any(Number),
    })
  );
};

describe("endpoint: '/api/categories'", () => {
  test("status 200: Responds with an array of category objects with correct properties'", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        const { categories } = body;
        expect(categories).toBeInstanceOf(Array);
        expect(categories).toHaveLength(4);
        categories.forEach((category) => {
          expect(category).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe("endpoint: '/api/reviews'", () => {
  test("status 200: Responds with an array of review objects with the expected properties'", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toBeInstanceOf(Array);
        expect(reviews).toHaveLength(13);
        reviews.forEach((review) => {
          reviewObjTest(review);
        });
      });
  });
});

describe("endpoint: '/api/reviews/:review_id'", () => {
  test("status 200: Responds with a review object, which should have the expected properties'", () => {
    return request(app)
      .get("/api/reviews/3")
      .expect(200)
      .then(({ body }) => {
        const { review } = body;
        reviewObjTest(review);
      });
  });
});