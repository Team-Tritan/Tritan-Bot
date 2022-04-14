"use strict";

const { MessageEmbed, WebhookClient } = require(`discord.js`),
  mongoose = require("mongoose");

module.exports = async (client, guild, user) => {
  const settings = await client.models.guild.findOne({
    guildID: guild.id
  });

  if (!settings.event_logs) {
    return;
  }

  await guild.members.fetch(user.id);

  let embed = new MessageEmbed()
    .setAuthor(`Tritan Bot`, "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp")
    .setTitle(`${client.config.helpers.ban} Member Banned`)
    .setColor(client.config.embeds.embed_color)
    .setDescription(`**${user.tag}** \`(${user.id})\` has been banned.`)
    .setTimestamp()
    .setFooter(`${guild.name}`, guild.iconURL());

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
        embeds: [embed]
      });
    } catch {
      return await client.models.webhooks.findOneAndDelete({
        guildID: settings.guildID,
        channelID: settings.event_logs
      });
    }
  }
};
