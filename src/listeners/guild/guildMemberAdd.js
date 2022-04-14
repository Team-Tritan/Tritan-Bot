"use strict";

const { MessageEmbed, WebhookClient } = require("discord.js"),
  mongoose = require("mongoose");

module.exports = async (client, member) => {
  await member.guild.members.fetch(member.id);

  const settings = await client.models.guild.findOne({
    guildID: member.guild.id
  });

  if (!settings.join_leave) {
    return;
  }

  /**if (Date.now() - member.user.createdAt < 1000 * 60 * 60 * 24 * 10) {
    const embed2 = new MessageEmbed()
      .setAuthor(member.user.tag, member.user.avatarURL())
      .setTitle("⚠️ User Warning")
      .setDescription(
        "`" + member.user.tag + "` has joined the server, but their account was made less than 10 days ago."
      )
      .addField(`Account Created:`, member.user.createdAt)
      .setColor("YELLOW")
      .setFooter("Member ID: " + member.user.id)
      .setTimestamp();

    const thisWebhook = await client.models.webhooks.findOne({
      guildID: settings.guildID,
      channelID: settings.join_leave
    });

    if (thisWebhook) {
      const webhookClient = new WebhookClient({id: thisWebhook.webhookID, token: thisWebhook.webhookSecret});

      try {
        return await webhookClient.send({
          username: "Tritan Bot",
          avatarURL: "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp",
          embeds: [embed2]
        });
      } catch {
        return;
      }
    }
  } else { */
  const embed = new MessageEmbed()
    .setAuthor(member.user.tag, member.user.avatarURL())
    .setDescription("`" + member.user.tag + "` has joined the server.")
    .setColor(client.config.embeds.embed_color)
    .setFooter("Member ID: " + member.user.id)
    .setTimestamp();

  const thisWebhook = await client.models.webhooks.findOne({
    guildID: settings.guildID,
    channelID: settings.join_leave
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
        channelID: settings.join_leave
      });
    }
  }
  //}
};
