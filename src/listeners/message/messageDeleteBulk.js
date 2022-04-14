"use strict";

const { MessageEmbed, WebhookClient, MessageAttachment } = require("discord.js"),
  mongoose = require("mongoose"),
  fs = require("fs");

module.exports = async (client, messages) => {
  const channel = messages.first().channel;

  await channel.guild.members.fetch();

  const settings = await client.models.guild.findOne({
    guildID: messages.first().guild.id
  });
  if (!settings.event_logs) {
    return;
  }

  var file = fs.createWriteStream("./tmp/bulk-delete.txt");
  file.on("error", function (err) {
    console.log(err);
  });
  messages.forEach((message) =>
    file.write(`[${message.createdAt}] (${message.author.tag} ${message.author.id}): ${message.content}\r\n`)
  );
  file.end();

  const finished_file = new MessageAttachment("./tmp/bulk-delete.txt");

  let embed = new MessageEmbed()
    .setAuthor("Tritan Bot", "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp")
    .setDescription(
      `${messages.size} messages have been bulk deleted in #${channel.name} \`(${channel.id})\`).`
    )
    .setColor(client.config.embeds.embed_color)
    .setTimestamp();

  const thisWebhook = await client.models.webhooks.findOne({
    guildID: settings.guildID,
    channelID: settings.event_logs
  });

  if (thisWebhook) {
    const webhookClient = new WebhookClient({ id: thisWebhook.webhookID, token: thisWebhook.webhookSecret });

    try {
      return await webhookClient.send({
        username: "Tritan Bot",
        avatarURL: "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp",
        embeds: [embed],
        files: [finished_file]
      });
    } catch {
      return await client.models.webhooks.findOneAndDelete({
        guildID: settings.guildID,
        channelID: settings.event_logs
      });
    }
  }
};
