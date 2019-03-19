const knox = require('knox');
const jimp = require('jimp');
const moment = require('moment');
const Review = require('../models/review');
const Booking = require('../models/booking');
const config = require('../config/main');
const ObjectId = require('mongodb').ObjectId;
const _ = require('lodash');

const s3Client = knox.createClient({
  key: config.aws_key,
  secret: config.aws_secret,
  bucket: config.aws_bucket,
  endpoint: config.aws_endpoint,
  port: config.aws_port,
  secure: config.aws_secure,
  style: config.aws_style,
  region: config.aws_region
});

function pdfUploader(options, callback) {
  const buffer = new Buffer(options.data_uri.replace(/^data:application\/\w+;base64,/, ''), 'base64');

  uploadPDF(buffer);

  function uploadPDF(doc) {

    const FILE_LENGTH = doc.length;
    const FILE_NAME = options.filename.split(' ').join('-');
    const FILE_TYPE = options.filetype;

    const header = {
      'Content-Length': FILE_LENGTH,
      'Content-Type': FILE_TYPE,
      'x-amz-acl': 'public-read'
    };

    const req = s3Client.put(`/bookings/${options.bookingId}/`.concat(FILE_NAME), header);

    req.on('response', (res) => {
      if (res.statusCode === 200) {
        console.log('PDF saved on S3 to %s', req.url);
        callback(null, req.url);
      }
    });

    req.on('error', (error) => {
      console.log('Problem saving pdf to S3:', error.message);
      callback(error);
    });
    req.end(doc);
  }
}

function imageUploader(options, type, callback) {
  const buffer = new Buffer(options.data_uri.replace(/^data:image\/\w+;base64,/, ''), 'base64');

  jimp.read(buffer, onOpen);

  function onOpen(err, Img) {
    const PROFILE_WIDTH = 600;
    const PROFILE_HEIGHT = 600;
    const COVER_WIDTH = 1440;
    const COVER_HEIGHT = 960;
    const STANDARD_WIDTH = 1440;
    const STANDARD_HEIGHT = 960;

    if (err) {
      callback(err);
    }

    if (type && type === 'profile') {
      Img = Img.scaleToFit(PROFILE_WIDTH, PROFILE_HEIGHT);
    } else if (type && type === 'cover') {
      Img = Img.scaleToFit(COVER_WIDTH, COVER_HEIGHT);
    } else {
      Img = Img.scaleToFit(STANDARD_WIDTH, STANDARD_HEIGHT);
    }

    Img.getBuffer(jimp.MIME_JPEG, uploadImage.bind(callback));
  }

  // put to a path in our bucket, and make readable by the public
  function uploadImage(cb, img) {

    const FILE_LENGTH = img.length;
    const FILE_NAME = options.filename.split(' ').join('-');
    const FILE_TYPE = options.filetype;

    const header = {
      'Content-Length': FILE_LENGTH,
      'Content-Type': FILE_TYPE,
      'x-amz-acl': 'public-read'
    };

    const req = s3Client.put(`/images/users/${options.userId}/${type}/`.concat(FILE_NAME), header);

    req.on('response', (res) => {
      if (res.statusCode === 200) {
        console.log('Image saved on S3 to %s', req.url);
        callback(null, req.url);
      }
    });
    req.on('error', (error) => {
      console.log('Problem saving image to S3:', error.message);
      callback(error);
    });
    req.end(img);
  }
}

function deleteImage(fileName, callback) {
  s3Client.del(fileName)
    .on('response', (res) => {
      console.log('File deleted on S3 for filename: %s, status: %s', fileName, res.statusCode);
      callback();
    }).on('error', (error) => {
      console.log('Problem deleting file on S3: %s', error.message);
      callback(error);
    }).end();
}

function getChefRating(reviews) {
  const LENGTH = reviews.length;
  return (
    _(reviews).groupBy('chef')
      .map(obj => ({
        overall: parseFloat(_.sumBy(obj, 'overall') / LENGTH).toFixed(2),
        food: parseFloat(_.sumBy(obj, 'food') / LENGTH).toFixed(2),
        value: parseFloat(_.sumBy(obj, 'value') / LENGTH).toFixed(2),
        service: parseFloat(_.sumBy(obj, 'service') / LENGTH).toFixed(2),
        hygiene: parseFloat(_.sumBy(obj, 'hygiene') / LENGTH).toFixed(2),
      })
      )
      .value()[0]
  );
}

function getChefReviews(reviews) {
  return (reviews.map(obj => ({
    name: obj.user.firstName,
    description: obj.comment && obj.comment,
    date: obj.createdAt
  })
));
}

function getOverallRating(reviews) {
  let rating = 0;

  reviews.forEach((review) => {
    rating += review.overall;
  });

  return (rating / reviews.length);
}

function getChefsWithoutMonthlyBookings(chefs, cb) {
  const CHEFS_WITHOUT_BOOKINGS = [];
  const DATE_START = moment().startOf('month');
  function asyncLoop(i, callback) {
    if (i < chefs.length) {
      const chef = chefs[i];
      console.log('Checking for bookings for', chef.displayName);
      Booking
        .find({ $or: [{ user: chef.id }, { chef: chef.id }], updatedAt: { $gte: DATE_START } })
        .exec((err, bookings) => {
          if (err) {
            console.log('Error getting bookings', err);
            return err;
         }
         const ACCEPTED_BOOKINGS = bookings.filter(booking => booking.status === 'accepted');
          if (ACCEPTED_BOOKINGS.length === 0) {
            CHEFS_WITHOUT_BOOKINGS.push(chef);
            asyncLoop(i + 1, callback);
          } else {
            asyncLoop(i + 1, callback);
          }
        });
    } else {
      callback();
    }
  }
  return asyncLoop(0, () => {
    cb(CHEFS_WITHOUT_BOOKINGS);
  });
}

module.exports.imageUploader = imageUploader;
module.exports.deleteImage = deleteImage;
module.exports.getChefRating = getChefRating;
module.exports.getChefReviews = getChefReviews;
module.exports.getOverallRating = getOverallRating;
module.exports.getChefsWithoutMonthlyBookings = getChefsWithoutMonthlyBookings;
module.exports.pdfUploader = pdfUploader;