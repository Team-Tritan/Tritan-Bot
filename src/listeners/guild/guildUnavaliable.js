"use strict";

const { MessageEmbed, WebhookClient } = require("discord.js"),
  chalk = require("chalk");

module.exports = async (client, guild) => {
  console.log(client.logger.yellowBright("[GUILD UNAVAILABLE]"), `${guild.name} (ID: ${guild.id})`);
  let reconnectEmbed = new MessageEmbed()
    .setAuthor(`Tritan Bot`, "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp")
    .setTitle(`👻 Guild Unavaliable`)
    .addField("Guild Name:", guild.name)
    .addField("Guild ID", guild.id)
    .setColor(client.config.embeds.embed_color)
    .setTimestamp();

  const webhookClient = new WebhookClient({
    id: client.config.webhooks.ERROR_CHANNEL_WEBHOOK_ID,
    token: client.config.webhooks.ERROR_CHANNEL_WEBHOOK_SECRET
  });

  await webhookClient.send({
    username: "Tritan Errors",
    avatarURL: "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp",
    embeds: [reconnectEmbed]
  });
};
