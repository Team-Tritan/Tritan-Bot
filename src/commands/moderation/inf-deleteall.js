"use strict";

const { MessageEmbed, Permissions } = require("discord.js");

module.exports = {
  name: "inf-deleteall",
  description: "Delete all infractions given to a specific user.",
  usage: "(Prefix)inf-deleteall <user ID or mention>",
  category: "Moderation",
  premium: true,
  async execute(message, args) {
    if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
      return message
        .reply("You don't have enough permission to view this member's infractions.")
        .then((m) => setTimeout(() => m.delete(), 10000));
    }

    let target = message.mentions.users.first() || message.guild.members.cache.get(args[0]);

    if (!target)
      return message
        .reply("I can't find that user, they have to be in your guild for me to access their data.")
        .then((m) => setTimeout(() => m.delete(), 10000));
    if (target.id == message.member.id)
      return message.channel
        .send(`${message.client.config.helpers.error_x} You can't clear warnings for yourself.`)
        .then((m) => setTimeout(() => m.delete(), 10000));

    message.client.models.infractions
      .deleteMany({ TargetID: target.id })
      .then(() => {
        const embed = new MessageEmbed();
        embed.setAuthor(
          `${message.client.config.embeds.authorName}`,
          `${message.client.config.embeds.authorIcon}`
        );
        embed.setTitle("Successfully Cleared Infractions");
        embed.setDescription(`All infractions have been removed from ${target.tag} \`(${target.id})\`.`);
        embed.setTimestamp();
        embed.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
        embed.setColor(message.client.config.embeds.embed_color);
        return message.channel.send({ embeds: [embed] });
      })
      .catch((err) => {
        return message.channel
          .send("Error when deleting infractions.", err)
          .then((m) => setTimeout(() => m.delete(), 10000));
      });
  }
};
