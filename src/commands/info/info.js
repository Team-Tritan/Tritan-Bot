"use strict";

const { MessageEmbed } = require("discord.js"),
  { oneLine } = require("common-tags"),
  moment = require("moment");

module.exports = {
  name: "info",
  usage: "(Prefix)info",
  description: "Display's general information about Tritan Bot",
  category: "Info",
  execute(message) {
    const d = moment.duration(message.client.uptime);
    const days = d.days() == 1 ? `${d.days()} day` : `${d.days()} days`;
    const hours = d.hours() == 1 ? `${d.hours()} hour` : `${d.hours()} hours`;
    const minutes = d.minutes() == 1 ? `${d.minutes()} minute` : `${d.minutes()} minutes`;
    const seconds = d.seconds() == 1 ? `${d.seconds()} second` : `${d.seconds()} seconds`;

    const embed = new MessageEmbed()
      .setAuthor({
        name: `${message.client.config.embeds.authorName}`,
        iconURL: `${message.client.config.embeds.authorIcon}`
      })
      .setTitle("Tritan's Bot Information")
      .setDescription(
        oneLine`
        Tritan is a feature-rich Discord bot built with customizability in mind.
        He comes packaged with a variety of commands and a 
        multitude of settings that can be tailored to your specific needs.
        His codebase also serves as a base framework to easily create Discord bots of all kinds. 
      `
      )
      .addField("Username:", `\`${message.client.user.username}\``, true)
      .addField("Discriminator:", `\`#${message.client.user.discriminator}\``, true)
      .addField("ID:", `\`${message.client.user.id}\``, true)
      .addField(
        "Nickname:",
        message.guild.me.nickname ? `\`${message.guild.me.nickname}\`` : `\`None\``,
        true
      )
      .addField("Prefix:", `\`Run *setprefix for your current prefix.\``, true)
      .addField("Owner:", `<@359498825150365699>`, true)
      .addField("Uptime:", `\`${days}\`, \`${hours}\`, \`${minutes}\`, and \`${seconds}\``, true)
      .addField("Database:", `\`SQLite & MongoDB\``, true)
      .addField("OS:", `\`Ubuntu 20.04.1 LTS\``, true)
      .addField(
        "Links",
        "**[Invite Me](https://discord.com/api/oauth2/authorize?client_id=732783297872003114&permissions=8&redirect_uri=https%3A%2F%2Ftritan.gg%2Fapi%2Fcallback&scope=bot%20applications.commands) | " +
          "**[Support Server](https://discord.gg/eEYxRqx2Bw)** |" +
          "**[Website](https://tritan.gg)**"
      )
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp()
      .setColor(message.client.config.embeds.embed_color);
    return message.channel.send({ embeds: [embed] });
  }
};
