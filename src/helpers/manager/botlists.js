"use strict";

const { topgg_token, ibl_token } = require("../../../config/tokens"),
  fetch = require("node-fetch"),
  { AutoPoster } = require("topgg-autoposter"),
  chalk = require("chalk");

module.exports = (manager) => {
  // Top.gg
  if (topgg_token) {
    const topggStats = AutoPoster(topgg_token, manager);
    topggStats.on("posted", () => {
      console.log(chalk.blue("[TOP.GG]"), `Successfully posted stats.`);
    });
  }

  // IBL
  setInterval(() => {
    const promises = [
      manager.fetchClientValues("guilds.cache.size"),
      manager.broadcastEval((c) => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0))
    ];
    return Promise.all(promises).then((results) => {
      const totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
      const body = { servers: totalGuilds, shards: manager.totalShards };

      fetch(`https://api.infinitybotlist.com/bot/732783297872003114`, {
        method: "post",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          authorization: ibl_token
        }
      })
        .then((res) => res.json())
        .then((json) => console.log(json));
      console.log(chalk.blue("[IBL]"), `Successfully posted stats.`);
    });
  }, 60 * 60000);
};
