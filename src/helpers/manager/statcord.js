"use strict";

const chalk = require("chalk"),
  Statcord = require("statcord.js"),
  { statcord_token } = require("../../../config/tokens");

module.exports = (manager) => {
  const statcord = new Statcord.ShardingClient({
    key: statcord_token,
    manager: manager,
    postCpuStatistics: true,
    postMemStatistics: true,
    postNetworkStatistics: true,
    autopost: true
  });

  statcord
    .on("autopost-start", () => {
      console.log(chalk.magenta("[Statcord]"), `Started Autopost`);
    })
    .on("post", () => {
      console.log(chalk.magenta("[Statcord]"), `Successfully posted stats.`);
    });
};
