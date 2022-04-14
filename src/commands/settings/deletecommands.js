const { MessageEmbed, Permissions } = require("discord.js");
const mongoose = require("mongoose");

module.exports = {
  name: "deletecommands",
  description: "Turn on/off deleting the commands after tritan receives them.",
  usage: "(Prefix)deletecommands <on/off>",
  category: "Settings",
  async execute(message, args) {
    if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
      let noPerms = new MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setTitle("Delete Command Messages")
        .setDescription(
          "You are not allowed or do not have permission to turn on/off the command deletion settings."
        )
        .setColor(message.client.config.embeds.embed_color)
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp();
      return message.channel.send({ embeds: [noPerms] }).then((m) => setTimeout(() => m.delete(), 5000));
    }

    const settings = await message.client.models.guild.findOne({ guildID: message.guild.id });
    const option = args[0];

    if (!option) {
      let noArgs = new MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setTitle("Delete Command Messages")
        .setDescription(
          `You need to specify if the setting should be turned on or off.\nExample: ${settings.prefix}deletecommands on/off`
        )
        .setColor(message.client.config.embeds.embed_color)
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp();
      return message.channel.send({ embeds: [noArgs] }).then((m) => setTimeout(() => m.delete(), 5000));
    }

    if (option === "on") {
      try {
        await settings.updateOne({ autoCommandDeletion: true });
        let success = new MessageEmbed()
          .setAuthor({
            name: `${message.client.config.embeds.authorName}`,
            iconURL: `${message.client.config.embeds.authorIcon}`
          })
          .setTitle("Delete Command Messages")
          .setDescription(`Auto command deletion for this server has been enabled.`)
          .setColor(message.client.config.embeds.embed_color)
          .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
          .setTimestamp();
        return message.channel.send({ embeds: [success] }).then((m) => setTimeout(() => m.delete(), 5000));
      } catch (e) {
        let failure = new MessageEmbed()
          .setAuthor({
            name: `${message.client.config.embeds.authorName}`,
            iconURL: `${message.client.config.embeds.authorIcon}`
          })
          .setTitle("Delete Command Messages")
          .setDescription(
            `Unable to enable auto command deletion, please contact our developers by running *support.`
          )
          .addField("Error", e)
          .setColor(message.client.config.embeds.embed_color)
          .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
          .setTimestamp();
        return message.channel.send({ embeds: [failure] }).then((m) => setTimeout(() => m.delete(), 5000));
      }
    }

    if (option === "off") {
      try {
        await settings.updateOne({ autoCommandDeletion: false });
        let success = new MessageEmbed()
          .setAuthor({
            name: `${message.client.config.embeds.authorName}`,
            iconURL: `${message.client.config.embeds.authorIcon}`
          })
          .setTitle("Delete Command Messages")
          .setDescription(`Auto command deletion for this server has been disabled.`)
          .setColor(message.client.config.embeds.embed_color)
          .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
          .setTimestamp();
        return message.channel.send({ embeds: [success] }).then((m) => setTimeout(() => m.delete(), 5000));
      } catch (e) {
        let failure = new MessageEmbed()
          .setAuthor({
            name: `${message.client.config.embeds.authorName}`,
            iconURL: `${message.client.config.embeds.authorIcon}`
          })
          .setTitle("Delete Command Messages")
          .setDescription(
            `Unable to disable auto command deletion, please contact our developers by running *support.`
          )
          .addField("Error", e)
          .setColor(message.client.config.embeds.embed_color)
          .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
          .setTimestamp();
        return message.channel.send({ embeds: [failure] }).then((m) => setTimeout(() => m.delete(), 5000));
      }
    }
  }
};
