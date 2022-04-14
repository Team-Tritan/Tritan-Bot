"use strict";

const { MessageEmbed } = require("discord.js"),
  ms = require("ms");

module.exports = {
  name: "reminders",
  description: "List your active or forgotten reminders.",
  usage: "(Prefix)reminders",
  aliases: ["rlist"],
  category: "Utility",
  async execute(message, args) {
    let target = message.mentions.users.first() || message.client.users.cache.get(args[0]) || message.author;
    if (!target)
      return message.channel.send(
        "I can't find that user, they have to be in your guild to access their data. Try using the dashboard for a list of all reminders."
      );
    const page = parseInt(args[1]) || 1;
    let remindersList = await message.client.models.reminders
      .find({ authorID: target.id, active: true })
      .limit(50)
      .skip((page - 1) * 50);
    if (remindersList.length == 0)
      return message.channel.send("There are no active reminders for this user at this time.");

    const embed = new MessageEmbed();
    embed.setAuthor(
      `${message.client.config.embeds.authorName}`,
      `${message.client.config.embeds.authorIcon}`
    );
    embed.setTimestamp();
    embed.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
    embed.setColor(message.client.config.embeds.embed_color);

    if (!target.tag) target.tag = target.id;
    embed.setTitle(`Reminders for ${target.tag}`);

    remindersList.map((remindersList) => {
      const timeLeft = Date.now() - remindersList.reminderTime;
      const timeToString = timeLeft.toString();

      embed.addField(
        `ID: \`${remindersList._id}\``,
        `**Guild ID:** ${remindersList.guildID}\n**Channel:** <#${
          remindersList.reminderChannelID
        }>\n**Title:** ${remindersList.reminderText}\n**Time Left:** ${ms(ms(timeToString))}`
      );
    });
    return message.channel.send({ embeds: [embed] });
  }
};

module.exports.slash = {
  name: "reminders",
  description: "View/delete your active reminders.",
  options: [
    {
      name: "view",
      description: "View your active reminders.",
      type: "SUB_COMMAND"
    },
    {
      name: "delete",
      description: "Delete a reminder by ID.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "id",
          description: "The ID of the reminder to delete.",
          type: "STRING",
          required: true
        }
      ]
    }
  ],
  async execute(client, interaction) {
    if (interaction.options.getSubcommand() === "view") {
      let target = interaction.user;

      let remindersList = await client.models.reminders.find({ authorID: target.id, active: true }).limit(50);

      if (remindersList.length == 0)
        return interaction.reply("There are no active reminders for this user at this time.");

      const embed = new MessageEmbed();
      embed.setAuthor(`${client.config.embeds.authorName}`, `${client.config.embeds.authorIcon}`);
      embed.setTimestamp();
      embed.setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL());
      embed.setColor(client.config.embeds.embed_color);

      if (!target.tag) target.tag = target.id;
      embed.setTitle(`Reminders for ${target.tag}`);

      remindersList.map((remindersList) => {
        const timeLeft = Date.now() - remindersList.reminderTime;
        const timeToString = timeLeft.toString();

        embed.addField(
          `ID: \`${remindersList._id}\``,
          `**Guild ID:** ${remindersList.guildID}\n**Channel:** <#${
            remindersList.reminderChannelID
          }>\n**Title:** ${remindersList.reminderText}\n**Time Left:** ${ms(ms(timeToString))}`
        );
      });
      return interaction.reply({ embeds: [embed] });
    }

    if (interaction.options.getSubcommand() === "delete") {
      let id = interaction.options.getString("id");

      const reminder = await client.models.reminders.findOne({
        _id: id
      });

      try {
        await reminder.updateOne({
          active: false
        });

        let cancel = new MessageEmbed()
          .setAuthor({
            name: `${client.config.embeds.authorName}`,
            iconURL: `${client.config.embeds.authorIcon}`
          })
          .setTitle("Reminder Canceled")
          .setDescription(`Your reminder has be canceled.`)
          .setColor(client.config.embeds.embed_color)
          .setFooter(`Reminder ID: ${id}`, interaction.user.displayAvatarURL())
          .setTimestamp();
        return interaction.reply({ content: `<@!${interaction.user.id}>`, embeds: [cancel] });
      } catch (e) {
        interaction.reply(`I'm having issues finding that reminder, please try again later.`);
      }
    }
  }
};
