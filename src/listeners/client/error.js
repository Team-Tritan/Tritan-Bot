"use strict";

const { MessageEmbed, WebhookClient } = require("discord.js");

module.exports = async (client, error) => {
  console.log(client.logger.yellowBright("[ERROR]"), `${error}`);
  client.sentry.captureException(error);

  let embed = new MessageEmbed()
    .setTitle(`⚠️ Error:`)
    .addField("Error", error)
    .setColor(client.config.colors.EMBED_RATELIMIT_COLOR)
    .setTimestamp();

  const webhookClient = new WebhookClient({
    id: client.config.webhooks.ERROR_CHANNEL_WEBHOOK_ID,
    token: client.config.webhooks.ERROR_CHANNEL_WEBHOOK_SECRET
  });

  await webhookClient.send({
    username: "Tritan Errors",
    avatarURL: "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp",
    embeds: [embed]
  });
};
