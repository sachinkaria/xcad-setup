'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Booking = require('./booking');
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const moment = require('moment');


const UserSchema = new Schema({
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    role: {
      type: String,
      enum: ['member', 'chef', 'admin'],
      default: 'member'
    },
    profilePhoto: {
      type: String
    },

    photos: [{
      src: {
        type: String
      }
    }],
    termsAccepted: Boolean,
    resetPasswordToken: {type: String},
    resetPasswordExpires: {type: Date}
  },
  {
    timestamps: true,
    toObject: { virtuals: true, getters: true },
    toJSON: { virtuals: true, getters: true }
  });

// Pre-save of user to database, hash password if password is modified or new
UserSchema.pre('save', function (next) {
  const user = this,
    SALT_FACTOR = 5;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

/**
 * Compare password for login
 */
UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) {
      return cb(err);
    }

    cb(null, isMatch);
  });
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.matchPassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) {
      cb(err);
    }
    cb(isMatch);
  });
};

module.exports = mongoose.model('User', UserSchema);