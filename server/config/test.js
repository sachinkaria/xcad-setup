/**
 * Created by sachinkaria on 05/05/2017.
 */
module.exports = {
  // Secret key for JWT signing and encryption
  jwt_secret: process.env.JWT_SECRET,
  // Database connection information
  database: process.env.DATABASE,
  // Server port
  port: process.env.PORT
};
