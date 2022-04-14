"use strict";

module.exports = (client) => {
  const playerEvent = (event) => require(`../listeners/player/${event}`);

  client.player.on("botDisconnect", (m) => playerEvent("botDisconnect")(m, client));
  client.player.on("channelEmpty", (m) => playerEvent("channelEmpty")(m, client));
  client.player.on("error", (m, n) => playerEvent("error")(m, n, client));
  client.player.on("connectionError", (m, n) => playerEvent("connectionError")(m, n, client));
  client.player.on("trackStart", (m, n) => playerEvent("trackStart")(m, n, client));
  client.player.on("trackAdd", (m, n) => playerEvent("trackAdd")(m, n, client));
  client.player.on("queueEnd", (m, n) => playerEvent("queueEnd")(m, n, client));
};
