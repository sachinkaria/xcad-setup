const AuthenticationController = require('../controllers/authentication'),
  User = require('../controllers/user'),
  express = require('express'),
  passportService = require('../config/passport'),
  passport = require('passport');

// Middleware to require login/auth
const requireAuth = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', { session: false });


module.exports = function (app) {
  // Registration route
  app.post('/api/users/create', AuthenticationController.register);

  // Login route
  app.post('/api/users/login', requireLogin, AuthenticationController.login);

  // Update route
  app.put('/api/users', requireAuth, User.update);
  app.put('/api/users/password', requireAuth, User.updatePassword);

  // Upload photos
  app.post('/api/users/photos', requireAuth, User.uploadPhoto);
  app.post('/api/users/photos/profile', requireAuth, User.uploadProfilePhoto);
  app.post('/api/users/photos/cover', requireAuth, User.uploadCoverPhoto);

  // Delete photos
  app.delete('/api/users/photo/profile', requireAuth, User.deleteProfilePhoto);
  app.delete('/api/users/photo/cover', requireAuth, User.deleteCoverPhoto);
  app.delete('/api/users/photos/:id', requireAuth, User.deletePhoto);

  // Password reset routes
  app.post('/api/forgot', AuthenticationController.forgotPassword);
  app.post('/api/reset/:token', AuthenticationController.changePassword);

  // Get profile route
  app.get('/api/users/me', requireAuth, User.getCurrentUser);

  // Connect instagram
  app.get('/api/users/me/instagram/handleAuth', requireAuth, User.instagramAuth);
};