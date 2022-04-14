"use strict";

const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "ping",
  description: "Ping the bot",
  usage: "(Prefix)ping",
  category: "Info",
  async execute(message) {
    let client = message.client;

    // Mongo ping thanks crafter<3
    let dbBefore = Date.now();
    await client.models.guild.findOne({ guildID: message.guild.id });
    let db = Date.now() - dbBefore;

    // Regular ping
    let botMsg = await message.channel.send(`Pinging... ${message.client.config.helpers.birb}`);
    let ping = botMsg.createdTimestamp - message.createdTimestamp;
    let api = message.client.ws.ping;

    // Colors yayy!
    let colorVar;
    switch (true) {
      case ping < 150:
        colorVar = 0x7289da;
        break;
      case ping < 250:
        colorVar = 0x35fc03;
        break;
      case ping < 350:
        colorVar = 0xe3f51d;
        break;
      case ping < 400:
        colorVar = 0xf7700f;
        break;
      default:
        colorVar = 0xf7220f;
        break;
    }
    const embed = new MessageEmbed()
      .setAuthor({
        name: `${message.client.config.embeds.authorName}`,
        iconURL: `${message.client.config.embeds.authorIcon}`
      })
      .setColor(colorVar)
      .setThumbnail(message.author.displayAvatarURL())
      .setTitle(`Ping!`)
      .setDescription(`Ponged back the ping in ${ping}ms!`)
      .addField("API:", `${api}ms`, true)
      .addField("Database:", `${db}ms`, true)
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
    botMsg.edit({ content: null, embeds: [embed] });
  }
};

module.exports.slash = {
  name: "ping",
  description: "Get the ping of the bot.",
  async execute(client, interaction) {
    await interaction.deferReply();

    interaction.followUp(`Ponged back the ping in ${interaction.client.ws.ping}ms.`);
  }
};
