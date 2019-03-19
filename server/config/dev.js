/**
 * Created by sachinkaria on 05/05/2017.
 */
module.exports = {
  // Secret key for JWT signing and encryption
  jwt_secret: process.env.JWT_SECRET || '3456789pkjgfdfbnmgt7y89iuhgyr787iubh',
  // Database connection information
  database: process.env.DATABASE || 'mongodb://localhost/fullstack-boilerplate',
  // Server port
  port: process.env.PORT || 3000
};