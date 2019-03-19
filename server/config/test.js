/**
 * Created by sachinkaria on 05/05/2017.
 */
module.exports = {
  // Secret key for JWT signing and encryption
  jwt_secret: process.env.JWT_SECRET,
  // Database connection information
  database: process.env.DATABASE,
  // Server port
  port: process.env.PORT,
  aws_key: process.env.AWS_KEY,
  aws_secret: process.env.AWS_SECRET,
  aws_bucket: process.env.AWS_BUCKET,
  aws_endpoint: process.env.AWS_ENDPOINT,
  aws_port: process.env.AWS_PORT
};