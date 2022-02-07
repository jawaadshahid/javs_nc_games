# Feedback - Jawaad

A really nice API here! My main gripe is that you are over thinking your error handling. You do not nexxd to check where the review exists before you post a comment. To me this suggests that you're not making use of TDD. If had attempted to post in your test you'd get an error coming back from postgres which you could go ahead and translate into a response.

## Readme - Remove the one that was provided and write your own:

- _readme not written yet_
- [ ] Link to hosted version
- [ ] Write a summary of what the project is
- [ ] Provide clear instructions of how to clone, install dependencies, seed local database, and run tests
- [ ] Include information about how to create `.env.test` and `.env.development` files
- [ ] Specify minimum versions of `Node.js` and `Postgres` needed to run the project

## General

- [ ] Remove any unnecessary `console.logs` and comments
- [ ] Remove all unnecessary files (e.g. old `README.md`, `error-handling.md`, `hosting.md`, `./db/utils/README.md` etc.)
- [✓] Functions and variables have descriptive names

## Creating tables

- [ ] Use `NOT NULL` on required fields - _missing a few_
- [✓] Default `created_at` in reviews and comments tables to the current date:`TIMESTAMP DEFAULT NOW()`

## Inserting data

- [✓] Drop tables and create tables in seed function in correct order
- [✓] Make use of pg-format to insert data in the correct order

## Tests

- [✓] Seeding before each test
- [✓] Descriptive `it`/`test` block descriptions
- [✓] If asserting inside a `forEach`, also has an assertion to check length is at least > 0
- [✓] Evidence of building up complex query endpoints using TDD
- [✓] Ensure all tests are passing
- [ ] Cover all endpoints and errors

- `GET /api/categories`

  - [✓] Status 200, array of category objects

- `GET /api/reviews/:review_id`

  - [✓] Status 200, single review object (including `comment_count`)
  - [✓] Status 400, invalid ID, e.g. string of "not-an-id"
  - [✓] Status 404, non existent ID, e.g. 0 or 9999

- `PATCH /api/reviews/:review_id`

  - [✓] Status 200, updated single review object
  - [✓] Status 400, invalid ID, e.g. string of "not-an-id"
  - [ ] Status 400, invalid inc_votes type, e.g. property is not a number
  - [✓] Status 404, non existent ID, e.g. 0 or 9999
  - [ ] Status 200, missing `inc_votes` key. No effect to article.

- `GET /api/reviews`

  - [✓] Status 200, array of review objects (including `comment_count`, excluding `body`)
  - [✓] Status 200, default sort & order: `created_at`, `desc`
  - [✓] Status 200, accepts `sort_by` query, e.g. `?sort_by=votes`
  - [✓] Status 200, accepts `order` query, e.g. `?order=desc`
  - [✓] Status 200, accepts `category` query, e.g. `?category=dexterity`
  - [✓] Status 400. invalid `sort_by` query, e.g. `?sort_by=bananas`
  - [✓] Status 400. invalid `order` query, e.g. `?order=bananas`
  - [✓] Status 404. non-existent `category` query, e.g. `?category=bananas`
  - [✓] Status 200. valid `category` query, but has no reviews responds with an empty array of reviews, e.g. `?category=children's games`

- `GET /api/reviews/:review_id/comments`

  - [✓] Status 200, array of comment objects for the specified review
  - [✓] Status 400, invalid ID, e.g. string of "not-an-id"
  - [✓] Status 404, non existent ID, e.g. 0 or 9999
  - [ ] Status 200, valid ID, but has no comments responds with an empty array of comments

- `POST /api/reviews/:review_id/comments`

  - [✓] Status 201, created comment object
  - [✓] Status 400, invalid ID, e.g. string of "not-an-id"
  - [✓] Status 404, non existent ID, e.g. 0 or 9999
  - [ ] Status 400, missing required field(s), e.g. no username or body properties
  - [ ] Status 404, username does not exist
  - [✓] Status 201, ignores unnecessary properties

- `DELETE /api/comments/:comment_id`

  - [✓] Status 204, deletes comment from database
  - [✓] Status 404, non existent ID, e.g 999
  - [✓] Status 400, invalid ID, e.g "not-an-id"

- `GET /api`

  - [✓] Status 200, JSON describing all the available endpoints

## Routing

- [✓] Split into api, categories, users, comments and reviews routers
- [✓] Use `.route` for endpoints that share the same path

## Controllers

