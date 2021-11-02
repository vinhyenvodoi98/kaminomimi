const rulesURL = 'https://api.twitter.com/2/tweets/search/stream/rules';
const streamURL =
  'https://api.twitter.com/2/tweets/search/stream?tweet.fields=public_metrics&expansions=author_id';
const rules = [{ value: 'giveaway' }];

module.exports = {
  rulesURL,
  streamURL,
  rules,
};
