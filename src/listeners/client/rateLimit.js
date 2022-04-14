"use strict";

module.exports = async (client, rateLimitInfo) => {
  console.log(client.logger.redBright("[RATE LIMITED]"), `TIMEOUT: ${rateLimitInfo.timeout}`);
  console.log(client.logger.redBright("[RATE LIMITED]"), `LIMIT: ${rateLimitInfo.limit}`);
  console.log(client.logger.redBright("[RATE LIMITED]"), `METHOD: ${rateLimitInfo.method}`);
  console.log(client.logger.redBright("[RATE LIMITED]"), `PATH: ${rateLimitInfo.path}`);
  console.log(client.logger.redBright("[RATE LIMITED]"), `ROUTE: ${rateLimitInfo.route}`);
};