- [✓] Name functions and variables well
- [✓] Add catch blocks to all model invocations (and don't mix use of`.catch(next);` and `.catch(err => next(err))`)

## Models

- [✓] Protected from SQL injection using parameterized queries for values in `db.query` e.g `$1` and array of variables
- [✓] Sanitizing any data for tables/columns, e.g. greenlisting when using template literals or pg-format's `%s`
- [✓] Consistently use either single object argument _**or**_ multiple arguments in model functions
- [✓] Use `LEFT JOIN` for comment counts

## Errors

- [ ] Use error handling middleware functions in app and extracted to separate directory/file
- [ ] Consistently use `Promise.reject` in either models _**OR**_ controllers

## Extra Tasks - To be completed after hosting

- `GET /api/users`

  - [ ] Status 200, responds with array of user objects

- `GET /api/users/:username`

  - [ ] Status 200, responds with single user object
  - [ ] Status 404, non existent ID, e.g 999
  - [ ] Status 400, invalid ID, e.g "not-an-id"

- `PATCH /api/comments/:comment_id`

  - [ ] Status 200, updated single comment object
  - [ ] Status 400, invalid ID, e.g. string of "not-an-id"
  - [ ] Status 400, invalid inc_votes type, e.g. property is not a number
  - [ ] Status 404, non existent ID, e.g. 0 or 9999
  - [ ] Status 200, missing `inc_votes` key. No effect to comment.

## Extra Advanced Tasks

### Easier

- [ ] Patch: Edit an review body
- [ ] Patch: Edit a comment body
- [ ] Patch: Edit a user's information
- [ ] Get: Search for an review by title
- [ ] Post: add a new user

### Harder

- [ ] Protect your endpoints with JWT authorization. We have notes on this that will help a bit, _but it will make building the front end of your site a little bit more difficult_
- [ ] Get: Add functionality to get reviews created in last 10 minutes
- [ ] Get: Get all reviews that have been liked by a user. This will require an additional junction table.
- [ ] Research and implement online image storage or random generation of images for categories

## Test Output

Read through all errors. Note that any failing test could be caused by a problem uncovered in a previous test on the same endpoint.

### ESSENTIAL PATCH `/api/reviews/1`

Assertion: expected 422 to equal 200

Hints:

- ignore a `patch` request with no information in the request body, and send the unchanged review to the client

### ESSENTIAL PATCH `/api/reviews/1`

Assertion: expected 422 to equal 400

Hints:

- use a 400: Bad Request status code when sent an invalid `inc_votes` value

### ESSENTIAL GET `/api/reviews/1/comments`

Assertion: expected 404 to equal 200

Hints:

- return 200: OK when the article exists
- serve an empty array when the article exists but has no comments

### ESSENTIAL POST `/api/reviews/1/comments`

Assertion: expected 201 to equal 400

Hints:

- use a 400: Bad Request status code when `POST` request does not include all the required keys

error: insert or update on table "comments" violates foreign key constraint "comments_author_fkey"
at Parser.parseErrorMessage (/Users/davidbartlett/Classroom/JS/Backend/reviews/team-be-review-runner/evaluations/jawaad/node_modules/pg-protocol/dist/parser.js:287:98)
at Parser.handlePacket (/Users/davidbartlett/Classroom/JS/Backend/reviews/team-be-review-runner/evaluations/jawaad/node_modules/pg-protocol/dist/parser.js:126:29)
at Parser.parse (/Users/davidbartlett/Classroom/JS/Backend/reviews/team-be-review-runner/evaluations/jawaad/node_modules/pg-protocol/dist/parser.js:39:38)
at Socket.<anonymous> (/Users/davidbartlett/Classroom/JS/Backend/reviews/team-be-review-runner/evaluations/jawaad/node_modules/pg-protocol/dist/index.js:11:42)
at Socket.emit (node:events:390:28)
at addChunk (node:internal/streams/readable:315:12)
at readableAddChunk (node:internal/streams/readable:289:9)
at Socket.Readable.push (node:internal/streams/readable:228:10)
at TCP.onStreamRead (node:internal/stream_base_commons:199:23) {
length: 268,
severity: 'ERROR',
code: '23503',
detail: 'Key (author)=(definitelynotauser) is not present in table "users".',
hint: undefined,
position: undefined,
internalPosition: undefined,
internalQuery: undefined,
where: undefined,
schema: 'public',
table: 'comments',
column: undefined,
dataType: undefined,
constraint: 'comments_author_fkey',
file: 'ri_triggers.c',
line: '2539',
routine: 'ri_ReportViolation'
}

### ESSENTIAL POST `/api/reviews/1/comments`

Assertion: expected 500 to be one of [ 404, 422 ]

Hints:

- use a 404: Not Found _OR_ 422: Unprocessable Entity status code when `POST` contains a valid username that does not exist

### FURTHER DELETE `/api/comments/1000`

Assertion: expected 204 to equal 404

Hints:

- use a 404: Not Found when `DELETE` contains a valid comment_id that does not exist

### FURTHER PATCH `/api/comments/1`

Assertion: expected 404 to equal 200

Hints:

- use a 200: OK status code for successful `patch` requests

### FURTHER PATCH `/api/comments/1`

Assertion: expected {} to contain key 'comment'

Hints:

- send the updated comment back to the client in an object, with a key of comment: `{ comment: {} }`

### FURTHER PATCH `/api/comments/1`

Assertion: Cannot read properties of undefined (reading 'votes')

Hints:

- increment the `votes` of the specified article

### FURTHER PATCH `/api/comments/1`

Assertion: Cannot read properties of undefined (reading 'votes')

Hints:

- decrement the `votes` of the specified article

### FURTHER PATCH `/api/comments/1`

Assertion: expected 404 to equal 400

Hints:

- use a 400: Bad Request status code when sent an invalid `inc_votes` value

### FURTHER PATCH `/api/comments/1`

Assertion: expected 404 to equal 200

Hints:

- use 200: OK status code when sent a body with no `inc_votes` property
- send an unchanged comment when no `inc_votes` is provided in the request body

### FURTHER PATCH `/api/comments/not-a-valid-id`

Assertion: expected 404 to equal 400

Hints:

- use a 400: Bad Request when `PATCH` contains an invalid comment_id

### FURTHER PATCH `/api/comments/1`

Assertion: expected 404 to equal 400

Hints:

- use a 400: Bad Request status code when sent an invalid `inc_votes` value