"use strict";

const { MessageEmbed, WebhookClient } = require("discord.js");

module.exports = async (client, id) => {
  console.log(client.logger.greenBright("[Shard Ready]"), `Shard ${id} is ready.`);

  let reconnectEmbed = new MessageEmbed()
    .setTitle(`🟢 **Shard ${id}** Ready!`)
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
