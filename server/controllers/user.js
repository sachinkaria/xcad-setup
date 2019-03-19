'use strict';

/**
 * Module dependencies.
 */
const _ = require('lodash');
const mongoose = require('mongoose');
const request = require('superagent');

const User = mongoose.model('User');

const utils = require('./utils');
const config = require('../config/main');

const IMMUTABLE_FIELDS = [
  '_id',
  'roles',
  'messages',
  'password'
];

module.exports.uploadProfilePhoto = uploadProfilePhoto;
module.exports.deleteProfilePhoto = deleteProfilePhoto;
module.exports.updatePassword = updatePassword;
module.exports.uploadPhoto = uploadPhoto;
module.exports.deletePhoto = deletePhoto;
module.exports.instagramAuth = instagramAuth;

/**
 * Update user details
 */
exports.update = function (req, res) {
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
};

/**
 * Get current user details
 */
exports.getCurrentUser = function (req, res) {
  // Init Variables
  const user = req.user;


  if (!user) {
    return res.status(400).send({
      message: 'User is not signed in'
    });
  }
  res.jsonp(user);
};

/**
 * Upload photo
 */
function uploadPhoto(req, res) {
  utils.imageUploader({
    data_uri: req.body.data_uri,
    filename: req.body.filename,
    filetype: req.body.filetype,
    userId: req.user._id
  }, 'photos', (error, response) => {
    if (error) {
      return res.status(400).send({
        message: error.message
      });
    }

    const user = req.user;
    user.photos.push({ src: response });

    user.save();
    res.jsonp(user);
  });
}

/**
 * Upload profile picture
 */
function uploadProfilePhoto(req, res) {
  utils.imageUploader({
    data_uri: req.body.data_uri,
    filename: req.body.filename,
    filetype: req.body.filetype,
    userId: req.user._id
  }, 'profile', (error, response) => {
    if (error) {
      return res.status(400).send({
        message: error.message
      });
    }

    let user = req.user;
    user = _.extend(user, { profilePhoto: response });

    user.save();
    res.jsonp(user);
  });
}

/**
 * Delete picture
 */
function deletePhoto(req, res) {
  const PHOTO_ID = req.params.id;
  const USER = req.user;
  const PHOTO = _.filter(USER.photos, object => object._id.toString() === PHOTO_ID)[0];
  const PHOTO_INDEX = USER.photos.indexOf(PHOTO);
  const URL_PARTS = PHOTO.src.split('/');
  const IMAGE_FILENAME = `/images/users/${USER.id}/photos/${URL_PARTS[URL_PARTS.length - 1]}`;

  utils.deleteImage(IMAGE_FILENAME, (err) => {
    if (err) {
      return res.status(400).send({
        message: err.message
      });
    }

    USER.photos.splice(PHOTO_INDEX, 1);
    USER.save();
    res.jsonp(USER);
  });
}


/**
 * Delete profile picture
 */
function deleteProfilePhoto(req, res) {
  const USER = req.user;
  const URL_PARTS = USER.profilePhoto.split('/');
  const IMAGE_FILENAME = `/images/users/${USER.id}/profile/${URL_PARTS[URL_PARTS.length - 1]}`;

  utils.deleteImage(IMAGE_FILENAME, (err) => {
    if (err) {
      return res.status(400).send({
        message: err.message
      });
    }
    let user = req.user;
    user = _.extend(user, { profilePhoto: undefined });
    user.save();
    res.jsonp(user);
  });
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

function instagramAuth(req, res) {
  const user = req.user;
  console.log('Authenticating Instagram Account');
  if (req.query && req.query.code) {
    const CODE = req.query.code;
    request
      .post('https://api.instagram.com/oauth/access_token')
      .type('form')
      .send({
        client_id: config.INSTAGRAM_CLIENT_ID,
        client_secret: config.INSTAGRAM_CLIENT_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: config.INSTAGRAM_REDIRECT_URI,
        code: CODE
      })
      .then((response) => {
        user.social.instagram.accessToken = response.body.access_token;
        user.social.instagram.userName = response.body.user.username;
        user.save();
        res.send(user);
      })
      .catch((err) => {
        console.log(err);
        return err;
      });
  }
}

