require("dotenv").config();

const allyInvestApi = require("ally-invest-api");

var configuration = {
  //   api_url: process.env.API_URL,
  consumerKey: process.env.CONSUMER_KEY,
  consumerSecret: process.env.CONSUMER_SECRET,
  oauthToken: process.env.OAUTH_TOKEN,
  oauthTokenSecret: process.env.OAUTH_TOKEN_SECRET,
};

const allyInvestClient = new allyInvestApi(configuration);

module.exports = { allyInvestClient };
