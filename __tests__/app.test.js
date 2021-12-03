const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app");

beforeEach(() => seed(testData));
afterAll(() => db.end());

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
  test("status 400: Bad request error when review_id invalid", () => {
    return request(app)
      .get("/api/reviews/asd")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request: Invalid Review ID");
      });
  });
  test("status 404: Not found error when review object not found", () => {
    return request(app)
      .get("/api/reviews/999999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found: no reviews found");
      });
  });
});

describe("endpoint: patch '/api/reviews/:review_id'", () => {
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
  test("status 400: Bad request error when review_id invalid", () => {
    const sendData = { inc_votes: 1 };
    return request(app)
      .patch("/api/reviews/asd")
      .send(sendData)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request: Invalid Review ID");
      });
  });
  test("status 422: Unprocessable Entity error when inc_votes not set", () => {
    const sendData = {};
    return request(app)
      .patch("/api/reviews/3")
      .send(sendData)
      .expect(422)
      .then(({ body }) => {
        expect(body.msg).toBe("Unprocessable Entity: Invalid request");
      });
  });
  test("status 422: Unprocessable Entity error when inc_votes value invalid", () => {
    const sendData = { inc_votes: "cat" };
    return request(app)
      .patch("/api/reviews/3")
      .send(sendData)
      .expect(422)
      .then(({ body }) => {
        expect(body.msg).toBe("Unprocessable Entity: Invalid request");
      });
  });
  test("status 422: Unprocessable Entity error when Some other property on request body", () => {
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
  test("Should sort by `created_at` and order by descending as defaults", () => {
    // test default
    return request(app)
      .get("/api/reviews")
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toBeSorted("created_at", { descending: true });
      });
  });
  test("Should accept `sort_by` query, which sorts by any valid column", () => {
    return request(app)
      .get("/api/reviews?sort_by=votes")
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toBeSortedBy("votes", { descending: true });
      });
  });
  test("status 400: Bad request error when `sort_by` invalid column", () => {
    return request(app)
      .get("/api/reviews?sort_by=addsgf")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request: Invalid sort query");
      });
  });
  test("Should accept `order` query, which sets sort order", () => {
    return request(app)
      .get("/api/reviews?sort_by=votes&order=asc")
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toBeSortedBy("votes", { ascending: true });
      });
  });
  test("status 400: Bad request error when `order` !== 'asc' / 'desc'", () => {
    return request(app)
      .get("/api/reviews?sort_by=votes&order=fghsdf")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request: Invalid order query");
      });
  });
  test("Should accept `category` query, which filters by the passed value", () => {
    return request(app)
      .get("/api/reviews?category=social deduction")
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toHaveLength(11);
        reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              category: "social deduction",
            })
          );
        });
      });
  });
  test("status 404: Not found error when category invalid", () => {
    return request(app)
      .get("/api/reviews?category=sbfhsdsa")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found: no categories found");
      });
  });
  test("status 404: Not found error when no reviews associated with category", () => {
    return request(app)
      .get("/api/reviews?category=children's games")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found: no reviews found");
      });
  });
});