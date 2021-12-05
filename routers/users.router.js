const {
  getUsers,
  getUserbyUsername,
} = require("../controllers/users.controller");

const usersRouter = require("express").Router();

usersRouter.route("/").get(getUsers);

usersRouter.route("/:username").get(getUserbyUsername);

module.exports = usersRouter;
