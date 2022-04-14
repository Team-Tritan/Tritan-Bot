"use strict";

const { Permissions, MessageEmbed } = require("discord.js");

module.exports = {
  name: "antilinks",
  description: "Allow or disallow sending links in message",
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
        .setDescription("You are not allowed or do not have permission to change any auto-mod settings.")
        .setColor(message.client.config.embeds.embed_color)
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp();
      return message.channel.send({ embeds: [noPerms] }).then((m) => setTimeout(() => m.delete(), 10000));
    }

    if (!args[0]) {
      return message.reply(
        "You need to include an argument with this command. See `*help antilinks` for more info."
      );
    }

    const input = args[0].toLowerCase();
    let status;

    if (input === "none" || input === "off" || input === "disable") status = false;
    else if (input === "on" || input === "enable") status = true;
    else return message.reply("Incorrect command usage, use `on/enable`, or `none/off/disable`.");

    let settings = await message.client.models.guild.findOne({ guildID: message.guild.id });
    await settings.updateOne({ "automod.anti_links": status });

    message.channel.send(
      `Messages ${
        status ? "with links will now be automatically deleted." : "will not be filtered for links now."
      }`
    );
  }
};
