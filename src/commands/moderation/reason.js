"use strict";

const { MessageEmbed, Permissions } = require(`discord.js`),
  mongoose = require("mongoose");

module.exports = {
  name: `reason`,
  description: `Change the reason for an infraction`,
  usage: "(Prefix)reason <infraction id> <Reason>",
  category: "Moderation",
  async execute(message, args) {
    if (!message.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
      return message
        .reply("You don't have enough permission to update this infraction.")
        .then((m) => setTimeout(() => m.delete(), 10000));
    }

    const infID = args[0];
    const newReason = args.slice(1).join(" ") || "No reason provided.";

    if (!infID) {
      return message.channel
        .send(`${message.client.config.helpers.error_x} You need to specify the infraction ID.`)
        .then((m) => setTimeout(() => m.delete(), 10000));
    }

    const infractionToUpdate = message.client.models.infractions.findOne({ _id: infID });
    const settings = await message.client.models.guild.findOne({ guildID: message.guild.id });
    try {
      infractionToUpdate.updateOne({ Reason: newReason }).then((i) => {
        console.log(i);
      });
    } catch (error) {
      const success = new MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setTitle(`${message.client.config.helpers.error_x} Failed to update reason, please try again later.`)
        .addField("Error", error)
        .setColor(message.client.config.embeds.embed_color)
        .setTimestamp()
        .setFooter(`Updated by ${message.author.tag}`, message.author.displayAvatarURL());
      return message.channel.send({ embeds: [success] });
    }

    const success = new MessageEmbed()
      .setAuthor({
        name: `${message.client.config.embeds.authorName}`,
        iconURL: `${message.client.config.embeds.authorIcon}`
      })
      .setTitle("Update Infraction Reason")
      .setDescription(
        `${message.author.tag} \`(${message.author.id})\` has updated the reason for infraction \`${infID}\` to \`${newReason}\``
      )
      .setColor(message.client.config.embeds.embed_color)
      .setTimestamp()
      .setFooter(`Updated by ${message.author.tag}`, message.author.displayAvatarURL());
    await message.channel.send({ embeds: [success] });

    if (settings.event_logs) {
      const log_channel = await message.client.channels.fetch(settings.event_logs);
      log_channel.send({ embeds: [success] });
    }
  }
};
