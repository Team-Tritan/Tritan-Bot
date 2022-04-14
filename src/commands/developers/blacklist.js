"use strict";

const { MessageEmbed } = require("discord.js"),
  mongoose = require("mongoose");

module.exports = {
  name: "dev.blacklist",
  description: "Blacklists a specific guild",
  category: "Developer",
  devOnly: true,
  async execute(message, args, client) {
    if (!args[0]) {
      let noArgs = new MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setTitle("Guild Blacklist")
        .setDescription("Please send an argument with the guild ID to blacklist.")
        .setColor(message.client.config.embeds.embed_color)
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp();
      return message.channel.send({ embeds: [noArgs] });
    }

    const settings = await client.models.guild.findOne(
      {
        guildID: args[0]
      },
      (err, guild) => {
        if (err) console.error(err);
        if (!guild) {
          const newGuild = new client.models.guild({
            _id: mongoose.Types.ObjectId(),
            guildID: args[0],
            is_blacklisted: true
          });
          newGuild
            .save()
            .then((result) => console.log(client.logger.yellow("[Saved Database Record"), result))
            .catch((err) => console.error(client.logger.yellow("[Error: Database Save"), err));

          let blacklist1 = new MessageEmbed()
            .setAuthor({
              name: `${message.client.config.embeds.authorName}`,
              iconURL: `${message.client.config.embeds.authorIcon}`
            })

            .setTitle("Guild Blacklisted")
            .setDescription(
              `You have successfully blacklisted guild ID ${args[0]}, the guild was not currently in the database and I will leave if they add me.`
            )
            .setColor(message.client.config.embeds.embed_color)
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
            .setTimestamp();
          return message.channel.send({ embeds: [blacklist1] });
        }
      }
    );

    await settings.updateOne({
      is_blacklisted: true
    });

    let blacklist2 = new MessageEmbed()
      .setAuthor({
        name: `${message.client.config.embeds.authorName}`,
        iconURL: `${message.client.config.embeds.authorIcon}`
      })
      .setTitle("Guild Blacklisted")
      .setDescription(
        `You have successfully blacklisted guild ID ${args[0]}, the guild was currently in the database, on their next message I will leave.`
      )
      .setColor(message.client.config.embeds.embed_color)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp();
    return message.channel.send({ embeds: [blacklist2] });
  }
};
