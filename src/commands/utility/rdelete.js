"use strict";

const { MessageEmbed } = require("discord.js"),
  mongoose = require("mongoose");

module.exports = {
  name: "rdelete",
  description: "Delete a reminder",
  usage: "(Prefix)redelete <reminder id>",
  category: "Utility",
  async execute(message, args) {
    if (!args[0])
      return message.reply("Please run the `reminders` command and then try again with the reminder ID.");

    const reminder = await message.client.models.reminders.findOne({
      _id: args[0]
    });

    try {
      await reminder.updateOne({
        active: false
      });

      let cancel = new MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setTitle("Reminder Canceled")
        .setDescription(`Your reminder has be canceled.`)
        .setColor(message.client.config.embeds.embed_color)
        .setFooter(`Reminder ID: ${args[0]}`, message.author.displayAvatarURL())
        .setTimestamp();
      return message.channel.send({ content: `<@!${message.author.id}>`, embeds: [cancel] });
    } catch (e) {
      message.reply(`I'm having issues finding that reminder, please try again later.`);
      console.error("REMINDER DELETE ERROR: ", e);
    }
  }
};
