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
      created_at: expect.any(String),
      comment_count: expect.any(Number),
    })
  );
};

describe("endpoint: get '/api/categories'", () => {
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

describe("endpoint: get '/api/reviews'", () => {
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

describe("endpoint: get '/api/reviews/:review_id'", () => {
  test("status 200: Responds with a review object, which should have the expected properties'", () => {
    return request(app)
      .get("/api/reviews/3")
      .expect(200)
      .then(({ body }) => {
        const { review } = body;
        reviewObjTest(review);
      });
  });
  test("status 400: Responds with Bad request error when review_id invalid", () => {
    return request(app)
      .get("/api/reviews/asd")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request: Invalid Review ID");
      });
  });
  test("status 404: Responds with Not found error when review object not found", () => {
    return request(app)
      .get("/api/reviews/999999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Review not found");
      });
  });
});

describe.only("endpoint: patch '/api/reviews/:review_id'", () => {
  test("status 200: Request body accepts correct object", () => {
    const sendData = { inc_votes: 1 };
    return request(app).patch("/api/reviews/3").send(sendData).expect(200);
  });
  test("Responds with the updated review object", () => {
    const sendData = { inc_votes: -2 };
    return request(app)
      .patch("/api/reviews/3")
      .send(sendData)
      .expect(200)
      .then(({ body }) => {
        const { review } = body;
        reviewObjTest(review);
        expect(review.votes).toBe(3);
      });
  });
  test("status 400: Responds with Bad request error when review_id invalid", () => {
    const sendData = { inc_votes: 1 };
    return request(app)
      .patch("/api/reviews/asd")
      .send(sendData)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request: Invalid Review ID");
      });
  });
  test("status 422: Responds with Unprocessable Entity when inc_votes not set", () => {
    const sendData = {};
    return request(app)
      .patch("/api/reviews/3")
      .send(sendData)
      .expect(422)
      .then(({ body }) => {
        expect(body.msg).toBe("Unprocessable Entity: Invalid request");
      });
  });
  test("status 422: Responds with Unprocessable Entity when inc_votes value invalid", () => {
    const sendData = { inc_votes: "cat" };
    return request(app)
      .patch("/api/reviews/3")
      .send(sendData)
      .expect(422)
      .then(({ body }) => {
        expect(body.msg).toBe("Unprocessable Entity: Invalid request");
      });
  });
  test("status 422: Responds with Unprocessable Entity when Some other property on request body", () => {
    const sendData = { inc_votes: 1, ping: "pong" };
    return request(app)
      .patch("/api/reviews/3")
      .send(sendData)
      .expect(422)
      .then(({ body }) => {
        expect(body.msg).toBe("Unprocessable Entity: Invalid request");
      });
  });
});