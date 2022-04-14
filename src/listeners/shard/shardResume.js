"use strict";

const { MessageEmbed, WebhookClient } = require("discord.js");

module.exports = async (client, id, replayedEvents) => {
  console.log(client.logger.yellowBright("[SHARD RESUMED]"), `Shard ${id} has resumed.`);

  let reconnectEmbed = new MessageEmbed()
    .setTitle(`🟢 **Shard ${id}** has resumed.`)
    .addField("Replayed Events:", replayedEvents.toString())
    .setColor(client.config.embeds.embed_color)
    .setTimestamp();

  const webhookClient = new WebhookClient({
    id: client.config.webhooks.CONTROL_CHANNEL_WEBHOOK_ID,
    token: client.config.webhooks.CONTROL_CHANNEL_WEBHOOK_SECRET
  });

  await webhookClient.send({
    username: "Shard Manager",
    avatarURL: "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp",
    embeds: [reconnectEmbed]
  });
};
