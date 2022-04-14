"use strict";

const { MessageAttachment, MessageEmbed } = require(`discord.js`),
  fs = require("fs"),
  mongoose = require("mongoose");

module.exports = {
  name: "archive",
  description: "Archives messages in a channel.",
  usage: "(Prefix)archive",
  category: "Moderation",
  premium: true,
  cooldown: 120,
  async execute(message, args) {
    const newInfraction = new message.client.models.infractions({
      _id: mongoose.Types.ObjectId(),
      GuildID: message.guild.id,
      GuildName: message.guild.name,
      TargetID: message.channel.id,
      TargetTag: `#${message.channel.name}`,
      ModeratorID: message.author.id,
      ModeratorTag: message.author.tag,
      InfractionType: "Message Archive",
      Reason: "User created an archive of latest 100 messages in the target channel.",
      Time: message.createdAt
    });
    newInfraction
      .save()
      .then((result) => console.log(client.logger.yellow("[Saved Database Record]"), result));

    const client = message.client;
    let temporarymsg = await message.channel.send({
      embeds: [
        new MessageEmbed()
          .setAuthor("Generating...", "https://cdn.discordapp.com/emojis/757632044632375386.gif?v=1")
          .setColor(message.client.config.embeds.embed_color)
          .setFooter(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL())
          .setTimestamp()
      ]
    });

    var file = fs.createWriteStream("./tmp/archive.txt");
    file.on("error", function (err) {
      console.log(err);
    });

    const fetched = await message.channel.messages.fetch({ limit: 100 });

    fetched.map((message) => {
      file.write(
        `[${message.createdAt}] - (${message.author.tag} - ${message.author.id}) - ${message.content}\r\n`
      );
    });

    const finished_file = new MessageAttachment("./tmp/archive.txt");

    await temporarymsg.edit({
      embeds: [
        new MessageEmbed()
          .setTitle(
            `${message.client.config.helpers.check_mark} Your archive file of the last 100 messages is attached.`
          )
          .setColor(message.client.config.embeds.embed_color)
          .setFooter(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL())
          .setTimestamp()
      ],
      files: [finished_file]
    });
  }
};
