"use strict";

const { ShardingManager, MessageEmbed, WebhookClient } = require("discord.js"),
  { CONTROL_CHANNEL_WEBHOOK_ID, CONTROL_CHANNEL_WEBHOOK_SECRET } = require("../config/webhooks"),
  { token } = require("../config/tokens"),
  { embed_color } = require("../config/embeds"),
  { shard_count, shard_list } = require("../config/helpers"),
  chalk = require("chalk"),
  api = require("./helpers/manager/api"),
  statcord = require("./helpers/manager/statcord"),
  newRelic = require("newrelic"),
  botlists = require("./helpers/manager/botlists");

let webhookClient = new WebhookClient({
  id: CONTROL_CHANNEL_WEBHOOK_ID,
  token: CONTROL_CHANNEL_WEBHOOK_SECRET
});

let manager = new ShardingManager("./index.js", {
  token: token,
  autoSpawn: true,
  totalShards: shard_count,
  shardList: shard_list,
  respawn: true,
  timeout: 999999,
  execArgv: ["--trace-warnings"],
  shardArgs: ["--ansi", "--color"]
});

manager.on("shardCreate", async (manager) => {
  console.log(chalk.yellowBright("[SHARD LAUNCHED]"), `Shard ${manager.id} has launched.`);

  let reconnectEmbed = new MessageEmbed()
    .setTitle(`🔵 **Shard ${manager.id}** has launched.`)
    .setColor(embed_color)
    .setTimestamp();

  await webhookClient.send({
    username: "Shard Manager",
    avatarURL: "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp",
    embeds: [reconnectEmbed]
  });
});

manager.on("message", async (manager, message) => {
  console.log(chalk.yellowBright(`[SHARD ${manager.id}]`), `${message._eval} : ${message._result}`);

  let reconnectEmbed = new MessageEmbed()
    .setTitle(`🟢 **Shard ${manager.id}** has sent a message.`)
    .addField(`Message Eval`, message._eval, true)
    .addField(`Message Result`, message._result, true)
    .setColor(embed_color)
    .setTimestamp();

  await webhookClient.send({
    username: "Shard Manager",
    avatarURL: "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp",
    embeds: [reconnectEmbed]
  });
});

api(manager);
statcord(manager);
botlists(manager);

manager.spawn();
