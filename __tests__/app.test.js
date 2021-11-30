const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("endpoint: '/api'", () => {
  test("status 200: responds with string 'All OK from API Router'", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ text }) => {
        expect(text).toBe("All OK from API Router");
      });
  });
});