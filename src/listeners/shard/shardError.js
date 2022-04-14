"use strict";

const { MessageEmbed, WebhookClient } = require("discord.js");

module.exports = async (client, shardId, error) => {
  console.log(client.logger.yellowBright("[SHARD ERROR]"), `Shard ${shardId}: ${error}`);
  client.sentry.captureException(error.toString());

  let reconnectEmbed = new MessageEmbed()
    .setTitle(`🟡 **Shard ${shardId}** Error:`)
    .addField("Shard ID:", shardId.toString())
    .addField("Error", error.toString())
    .setColor(client.config.embeds.embed_color)
    .setTimestamp();

  const webhookClient = new WebhookClient({
    id: client.config.webhooks.ERROR_CHANNEL_WEBHOOK_ID,
    token: client.config.webhooks.ERROR_CHANNEL_WEBHOOK_SECRET
  });

  await webhookClient.send({
    username: "Shard Manager",
    avatarURL: "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp",
    embeds: [reconnectEmbed]
  });
};
