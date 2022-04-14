const { MessageEmbed, Permissions } = require("discord.js"),
  builder = require(`../../helpers/client/embedBuilder`);

module.exports = {
  name: "embed",
  aliases: ["embed-maker", "em"],
  description: "Make your own embeds with Tritan's easy to use embed builder!",
  usage: "(Prefix)embed",
  category: "Utility",
  premium: true,
  async execute(message, args) {
    if (!message.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS))
      return message.channel
        .send("You do not have the required permission to use this command.")
        .then((message) => {
          setTimeout(() => {
            message.delete();
          }, 3000);
        });

    let filter = (res) => res.author.id === message.author.id;

    let embed = new MessageEmbed()
      .setAuthor({
        name: `${message.client.config.embeds.authorName}`,
        iconURL: `${message.client.config.embeds.authorIcon}`
      })
      .setTimestamp()
      .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL());

    message.channel.send({
      embeds: [
        new MessageEmbed()
          .setAuthor({
            name: `${message.client.config.embeds.authorName}`,
            iconURL: `${message.client.config.embeds.authorIcon}`
          })
          .setTitle("Embed Builder: Title")
          .setDescription("What should the title of the embed be? If none, type `none`.")
          .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL())
          .setTimestamp()
          .setColor(message.client.config.embeds.embed_color)
      ]
    });

    let title = await message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ["time"] });
    if (title.size) {
      if (title.first().content !== "none") {
        if (title.first().length > 256)
          return message
            .reply("Title can not exceed 256 characters.")
            .then((message) => setTimeout(() => message.delete(), 10000));
        embed.setTitle(title.first().content);
      }
    }

    message.channel.send({
      embeds: [
        new MessageEmbed()
          .setAuthor({
            name: `${message.client.config.embeds.authorName}`,
            iconURL: `${message.client.config.embeds.authorIcon}`
          })
          .setTitle("Embed Builder: Description")
          .setDescription("What should the description of the embed be? If none, type `none`.")
          .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL())
          .setTimestamp()
          .setColor(message.client.config.embeds.embed_color)
      ]
    });

    let description = await message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ["time"] });
    if (description.size) {
      if (description.first().content !== "none") {
        if (description.first().length > 2048)
          return message
            .reply("Description can not exceed 2048 characters.")
            .then((message) => setTimeout(() => message.delete(), 10000));

        embed.setDescription(description.first().content);
      }
    }

    message.channel.send({
      embeds: [
        new MessageEmbed()
          .setAuthor({
            name: `${message.client.config.embeds.authorName}`,
            iconURL: `${message.client.config.embeds.authorIcon}`
          })
          .setTitle("Embed Builder: Image")
          .setDescription(
            "What should the large image of the embed be? Only URL's are accepted. If none, type `none`."
          )
          .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL())
          .setTimestamp()
          .setColor(message.client.config.embeds.embed_color)
      ]
    });

    let image = await message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ["time"] });
    if (image.size) {
      if (image.first().content !== "none") {
        if (!/\.(jpe?g|png|gif|webp)$/i.test(image.first().content)) {
          return message
            .reply("That was not a valid URL.")
            .then((message) => setTimeout(() => message.delete(), 10000));
        }
        embed.setImage(image.first().content);
      }
    }

    message.channel.send({
      embeds: [
        new MessageEmbed()
          .setAuthor({
            name: `${message.client.config.embeds.authorName}`,
            iconURL: `${message.client.config.embeds.authorIcon}`
          })
          .setTitle("Embed Builder: Thumbnail")
          .setDescription(
            "What should the thumbnail (small image) of the embed be? Only URL's are accepted. If none, type `none`."
          )
          .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL())
          .setTimestamp()
          .setColor(message.client.config.embeds.embed_color)
      ]
    });

    let thumbnail = await message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ["time"] });
    if (thumbnail.size) {
      if (thumbnail.first().content !== "none") {
        embed.setThumbnail(thumbnail.first().content);
      }
    }

    message.channel.send({
      embeds: [
        new MessageEmbed()
          .setAuthor({
            name: `${message.client.config.embeds.authorName}`,
            iconURL: `${message.client.config.embeds.authorIcon}`
          })
          .setTitle("Embed Builder: Hex Color")
          .setDescription("What should the color of the embed be? Enter a hex color. (#000000).")
          .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL())
          .setTimestamp()
          .setColor(message.client.config.embeds.embed_color)
      ]
    });

    let color = await message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ["time"] });
    if (color.size) {
      if (color.first().content !== "none") {
        embed.setColor(color.first().content);
      }
    }

    message.channel.send({
      embeds: [
        new MessageEmbed()
          .setAuthor({
            name: `${message.client.config.embeds.authorName}`,
            iconURL: `${message.client.config.embeds.authorIcon}`
          })
          .setTitle("Embed Builder: Footer")
          .setDescription("What should the footer of the embed be? if none then type `none`.")
          .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL())
          .setTimestamp()
          .setColor(message.client.config.embeds.embed_color)
      ]
    });

    let footer = await message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ["time"] });
    if (footer.size) {
      if (footer.first().content !== "none") {
        if (footer.first().length > 2048)
          return message
            .reply("Footer can not exceed 2048 characters.")
            .then((message) => setTimeout(() => message.delete(), 10000));
        embed.setFooter(
          footer.first().content + ` | Requested by ${message.author.username}`,
          message.author.displayAvatarURL()
        );
      }
    }

    message.channel.bulkDelete(12);
    try {
      message.channel.send({ embeds: [embed] });
    } catch (error) {
      return message.channel.send(`Error, ${error}`);
    }
  }
};

module.exports.slash = {
  name: "embed",
  description: "Build an embed, the easy way!",
  async execute(client, interaction, args) {
    let embed = new builder(client).createEmbed;
    embed(interaction);
  }
};
