"use strict";

const { Permissions, MessageEmbed } = require("discord.js");

module.exports = {
  name: "maxmentions",
  description: "sets maximum role mentions allowed per message",
  usage: "<number or off>",
  category: "automod",
  async execute(message, args) {
    if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
      let noPerms = new MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setTitle("Auto Mod Configuration")
        .setDescription("You are not allowed or do not have permission to change any auto-mod settings..")
        .setColor(message.client.config.embeds.embed_color)
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp();
      return message.channel.send({ embeds: [noPerms] }).then((m) => setTimeout(() => m.delete(), 10000));
    }

    if (!args[0]) {
      return message.reply(
        "You need to include an argument with this command. See `*help maxmentions` for more info."
      );
    }

    let input = args[0];

    if (isNaN(input)) {
      if (input === "none" || input === "off") input = 0;
      else return message.reply("Not a valid input.");
    }

    if (parseInt(input, 10) < 2) return message.reply("Maximum mentions must atleast be 2.");

    let settings = await message.client.models.guild.findOne({ guildID: message.guild.id });
    await settings.updateOne({ "automod.max_mentions": input });

    message.channel.send(
      `${
        input === 0
          ? "Maximum user mentions limit is disabled."
          : `Messages having more than \`${input}\` user mentions will now be automatically deleted.`
      }`
    );
  }
};
