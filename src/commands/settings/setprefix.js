"use strict";

const { MessageEmbed, Permissions } = require("discord.js"),
  mongoose = require("mongoose");

module.exports = {
  name: "setprefix",
  aliases: ["prefix"],
  description: "Change the default prefix to something you select!",
  usage: "(Prefix)setprefix <new prefix>",
  category: "Settings",
  async execute(message, args) {
    if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
      let noPerms = new MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setTitle("Change Prefix")
        .setDescription("You are not allowed or do not have permission to change the prefix.")
        .setColor(message.client.config.embeds.embed_color)
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp();
      return message.channel.send({ embeds: [noPerms] }).then((m) => setTimeout(() => m.delete(), 5000));
    }

    const settings = await message.client.models.guild.findOne(
      {
        guildID: message.guild.id
      },
      (err, guild) => {
        if (err) console.error(err);
        if (!guild) {
          const newGuild = new message.client.models.guild({
            _id: mongoose.Types.ObjectId(),
            guildID: message.guild.id,
            guildName: message.guild.name,
            prefix: message.client.config.helpers.default_prefix
          });
          newGuild
            .save()
            .then((result) => console.log(result))
            .catch((err) => console.error(err));

          return message.channel
            .send("This server was not in our database! We have added it, please retype this command.")
            .then((m) => setTimeout(() => m.delete(), 5000));
        }
      }
    );

    if (args.length < 1) {
      let SetPrefix = new MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setTitle("Change Prefix")
        .setDescription(
          `You must specify a prefix to set for this server! Your current server prefix is \`${settings.prefix}\``
        )
        .setColor(message.client.config.embeds.embed_color)
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp();
      return message.channel.send({ embeds: [SetPrefix] });
    }

    await settings.updateOne({
      prefix: args[0]
    });

    let SetPrefix = new MessageEmbed()
      .setAuthor({
        name: `${message.client.config.embeds.authorName}`,
        iconURL: `${message.client.config.embeds.authorIcon}`
      })
      .setTitle("Change Prefix")
      .setDescription(`The prefix has been set to \`${args[0]}\``)
      .setColor(message.client.config.embeds.embed_color)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp();
    await message.channel.send({ embeds: [SetPrefix] });
  }
};
