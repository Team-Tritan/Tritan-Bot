"use strict";

const { MessageEmbed, WebhookClient } = require("discord.js");

module.exports = (process, client) => {
  process.on("unhandledRejection", (error) => {
    const webhookClient = new WebhookClient({
      id: client.config.webhooks.ERROR_CHANNEL_WEBHOOK_ID,
      token: client.config.webhooks.ERROR_CHANNEL_WEBHOOK_SECRET
    });

    client.sentry.captureException(error);
    console.error(client.logger.red("[Unhandled Rejection]"), error);

    const embed = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp")
      .setTitle("Unhandled Promise Rejection:")
      .setColor("#FF0000")
      .setTimestamp()
      .addFields(
        {
          name: "Name",
          value: error.name,
          inline: true
        },
        {
          name: "Error Message",
          value: error.message
        }
      );

    webhookClient
      .send({
        username: "Tritan Errors",
        avatarURL: "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp",
        embeds: [embed]
      })
      .catch(console.error);
  });
};
