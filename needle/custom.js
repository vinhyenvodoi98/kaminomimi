const { rulesURL, streamURL, rules } = require('../constant/twitterUri');
require('dotenv').config();
const TOKEN = process.env.TWITTER_BEARER_TOKEN;
const needle = require('needle');

// Get stream rules
async function getRules() {
  const response = await needle('get', rulesURL, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  console.log(response.body);
  return response.body;
}

// Set stream rules
async function setRules() {
  const data = {
    add: rules,
  };

  const response = await needle('post', rulesURL, data, {
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  return response.body;
}

async function deleteRules(rules) {
  if (!Array.isArray(rules.data)) {
    return null;
  }

  const ids = rules.data.map((rule) => rule.id);

  const data = {
    delete: {
      ids: ids,
    },
  };

  const response = await needle('post', rulesURL, data, {
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  return response.body;
}

function streamTweets(socket) {
  const stream = needle.get(streamURL, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  stream.on('data', (data) => {
    try {
      const json = JSON.parse(data);
      socket.emit('tweet', json);
    } catch (error) {}
  });

  return stream;
}

module.exports = {
  getRules,
  setRules,
  deleteRules,
  streamTweets,
};
