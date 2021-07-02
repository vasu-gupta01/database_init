const db = require("../models");
const Approvers = db.approverModels.Approvers;
const Roles = db.approverModels.Roles;

var bcrypt = require("bcryptjs");

checkDuplicateUsername = (req) => {
  Approvers.findOne({
    username: req.username,
  }).exec((err, approver) => {
    if (err) {
      return false;
    }

    if (approver) {
      return true;
    } else {
      return false;
    }
  });
};

exports.signup = async (req) => {
  try {
    const approver = new Approvers({
      username: req.username,
      firstname: req.firstname,
      lastname: req.lastname,
      role: req.role,
      password: bcrypt.hashSync(req.password, 8),
    });

    if (checkDuplicateUsername(req) == false) {
      await approver.save((err, approver) => {
        if (err) {
          throw err;
        } else {
          return true;
        }
      });
    } else {
      console.log("Mod already exists");
      return false;
    }
  } catch (e) {
    throw e;
  }
};
