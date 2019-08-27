'use strict';

const _ = require('lodash');
const mongoose = require('mongoose');

const User = mongoose.model('User');


const IMMUTABLE_FIELDS = [
  '_id',
  'roles',
  'messages',
  'password'
];

module.exports.updatePassword = updatePassword;
module.exports.getCurrentUser = getCurrentUser;
module.exports.update = update;

/**
 * Update user details
 */
function update (req, res) {
  // Init Variables
  let user = req.user;

  // In order to prevent a user from maliciously changing sensitive, permanent or verified data, we remove the following:
  IMMUTABLE_FIELDS.forEach((field) => {
    delete req.body[field];
  });

  if (!user) {
    return res.status(400).send({
      message: 'User is not signed in'
    });
  }

  // Update existing user
  user = _.extend(user, req.body);
  user.updated = Date.now();

  user.save()
    .then(() => req.login(user, onLogin), (err) => {
      return res.status(400).send({
        message: err
      });
    });

  function onLogin(err) {
    if (err) {
      return res.status(400).send({
        message: err
      });
    }
  }

  res.jsonp(user);
}

/**
 * Get current user details
 */
function getCurrentUser (req, res) {
  // Init Variables
  const user = req.user;


  if (!user) {
    return res.status(400).send({
      message: 'User is not signed in'
    });
  }
  res.jsonp(user);
}


/**
 * Update Password
 */
function updatePassword(req, res) {
  // Init Variables
  const passwordDetails = req.body;

  if (req.user) {
    if (passwordDetails.newPassword) {
      User.findById(req.user.id, (err, user) => {
        if (!err && user) {
          user.matchPassword(passwordDetails.currentPassword, (result) => {
            if (result && passwordDetails.newPassword === passwordDetails.verifyPassword) {
              user.password = passwordDetails.newPassword;
              user.save((error) => {
                if (error) {
                  return res.status(400).send({
                    message: error.message
                  });
                }
                res.send(user);
              });
            } else {
              res.status(400).send({
                message: 'Passwords do not match or your current password is incorrect'
              });
            }
          });
        } else {
          res.status(400).send({
            message: 'User is not found'
          });
        }
      });
    } else {
      res.status(400).send({
        message: 'Please provide a new password'
      });
    }
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
}
