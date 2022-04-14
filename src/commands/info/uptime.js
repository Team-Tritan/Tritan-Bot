"use strict";

const { MessageEmbed } = require("discord.js"),
  moment = require("moment");

module.exports = {
  name: "uptime",
  usage: "(Prefix)uptime",
  description: "Fetches Tritan's current uptime.",
  category: "Info",
  async execute(message) {
    const waiting = await message.channel.send(
      `${message.client.config.helpers.birb} Please wait, pulling the uptime from the server.`
    );

    const d = moment.duration(message.client.uptime);
    const days = d.days() == 1 ? `${d.days()} day` : `${d.days()} days`;
    const hours = d.hours() == 1 ? `${d.hours()} hour` : `${d.hours()} hours`;
    const minutes = d.minutes() == 1 ? `${d.minutes()} minute` : `${d.minutes()} minutes`;
    const seconds = d.seconds() == 1 ? `${d.seconds()} second` : `${d.seconds()} seconds`;
    const date = moment().subtract(d, "ms").format("dddd, MMMM Do YYYY");

    const embed = new MessageEmbed()
      .setAuthor({
        name: `${message.client.config.embeds.authorName}`,
        iconURL: `${message.client.config.embeds.authorIcon}`
      })
      .setTitle("Uptime")
      .setDescription(`\`${days}\`, \`${hours}\`, \`${minutes}\`, and \`${seconds}\``)
      .addField("Date Launched", date)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp()
      .setColor(message.client.config.embeds.embed_color);
    await waiting.edit({ content: null, embeds: [embed] });
  }
};
