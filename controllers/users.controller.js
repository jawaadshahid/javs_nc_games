const { selectUsersUsernames } = require("../models/user.model");

exports.getUsers = (req, res, next) => {
  selectUsersUsernames().then((users) => {
    res.status(200).send({ users });
  });
};
