const {
  selectUsersUsernames,
  selectUserByUsername,
} = require("../models/user.model");

exports.getUsers = (req, res, next) => {
  selectUsersUsernames()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.getUserbyUsername = (req, res, next) => {
  const { username } = req.params;
  selectUserByUsername(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};
