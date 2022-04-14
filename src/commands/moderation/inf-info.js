"use strict";

const { MessageEmbed, Permissions } = require("discord.js");

module.exports = {
  name: "inf-info",
  description: "Get info about a specific infraction by ID.",
  usage: "(Prefix)inf-info <infraction id>",
  category: "Moderation",
  async execute(message, args) {
    if (!message.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
      return message
        .reply("You don't have enough permission to view this member's infractions.")
        .then((m) => setTimeout(() => m.delete(), 10000));
    }
    let target = args[0];
    if (!target)
      return message
        .reply("You need to send an infraction ID for me to send back information.")
        .then((m) => setTimeout(() => m.delete(), 10000));

    let warning = await message.client.models.infractions.findOne({ _id: target });
    if (warning.length == 0)
      return message.channel
        .send("There are no infractions for this user.")
        .then((m) => setTimeout(() => m.delete(), 10000));

    const embed = new MessageEmbed();
    embed.setAuthor(
      `${message.client.config.embeds.authorName}`,
      `${message.client.config.embeds.authorIcon}`
    );
    embed.setTitle(`Infraction Info`);
    embed.setTimestamp();
    embed.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
    embed.setColor(message.client.config.embeds.embed_color);
    embed.setThumbnail(message.guild.iconURL({ dynamic: true }));
    embed.addField("ID", `${warning._id}`);
    embed.addField("Guild Name", `${warning.GuildName}`);
    embed.addField("Guild ID", `${warning.GuildID}`);
    embed.addField("Member", `${warning.TargetTag}`);
    embed.addField("Member ID", `${warning.TargetID}`);
    embed.addField("Infraction Type", `${warning.InfractionType}`);
    embed.addField("Moderator", `${warning.ModeratorTag}`);
    embed.addField("Moderator ID", `${warning.ModeratorID}`);
    embed.addField("Reason", `${warning.Reason}`);
    embed.addField("Time", `${warning.Time}`);
    return message.channel.send({ embeds: [embed] });
  }
};
