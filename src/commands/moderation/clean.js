"use strict";

const { MessageEmbed, Permissions } = require("discord.js");

module.exports = {
  name: "clean",
  aliases: ["purge"],
  description: "Mass clear 1-99 messages in a channel.",
  usage: "(Prefix)clean [0-99]",
  category: "Moderation",
  async execute(message, args) {
    if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
      let mPermEmbed = new MessageEmbed()
        .setTitle("Missing Permissions")
        .setDescription(
          `${message.client.config.helpers.error_x} Error, unable to clear messages.` +
            " <@" +
            message.author.id +
            "> does not have the correct permissions to run this command."
        )
        .setColor(message.client.config.embeds.embed_color)
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
      return message.channel.send({ embeds: [mPermEmbed] }).then((m) => setTimeout(() => m.delete(), 10000));
    }
    const amount = parseInt(args[0]) + 1;
    if (isNaN(amount)) {
      return message
        .reply("That doesn't seem to be a valid number\nTry running `*clean #`")
        .then((m) => setTimeout(() => m.delete(), 10000));
    } else if (amount <= 1 || amount > 100) {
      return message
        .reply("You need to input a number between 1 and 99.")
        .then((m) => setTimeout(() => m.delete(), 10000));
    }

    message.channel.bulkDelete(amount, true).catch((err) => {
      console.error(err);
      message.client.sentry.captureException(err);
      return message
        .reply(`There was an error trying to clear messages in this channel! Error: \`${err.message}\``)
        .then((m) => setTimeout(() => m.delete(), 10000));
    });

    let embed = new MessageEmbed()
      .setAuthor(message.author.tag + ` (${message.author.id})`, message.author.displayAvatarURL())
      .setDescription(
        `${args[0]} messages have been bulk deleted in <#${message.channel.id}> (\`${message.channel.id}\`).`
      )
      .setColor(message.client.config.embeds.embed_color)
      .setTimestamp();

    return message.channel.send({ embeds: [embed] }).then((m) => setTimeout(() => m.delete(), 10000));
  }
};

module.exports.slash = {
  name: "clean",
  description: "Clear a number of messages from a channel.",
  options: [
    {
      name: "number",
      description: "The number of messages you would like to clear.",
      type: "INTEGER",
      required: true
    }
  ],
  async execute(client, interaction, args) {
    await interaction.deferReply();

    if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
      let mPermEmbed = new MessageEmbed()
        .setTitle("Missing Permissions")
        .setDescription(
          `${client.config.helpers.error_x} Error, unable to clear messages.` +
            " <@" +
            interaction.author.id +
            "> does not have the correct permissions to run this command."
        )
        .setColor(client.config.embeds.embed_color)
        .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL());
      return interaction.followUp({ embeds: [mPermEmbed] });
    }

    const amount = interaction.options.getInteger("amount");

    await interaction.channel.bulkDelete(amount, true).then(() => {
      let embed = new MessageEmbed()
        .setAuthor(interaction.user.tag + ` (${interaction.user.id})`, interaction.user.displayAvatarURL())
        .setDescription(
          `Multiple messages have been bulk deleted in <#${interaction.channel.id}> (\`${interaction.channel.id}\`).`
        )
        .setColor(client.config.embeds.embed_color)
        .setTimestamp();
      interaction.channel.send({ embeds: [embed], ephemeral: true });
    });
  }
};
