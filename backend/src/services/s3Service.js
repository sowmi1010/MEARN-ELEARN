const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  signatureVersion: 'v4'
});

// Generate signed GET URL
async function getSignedUrl(key, expires = 300) {
  const params = { Bucket: process.env.S3_BUCKET, Key: key, Expires: expires };
  return s3.getSignedUrlPromise('getObject', params);
}

module.exports = { getSignedUrl };
