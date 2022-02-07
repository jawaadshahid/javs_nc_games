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

const commentObjTest = (commentObj) => {
  expect(commentObj).toEqual(
    expect.objectContaining({
      comment_id: expect.any(Number),
      votes: expect.any(Number),
      created_at: expect.any(String),
      author: expect.any(String),
      body: expect.any(String),
    })
  );
};

describe("endpoint: get '/api'", () => {
  test("status 200: Responds with JSON describing all available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const { routes } = body;
        expect(routes).toBeInstanceOf(Array);
        routes.forEach((route) => {
          expect(route).toEqual(
            expect.objectContaining({
              method: expect.any(String),
              path: expect.any(String),
            })
          );
        });
      });
  });
});

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
  test("status 404: Not found error when review not found", () => {
    return request(app)
      .get("/api/reviews/999999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found: no reviews found");
      });
  });
});

describe("endpoint: patch '/api/reviews/:review_id'", () => {
  test("status 200: Request body accepts an object", () => {
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
  test("status 404: Not found error when review not found", () => {
    const sendData = { inc_votes: 1 };
    return request(app)
      .patch("/api/reviews/99999")
      .send(sendData)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found: no reviews found");
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
        expect(reviews).toBeInstanceOf(Array);
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
  test("should return empty array when no reviews associated with category", () => {
    return request(app)
      .get("/api/reviews?category=children's games")
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toBeInstanceOf(Array);
        expect(reviews).toHaveLength(0);
      });
  });
});

describe("endpoint: get '/api/reviews/:review_id/comments'", () => {
  test("status 200: Responds with an array of comments for the given `review_id`", () => {
    return request(app)
      .get("/api/reviews/3/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(3);
        comments.forEach((comment) => {
          commentObjTest(comment);
        });
      });
  });
  test("status 400: Bad request error when review_id invalid", () => {
    const sendData = { inc_votes: 1 };
    return request(app)
      .get("/api/reviews/asd/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request: Invalid input");
      });
  });
  test("status 404: Not found error when review not found", () => {
    return request(app)
      .get("/api/reviews/999999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found: no reviews found");
      });
  });
  test("status 404: Not found error when comments not found", () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found: no comments found");
      });
  });
});

describe("endpoint: post '/api/reviews/:review_id/comments'", () => {
  test("status 201: Request body accepts an object", () => {
    const sendData = {
      username: "dav3rid",
      body: "Laborum commodo magna ipsum eiusmod. Anim ad irure dolor do non ex quis dolore.",
    };
    return request(app)
      .post("/api/reviews/3/comments")
      .send(sendData)
      .expect(201);
  });
  test("Request Responds with the posted comment", () => {
    const sendData = {
      username: "mallionaire",
      body: "Laborum commodo magna ipsum eiusmod. Anim ad irure dolor do non ex quis dolore.",
    };
    return request(app)
      .post("/api/reviews/3/comments")
      .send(sendData)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toBeInstanceOf(Object);
        expect(comment.author).toEqual(sendData.username);
        expect(comment.body).toEqual(sendData.body);
      });
  });
  test("status 400: Bad request error when review_id invalid", () => {
    const sendData = {
      username: "mallionaire",
      body: "Laborum commodo magna ipsum eiusmod. Anim ad irure dolor do non ex quis dolore.",
    };
    return request(app)
      .post("/api/reviews/asd/comments")
      .send(sendData)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request: Invalid input");
      });
  });
  test("status 404: Not found error when review not found", () => {
    const sendData = {
      username: "mallionaire",
      body: "Laborum commodo magna ipsum eiusmod. Anim ad irure dolor do non ex quis dolore.",
    };
    return request(app)
      .post("/api/reviews/999999/comments")
      .send(sendData)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found: no reviews found");
      });
  });
});

describe("endpoint: delete '/api/comments/:comment_id'", () => {
  test("status 204: Should delete the given comment by `comment_id` and responds with no content", () => {
    return request(app)
      .delete("/api/comments/2")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
  test("status 204: Should delete the given comment by `comment_id` and responds with no content", () => {
    return request(app)
      .delete("/api/comments/999999")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
});

describe("endpoint: get '/api/users'", () => {
  test("status 200: Responds with an array of Users, each with a 'username'", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toBeInstanceOf(Array);
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
            })
          );
        });
      });
  });
});

describe("endpoint: get '/api/users/:username'", () => {
  test("status 200: Responds with a user object", () => {
    return request(app)
      .get("/api/users/philippaclaire9")
      .expect(200)
      .then(({ body }) => {
        const { user } = body;
        expect(user).toEqual(
          expect.objectContaining({
            username: "philippaclaire9",
            name: "philippa",
            avatar_url:
              "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
          })
        );
      });
  });
  test("status 404: Responds not found error when user not found", () => {
    return request(app)
      .get("/api/users/dsadsad")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found: no reviews found");
      });
  });
});