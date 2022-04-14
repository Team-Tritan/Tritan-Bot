"use strict";

module.exports = async (client, info) => {
  console.log(client.logger.magenta("[Warning]"), info);
  client.sentry.captureException(info);
};
