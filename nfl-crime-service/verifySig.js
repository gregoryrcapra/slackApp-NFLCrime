const crypto = require('crypto');
const config = require('./config');

var validate = (req) => {
  const signature = req.headers['x-slack-signature'];
  const timestamp = req.headers['x-slack-request-timestamp'];
  const hmac = crypto.createHmac('sha256', config.SLACK_SIGNING_SECRET);
  const [version, hash] = signature.split('=');

  // Check if the timestamp is older than five minutes -> replay attack
  const fiveMinutesAgo = ~~(Date.now() / 1000) - (60 * 5);
  if (timestamp < fiveMinutesAgo) return false;

  hmac.update(version + ':' + timestamp + ':' + req.rawBody);

  // make sure matches expected value
  return hmac.digest('hex') === hash;
};

module.exports.validate = validate;
