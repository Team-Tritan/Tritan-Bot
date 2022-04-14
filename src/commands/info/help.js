"use strict";

const Discord = require("discord.js");

module.exports = {
  name: "help",
  description: "Shows all commands, usages, and descriptions.",
  usage: "(Prefix)help",
  aliases: ["h"],
  category: "Info",
  async execute(message, args, client) {
    const settings = await message.client.models.guild.findOne({
      guildID: message.guild.id
    });
    if (!args[0]) {
      const embed = new Discord.MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setThumbnail(message.guild.iconURL())
        .setTitle(`Tritan Bot: Help Menu (${client.commands.size} Commands)`)
        .setColor(client.config.embeds.embed_color)
        .setDescription(
          `<:info:844296498119966720> Run \`${settings.prefix}help <module name>\` for a list of commands.\n\n**Modules:**\n\`all\`, \`moderation\`, \`music\`, \`fun\`, \`utility\`, \`automod\`, \`custom commands\`, \`reaction roles\`, \`interactive\`, \`image\`, \`config\`, \`info\`, \`economy\`, \`leaderboards\`, \`nsfw\`, \`developer\`.`
        )
        .addField(
          "Links",
          "**[Invite Me](https://discord.com/api/oauth2/authorize?client_id=732783297872003114&permissions=8&redirect_uri=https%3A%2F%2Ftritan.gg%2Fauth%2Fcallback&scope=bot%20applications.commands)** | " +
            "**[Support Server](https://discord.gg/eEYxRqx2Bw)** |" +
            "**[Website](https://tritan.gg)** | " +
            "**[Status Page](https://status.tritan.gg)**"
        )
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp();

      /* message.author.send({ embed }).catch((e) => {
        if (e) {
          message.channel.send(
            `You seem to have your DMs closed, so I'll send it here instead. <:heawt:802801495153967154>`
          );
          message.channel.send({ embeds: [embed]});
        }
      }); */
      message.channel.send({ embeds: [embed] });
    } else if (args[0] === "all") {
      const embed = new Discord.MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setThumbnail(message.guild.iconURL())
        .setTitle(`Tritan Bot: Help Menu (${client.commands.size} Commands)`)
        .setColor(client.config.embeds.embed_color)
        .setDescription(
          `<:idle:768255808461996042> For more info about a specific command, run \`${settings.prefix}help <command>\`.\n ‎‏‏‎ ‎`
        )
        .addField(
          ":musical_note: Music Commands (Slash Only)",
          "`/music backtrack`, `/music bassboost`, `/music loop`, `/music lyrics`, `/music nowplaying`, `/music pause`, `/music play`, `/music search`, `/music queue`, `/music resume`, `/music shuffle`, `/music skip`, `/music soundcloud`, `/music stop`, `/music volume`, `/watch`"
        )
        .addField(
          ":partying_face: Fun Commands",
          client.commands
            .filter((x) => x.category === "Fun")
            .map((x) => `\`${x.name}\``)
            .join(", ") || "NONE"
        )
        .addField(
          "<a:coding:859549065669509152> Utility Commands",
          client.commands
            .filter((x) => x.category === "Utility")
            .map((x) => `\`${x.name}\``)
            .join(", ") || "NONE"
        )
        .addField(
          "<:upvote:768255808345473064> Auto Moderation Configuration",
          client.commands
            .filter((x) => x.category === "automod")
            .map((x) => `\`${x.name}\``)
            .join(", ") || "NONE"
        )
        .addField(
          ":eyes: Custom Commands",
          client.commands
            .filter((x) => x.category === "Custom Commands")
            .map((x) => `\`${x.name}\``)
            .join(", ") || "NONE"
        )
        .addField(
          "<:yes:768255348304773190> Reaction Roles",
          client.commands
            .filter((x) => x.category === "Reaction Roles")
            .map((x) => `\`${x.name}\``)
            .join(", ") || "NONE"
        )
        .addField(
          ":flying_saucer: Interactive/Game Commands",
          client.commands
            .filter((x) => x.category === "Interactive")
            .map((x) => `\`${x.name}\``)
            .join(", ") || "NONE"
        )
        .addField(
          "<:ban:859549717167079446> Moderation Commands (Some Slash)",
          client.commands
            .filter((x) => x.category === "Moderation")
            .map((x) => `\`${x.name}\``)
            .join(", ") || "NONE"
        )
        .addField(
          ":frame_photo: Image/Gif Commands",
          client.commands
            .filter((x) => x.category === "Image/Gifs")
            .map((x) => `\`${x.name}\``)
            .join(", ") || "NONE"
        )
        .addField(
          ":face_with_monocle: Config Commands (Legacy & Slash)",
          client.commands
            .filter((x) => x.category === "Settings")
            .map((x) => `\`${x.name}\``)
            .join(", ") || "NONE"
        )
        .addField(
          "<:info:844296498119966720> Informative Commands",
          client.commands
            .filter((x) => x.category === "Info")
            .map((x) => `\`${x.name}\``)
            .join(", ") || "NONE"
        )
        .addField(
          ":moneybag: Economy Commands",
          client.commands
            .filter((x) => x.category === "Economy")
            .map((x) => `\`${x.name}\``)
            .join(", ") || "NONE"
        )
        .addField(
          ":bar_chart: Leaderboard Commands",
          client.commands
            .filter((x) => x.category === "Leaderboards")
            .map((x) => `\`${x.name}\``)
            .join(", ") || "NONE"
        )
        .addField(
          "<a:nsfw:701657770440786002> NSFW Commands",
          client.commands
            .filter((x) => x.category === "nsfw")
            .map((x) => `\`${x.name}\``)
            .join(", ") || "NONE"
        )
        .addField(
          "<:verified_bot_developer:782716088160485416> Developer Commands",
          client.commands
            .filter((x) => x.category === "Developer")
            .map((x) => `\`${x.name}\``)
            .join(", ") || "NONE"
        )
        .addField(
          "Links",
          "**[Invite Me](https://discord.com/api/oauth2/authorize?client_id=732783297872003114&permissions=8&redirect_uri=https%3A%2F%2Ftritan.gg%2Fauth%2Fcallback&scope=bot%20applications.commands)** | " +
            "**[Support Server](https://discord.gg/eEYxRqx2Bw)** |" +
            "**[Website](https://tritan.gg)** | " +
            "**[Status Page](https://status.tritan.gg)**"
        )
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp();

      /* message.author.send({ embed }).catch((e) => {
        if (e) {
          message.channel.send(
            `You seem to have your DMs closed, so I'll send it here instead. <:heawt:802801495153967154>`
          );
          message.channel.send({ embeds: [embed]});
        }
      }); */
      message.channel.send({ embeds: [embed] });
    } else if (args[0] === "music") {
      const embed = new Discord.MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setThumbnail(message.guild.iconURL())
        .setTitle(`Tritan Bot: Help Menu (${client.commands.size} Commands)`)
        .setColor(client.config.embeds.embed_color)
        .setDescription(
          `<:idle:768255808461996042> For more info about a specific command, run \`${settings.prefix}help <command>\`.\n ‎‏‏‎ ‎`
        )
        .addField(
          ":musical_note: Music Commands (Slash)",
          "`/music backtrack`, `/music bassboost`, `/music loop`, `/music lyrics`, `/music nowplaying`, `/music pause`, `/music play`,`/music search`, `/music queue`, `/music resume`, `/music shuffle`, `/music skip`, `/music soundcloud`, `/music stop`, `/music volume`, `/watch`"
        )
        .addField(
          "Links",
          "**[Invite Me](https://discord.com/api/oauth2/authorize?client_id=732783297872003114&permissions=8&redirect_uri=https%3A%2F%2Ftritan.gg%2Fauth%2Fcallback&scope=bot%20applications.commands)** | " +
            "**[Support Server](https://discord.gg/eEYxRqx2Bw)** |" +
            "**[Website](https://tritan.gg)** | " +
            "**[Status Page](https://status.tritan.gg)**"
        )
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp();

      /* message.author.send({ embed }).catch((e) => {
        if (e) {
          message.channel.send(
            `You seem to have your DMs closed, so I'll send it here instead. <:heawt:802801495153967154>`
          );
          message.channel.send({ embeds: [embed]});
        }
      }); */
      message.channel.send({ embeds: [embed] });
    } else if (args[0] === "fun") {
      const embed = new Discord.MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setThumbnail(message.guild.iconURL())
        .setTitle(`Tritan Bot: Help Menu (${client.commands.size} Commands)`)
        .setColor(client.config.embeds.embed_color)
        .setDescription(
          `<:idle:768255808461996042> For more info about a specific command, run \`${settings.prefix}help <command>\`.\n ‎‏‏‎ ‎`
        )
        .addField(
          ":partying_face: Fun Commands",
          client.commands
            .filter((x) => x.category === "Fun")
            .map((x) => `\`${x.name}\``)
            .join(", ") || "NONE"
        )
        .addField(
          "Links",
          "**[Invite Me](https://discord.com/api/oauth2/authorize?client_id=732783297872003114&permissions=8&redirect_uri=https%3A%2F%2Ftritan.gg%2Fauth%2Fcallback&scope=bot%20applications.commands)** | " +
            "**[Support Server](https://discord.gg/eEYxRqx2Bw)** |" +
            "**[Website](https://tritan.gg)** | " +
            "**[Status Page](https://status.tritan.gg)**"
        )
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp();

      /* message.author.send({ embed }).catch((e) => {
        if (e) {
          message.channel.send(
            `You seem to have your DMs closed, so I'll send it here instead. <:heawt:802801495153967154>`
          );
          message.channel.send({ embeds: [embed]});
        }
      }); */
      message.channel.send({ embeds: [embed] });
    } else if (args[0] === "utility") {
      const embed = new Discord.MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setThumbnail(message.guild.iconURL())
        .setTitle(`Tritan Bot: Help Menu (${client.commands.size} Commands)`)
        .setColor(client.config.embeds.embed_color)
        .setDescription(
          `<:idle:768255808461996042> For more info about a specific command, run \`${settings.prefix}help <command>\`.\n ‎‏‏‎ ‎`
        )
        .addField(
          "<a:coding:859549065669509152> Utility Commands",
          client.commands
            .filter((x) => x.category === "Utility")
            .map((x) => `\`${x.name}\``)
            .join(", ") || "NONE"
        )
        .addField(
          "Links",
          "**[Invite Me](https://discord.com/api/oauth2/authorize?client_id=732783297872003114&permissions=8&redirect_uri=https%3A%2F%2Ftritan.gg%2Fauth%2Fcallback&scope=bot%20applications.commands)** | " +
            "**[Support Server](https://discord.gg/eEYxRqx2Bw)** |" +
            "**[Website](https://tritan.gg)** | " +
            "**[Status Page](https://status.tritan.gg)**"
        )
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp();

      /* message.author.send({ embed }).catch((e) => {
        if (e) {
          message.channel.send(
            `You seem to have your DMs closed, so I'll send it here instead. <:heawt:802801495153967154>`
          );
          message.channel.send({ embeds: [embed]});
        }
      }); */
      message.channel.send({ embeds: [embed] });
    } else if (args[0] === "automod") {
      const embed = new Discord.MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setThumbnail(message.guild.iconURL())
        .setTitle(`Tritan Bot: Help Menu (${client.commands.size} Commands)`)
        .setColor(client.config.embeds.embed_color)
        .setDescription(
          `<:idle:768255808461996042> For more info about a specific command, run \`${settings.prefix}help <command>\`.\n ‎‏‏‎ ‎`
        )
        .addField(
          "<:upvote:768255808345473064> Auto Moderation Configuration",
          client.commands
            .filter((x) => x.category === "automod")
            .map((x) => `\`${x.name}\``)
            .join(", ") || "NONE"
        )
        .addField(
          "Links",
          "**[Invite Me](https://discord.com/api/oauth2/authorize?client_id=732783297872003114&permissions=8&redirect_uri=https%3A%2F%2Ftritan.gg%2Fauth%2Fcallback&scope=bot%20applications.commands)** | " +
            "**[Support Server](https://discord.gg/eEYxRqx2Bw)** |" +
            "**[Website](https://tritan.gg)** | " +
            "**[Status Page](https://status.tritan.gg)**"
        )
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp();

      /* message.author.send({ embed }).catch((e) => {
        if (e) {
          message.channel.send(
            `You seem to have your DMs closed, so I'll send it here instead. <:heawt:802801495153967154>`
          );
          message.channel.send({ embeds: [embed]});
        }
      }); */
      message.channel.send({ embeds: [embed] });
    } else if (args.join(" ") === "custom commands") {
      const embed = new Discord.MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setThumbnail(message.guild.iconURL())
        .setTitle(`Tritan Bot: Help Menu (${client.commands.size} Commands)`)
        .setColor(client.config.embeds.embed_color)
        .setDescription(
          `<:idle:768255808461996042> For more info about a specific command, run \`${settings.prefix}help <command>\`.\n ‎‏‏‎ ‎`
        )
        .addField(
          ":eyes: Custom Commands",
          client.commands
            .filter((x) => x.category === "Custom Commands")
            .map((x) => `\`${x.name}\``)
            .join(", ") || "NONE"
        )
        .addField(
          "Links",
          "**[Invite Me](https://discord.com/api/oauth2/authorize?client_id=732783297872003114&permissions=8&redirect_uri=https%3A%2F%2Ftritan.gg%2Fauth%2Fcallback&scope=bot%20applications.commands)** | " +
            "**[Support Server](https://discord.gg/eEYxRqx2Bw)** |" +
            "**[Website](https://tritan.gg)** | " +
            "**[Status Page](https://status.tritan.gg)**"
        )
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp();

      /* message.author.send({ embed }).catch((e) => {
        if (e) {
          message.channel.send(
            `You seem to have your DMs closed, so I'll send it here instead. <:heawt:802801495153967154>`
          );
          message.channel.send({ embeds: [embed]});
        }
      }); */
      message.channel.send({ embeds: [embed] });
    } else if (args.join(" ") === "reaction roles") {
      const embed = new Discord.MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setThumbnail(message.guild.iconURL())
        .setTitle(`Tritan Bot: Help Menu (${client.commands.size} Commands)`)
        .setColor(client.config.embeds.embed_color)
        .setDescription(
          `<:idle:768255808461996042> For more info about a specific command, run \`${settings.prefix}help <command>\`.\n ‎‏‏‎ ‎`
        )
        .addField(
          "<:yes:768255348304773190> Reaction Roles",
          client.commands
            .filter((x) => x.category === "Reaction Roles")
            .map((x) => `\`${x.name}\``)
            .join(", ") || "NONE"
        )
        .addField(
          "Links",
          "**[Invite Me](https://discord.com/api/oauth2/authorize?client_id=732783297872003114&permissions=8&redirect_uri=https%3A%2F%2Ftritan.gg%2Fauth%2Fcallback&scope=bot%20applications.commands)** | " +
            "**[Support Server](https://discord.gg/eEYxRqx2Bw)** |" +
            "**[Website](https://tritan.gg)** | " +
            "**[Status Page](https://status.tritan.gg)**"
        )
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp();

      /* message.author.send({ embed }).catch((e) => {
        if (e) {
          message.channel.send(
            `You seem to have your DMs closed, so I'll send it here instead. <:heawt:802801495153967154>`
          );
          message.channel.send({ embeds: [embed]});
        }
      }); */
      message.channel.send({ embeds: [embed] });
    } else if (args[0] === "interactive") {
      const embed = new Discord.MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setThumbnail(message.guild.iconURL())
        .setTitle(`Tritan Bot: Help Menu (${client.commands.size} Commands)`)
        .setColor(client.config.embeds.embed_color)
        .setDescription(
          `<:idle:768255808461996042> For more info about a specific command, run \`${settings.prefix}help <command>\`.\n ‎‏‏‎ ‎`
        )
        .addField(
          ":flying_saucer: Interactive/Game Commands",
          client.commands
            .filter((x) => x.category === "Interactive")
            .map((x) => `\`${x.name}\``)
            .join(", ") || "NONE"
        )
        .addField(
          "Links",
          "**[Invite Me](https://discord.com/api/oauth2/authorize?client_id=732783297872003114&permissions=8&redirect_uri=https%3A%2F%2Ftritan.gg%2Fauth%2Fcallback&scope=bot%20applications.commands)** | " +
            "**[Support Server](https://discord.gg/eEYxRqx2Bw)** |" +
            "**[Website](https://tritan.gg)** | " +
            "**[Status Page](https://status.tritan.gg)**"
        )
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp();

      /* message.author.send({ embed }).catch((e) => {
        if (e) {
          message.channel.send(
            `You seem to have your DMs closed, so I'll send it here instead. <:heawt:802801495153967154>`
          );
          message.channel.send({ embeds: [embed]});
        }
      }); */
      message.channel.send({ embeds: [embed] });
    } else if (args[0] === "image") {
      const embed = new Discord.MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setThumbnail(message.guild.iconURL())
        .setTitle(`Tritan Bot: Help Menu (${client.commands.size} Commands)`)
        .setColor(client.config.embeds.embed_color)
        .setDescription(
          `<:idle:768255808461996042> For more info about a specific command, run \`${settings.prefix}help <command>\`.\n ‎‏‏‎ ‎`
        )
        .addField(
          ":frame_photo: Image/Gif Commands",
          client.commands
            .filter((x) => x.category === "Image/Gifs")
            .map((x) => `\`${x.name}\``)
            .join(", ") || "NONE"
        )
        .addField(
          "Links",
          "**[Invite Me](https://discord.com/api/oauth2/authorize?client_id=732783297872003114&permissions=8&redirect_uri=https%3A%2F%2Ftritan.gg%2Fauth%2Fcallback&scope=bot%20applications.commands)** | " +
            "**[Support Server](https://discord.gg/eEYxRqx2Bw)** |" +
            "**[Website](https://tritan.gg)** | " +
            "**[Status Page](https://status.tritan.gg)**"
        )
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp();

      /* message.author.send({ embed }).catch((e) => {
        if (e) {
          message.channel.send(
            `You seem to have your DMs closed, so I'll send it here instead. <:heawt:802801495153967154>`
          );
          message.channel.send({ embeds: [embed]});
        }
      }); */
      message.channel.send({ embeds: [embed] });
    } else if (args.join(" ") === "config") {
      const embed = new Discord.MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setThumbnail(message.guild.iconURL())
        .setTitle(`Tritan Bot: Help Menu (${client.commands.size} Commands)`)
        .setColor(client.config.embeds.embed_color)
        .setDescription(
          `<:idle:768255808461996042> For more info about a specific command, run \`${settings.prefix}help <command>\`.\n ‎‏‏‎ ‎`
        )
        .addField(
          ":face_with_monocle: Config Commands (Legacy & Slash)",
          client.commands
            .filter((x) => x.category === "Settings")
            .map((x) => `\`${x.name}\``)
            .join(", ") || "NONE"
        )
        .addField(
          "Links",
          "**[Invite Me](https://discord.com/api/oauth2/authorize?client_id=732783297872003114&permissions=8&redirect_uri=https%3A%2F%2Ftritan.gg%2Fauth%2Fcallback&scope=bot%20applications.commands)** | " +
            "**[Support Server](https://discord.gg/eEYxRqx2Bw)** |" +
            "**[Website](https://tritan.gg)** | " +
            "**[Status Page](https://status.tritan.gg)**"
        )
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp();

      /* message.author.send({ embed }).catch((e) => {
        if (e) {
          message.channel.send(
            `You seem to have your DMs closed, so I'll send it here instead. <:heawt:802801495153967154>`
          );
          message.channel.send({ embeds: [embed]});
        }
      }); */
      message.channel.send({ embeds: [embed] });
    } else if (args[0] === "info") {
      const embed = new Discord.MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setThumbnail(message.guild.iconURL())
        .setTitle(`Tritan Bot: Help Menu (${client.commands.size} Commands)`)
        .setColor(client.config.embeds.embed_color)
        .setDescription(
          `<:idle:768255808461996042> For more info about a specific command, run \`${settings.prefix}help <command>\`.\n ‎‏‏‎ ‎`
        )
        .addField(
          "<:info:768255807892095027> Informative Commands",
          client.commands
            .filter((x) => x.category === "Info")
            .map((x) => `\`${x.name}\``)
            .join(", ") || "NONE"
        )
        .addField(
          "Links",
          "**[Invite Me](https://discord.com/api/oauth2/authorize?client_id=732783297872003114&permissions=8&redirect_uri=https%3A%2F%2Ftritan.gg%2Fauth%2Fcallback&scope=bot%20applications.commands)** | " +
            "**[Support Server](https://discord.gg/eEYxRqx2Bw)** |" +
            "**[Website](https://tritan.gg)** | " +
            "**[Status Page](https://status.tritan.gg)**"
        )
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp();

      /* message.author.send({ embed }).catch((e) => {
        if (e) {
          message.channel.send(
            `You seem to have your DMs closed, so I'll send it here instead. <:heawt:802801495153967154>`
          );
          message.channel.send({ embeds: [embed]});
        }
      }); */
      message.channel.send({ embeds: [embed] });
    } else if (args[0] === "economy") {
      const embed = new Discord.MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setThumbnail(message.guild.iconURL())
        .setTitle(`Tritan Bot: Help Menu (${client.commands.size} Commands)`)
        .setColor(client.config.embeds.embed_color)
        .setDescription(
          `<:idle:768255808461996042> For more info about a specific command, run \`${settings.prefix}help <command>\`.\n ‎‏‏‎ ‎`
        )
        .addField(
          ":moneybag: Economy Commands",
          client.commands
            .filter((x) => x.category === "Economy")
            .map((x) => `\`${x.name}\``)
            .join(", ") || "NONE"
        )
        .addField(
          "Links",
          "**[Invite Me](https://discord.com/api/oauth2/authorize?client_id=732783297872003114&permissions=8&redirect_uri=https%3A%2F%2Ftritan.gg%2Fauth%2Fcallback&scope=bot%20applications.commands)** | " +
            "**[Support Server](https://discord.gg/eEYxRqx2Bw)** |" +
            "**[Website](https://tritan.gg)** | " +
            "**[Status Page](https://status.tritan.gg)**"
        )
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp();

      /* message.author.send({ embed }).catch((e) => {
        if (e) {
          message.channel.send(
            `You seem to have your DMs closed, so I'll send it here instead. <:heawt:802801495153967154>`
          );
          message.channel.send({ embeds: [embed]});
        }
      }); */
      message.channel.send({ embeds: [embed] });
    } else if (args[0] === "leaderboards") {
      const embed = new Discord.MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setThumbnail(message.guild.iconURL())
        .setTitle(`Tritan Bot: Help Menu (${client.commands.size} Commands)`)
        .setColor(client.config.embeds.embed_color)
        .setDescription(
          `<:idle:768255808461996042> For more info about a specific command, run \`${settings.prefix}help <command>\`.\n ‎‏‏‎ ‎`
        )
        .addField(
          ":bar_chart: Leaderboard Commands",
          client.commands
            .filter((x) => x.category === "Leaderboards")
            .map((x) => `\`${x.name}\``)
            .join(", ") || "NONE"
        )
        .addField(
          "Links",
          "**[Invite Me](https://discord.com/api/oauth2/authorize?client_id=732783297872003114&permissions=8&redirect_uri=https%3A%2F%2Ftritan.gg%2Fauth%2Fcallback&scope=bot%20applications.commands)** | " +
            "**[Support Server](https://discord.gg/eEYxRqx2Bw)** |" +
            "**[Website](https://tritan.gg)** | " +
            "**[Status Page](https://status.tritan.gg)**"
        )
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp();

      /* message.author.send({ embed }).catch((e) => {
        if (e) {
          message.channel.send(
            `You seem to have your DMs closed, so I'll send it here instead. <:heawt:802801495153967154>`
          );
          message.channel.send({ embeds: [embed]});
        }
      }); */
      message.channel.send({ embeds: [embed] });
    } else if (args[0] === "nsfw") {
      const embed = new Discord.MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setThumbnail(message.guild.iconURL())
        .setTitle(`Tritan Bot: Help Menu (${client.commands.size} Commands)`)
        .setColor(client.config.embeds.embed_color)
        .setDescription(
          `<:idle:768255808461996042> For more info about a specific command, run \`${settings.prefix}help <command>\`.\n ‎‏‏‎ ‎`
        )
        .addField(
          "<a:nsfw:701657770440786002> NSFW Commands",
          client.commands
            .filter((x) => x.category === "nsfw")
            .map((x) => `\`${x.name}\``)
            .join(", ") || "NONE"
        )
        .addField(
          "Links",
          "**[Invite Me](https://discord.com/api/oauth2/authorize?client_id=732783297872003114&permissions=8&redirect_uri=https%3A%2F%2Ftritan.gg%2Fauth%2Fcallback&scope=bot%20applications.commands)** | " +
            "**[Support Server](https://discord.gg/eEYxRqx2Bw)** |" +
            "**[Website](https://tritan.gg)** | " +
            "**[Status Page](https://status.tritan.gg)**"
        )
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp();

      /* message.author.send({ embed }).catch((e) => {
        if (e) {
          message.channel.send(
            `You seem to have your DMs closed, so I'll send it here instead. <:heawt:802801495153967154>`
          );
          message.channel.send({ embeds: [embed]});
        }
      }); */
      message.channel.send({ embeds: [embed] });
    } else if (args[0] === "moderation") {
      const embed = new Discord.MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setThumbnail(message.guild.iconURL())
        .setTitle(`Tritan Bot: Help Menu (${client.commands.size} Commands)`)
        .setColor(client.config.embeds.embed_color)
        .setDescription(
          `<:idle:768255808461996042> For more info about a specific command, run \`${settings.prefix}help <command>\`.\n ‎‏‏‎ ‎`
        )
        .addField(
          ":hammer: Moderation Commands (Some Slash)",
          client.commands
            .filter((x) => x.category === "Moderation")
            .map((x) => `\`${x.name}\``)
            .join(", ") || "NONE"
        )
        .addField(
          "Links",
          "**[Invite Me](https://discord.com/api/oauth2/authorize?client_id=732783297872003114&permissions=8&redirect_uri=https%3A%2F%2Ftritan.gg%2Fauth%2Fcallback&scope=bot%20applications.commands) | " +
            "****[Support Server](https://discord.gg/eEYxRqx2Bw)** |** |" +
            "**[Website](https://tritan.gg)** | " +
            "**[Status Page](https://status.tritan.gg)**"
        )
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp();

      /* message.author.send({ embed }).catch((e) => {
        if (e) {
          message.channel.send(
            `You seem to have your DMs closed, so I'll send it here instead. <:heawt:802801495153967154>`
          );
          message.channel.send({ embeds: [embed]});
        }
      }); */
      message.channel.send({ embeds: [embed] });
    } else if (args[0] === "developer") {
      const embed = new Discord.MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setThumbnail(message.guild.iconURL())
        .setTitle(`Tritan Bot: Help Menu (${client.commands.size} Commands)`)
        .setColor(client.config.embeds.embed_color)
        .setDescription(
          `<:idle:768255808461996042> For more info about a specific command, run \`${settings.prefix}help <command>\`.\n ‎‏‏‎ ‎`
        )
        .addField(
          "<:verified_bot_developer:782716088160485416> Developer Commands",
          client.commands
            .filter((x) => x.category === "Developer")
            .map((x) => `\`${x.name}\``)
            .join(", ") || "NONE"
        )
        .addField(
          "Links",
          "**[Invite Me](https://discord.com/api/oauth2/authorize?client_id=732783297872003114&permissions=8&redirect_uri=https%3A%2F%2Ftritan.gg%2Fauth%2Fcallback&scope=bot%20applications.commands) | " +
            "****[Support Server](https://discord.gg/eEYxRqx2Bw)** |** |" +
            "**[Website](https://tritan.gg)** | " +
            "**[Status Page](https://status.tritan.gg)**"
        )
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp();

      /* message.author.send({ embed }).catch((e) => {
        if (e) {
          message.channel.send(
            `You seem to have your DMs closed, so I'll send it here instead. <:heawt:802801495153967154>`
          );
          message.channel.send({ embeds: [embed]});
        }
      }); */
      message.channel.send({ embeds: [embed] });
    } else {
      let command = args[0];
      if (client.commands.has(command)) {
        let cmd = client.commands.get(command);

        let theseAliases = [];
        if (cmd.aliases) theseAliases = cmd.aliases.map((alias) => alias, true).join(", ");
        if (!cmd.aliases) theseAliases = "None";

        let embed = new Discord.MessageEmbed()
          .setAuthor({
            name: `${message.client.config.embeds.authorName}`,
            iconURL: `${message.client.config.embeds.authorIcon}`
          })
          .setThumbnail(
            message.guild.iconURL() || "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp"
          )
          .setTitle(`Command Info`)
          .setColor(client.config.embeds.embed_color)
          .addField("Name", `${cmd.name}`, true)
          .addField("Category", `${cmd.category}`, true)
          .addField("Description", `${cmd.description}`, true)
          .addField("Aliases", `${theseAliases}`, true)
          .addField("Usage", `${cmd.usage}`, true)
          .addField("Cooldown", `${cmd.cooldown || "5 seconds"}`, true)
          .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
          .setTimestamp();

        /** message.author.send({ embed }).catch((e) => {
          if (e) {
            message.channel.send(
              `You seem to have your DMs closed, so I'll send it here instead. <:heawt:802801495153967154>`
            );
            message.channel.send({ embeds: [embed]});
          }
        }); */
        message.channel.send({ embeds: [embed] });
      } else {
        return message.channel.send(
          "That command or module doesn't exist. Module names are case sensitive, and all commands start with a lowercase letter."
        );
      }
    }
  }
};

module.exports.slash = {
  name: "help",
  description: "Get a full list of commands.",
  async execute(client, interaction, args) {
    await interaction.deferReply();

    const settings = await client.models.guild.findOne({
      guildID: interaction.guild.id
    });

    const embed = new Discord.MessageEmbed()
      .setAuthor({
        name: `${client.config.embeds.authorName}`,
        iconURL: `${client.config.embeds.authorIcon}`
      })
      .setThumbnail(interaction.guild.iconURL())
      .setTitle(`Tritan Bot: Help Menu (${client.commands.size} Commands)`)
      .setColor(client.config.embeds.embed_color)
      .addField(
        ":musical_note: Music Commands (Only Slash)",
        "`/music backtrack`, `/music bassboost`, `/music loop`, `/music lyrics`, `/music nowplaying`, `/music pause`, `/music play`, `/music queue`, `/music resume`, `/music shuffle`, `/music skip`, `/music soundcloud`, `/music stop`, `/music volume`, `/watch`"
      )
      .addField(
        ":partying_face: Fun Commands",
        client.commands
          .filter((x) => x.category === "Fun")
          .map((x) => `\`${settings.prefix}${x.name}\``)
          .join(", ") || "NONE"
      )
      .addField(
        "<a:coding:859549065669509152> Utility Commands",
        client.commands
          .filter((x) => x.category === "Utility")
          .map((x) => `\`${settings.prefix}${x.name}\``)
          .join(", ") || "NONE"
      )
      .addField(
        "<:upvote:768255808345473064> Auto Moderation Configuration",
        client.commands
          .filter((x) => x.category === "automod")
          .map((x) => `\`${settings.prefix}${x.name}\``)
          .join(", ") || "NONE"
      )
      .addField(
        ":eyes: Custom Commands",
        client.commands
          .filter((x) => x.category === "Custom Commands")
          .map((x) => `\`${settings.prefix}${x.name}\``)
          .join(", ") || "NONE"
      )
      .addField(
        "<:yes:768255348304773190> Reaction Roles",
        client.commands
          .filter((x) => x.category === "Reaction Roles")
          .map((x) => `\`${settings.prefix}${x.name}\``)
          .join(", ") || "NONE"
      )
      .addField(
        ":flying_saucer: Interactive/Game Commands",
        client.commands
          .filter((x) => x.category === "Interactive")
          .map((x) => `\`${settings.prefix}${x.name}\``)
          .join(", ") || "NONE"
      )
      .addField(
        "<:ban:859549717167079446> Moderation Commands (Some Slash)",
        client.commands
          .filter((x) => x.category === "Moderation")
          .map((x) => `\`${settings.prefix}${x.name}\``)
          .join(", ") || "NONE"
      )
      .addField(
        ":frame_photo: Image/Gif Commands",
        client.commands
          .filter((x) => x.category === "Image/Gifs")
          .map((x) => `\`${settings.prefix}${x.name}\``)
          .join(", ") || "NONE"
      )
      .addField(
        ":face_with_monocle: Config Commands (Legacy & Slash)",
        client.commands
          .filter((x) => x.category === "Settings")
          .map((x) => `\`${settings.prefix}${x.name}\``)
          .join(", ") || "NONE"
      )
      .addField(
        "<:info:844296498119966720> Informative Commands",
        client.commands
          .filter((x) => x.category === "Info")
          .map((x) => `\`${settings.prefix}${x.name}\``)
          .join(", ") || "NONE"
      )
      .addField(
        ":moneybag: Economy Commands",
        client.commands
          .filter((x) => x.category === "Economy")
          .map((x) => `\`${settings.prefix}${x.name}\``)
          .join(", ") || "NONE"
      )
      .addField(
        ":bar_chart: Leaderboard Commands",
        client.commands
          .filter((x) => x.category === "Leaderboards")
          .map((x) => `\`${settings.prefix}${x.name}\``)
          .join(", ") || "NONE"
      )
      .addField(
        "<a:nsfw:701657770440786002> NSFW Commands",
        client.commands
          .filter((x) => x.category === "nsfw")
          .map((x) => `\`${settings.prefix}${x.name}\``)
          .join(", ") || "NONE"
      )
      .addField(
        "<:verified_bot_developer:782716088160485416> Developer Commands",
        client.commands
          .filter((x) => x.category === "Developer")
          .map((x) => `\`${settings.prefix}${x.name}\``)
          .join(", ") || "NONE"
      )
      .addField(
        "Links",
        "**[Invite Me](https://discord.com/api/oauth2/authorize?client_id=732783297872003114&permissions=8&redirect_uri=https%3A%2F%2Ftritan.gg%2Fauth%2Fcallback&scope=bot%20applications.commands) | " +
          "**[Support Server](https://discord.gg/eEYxRqx2Bw)** |** | " +
          "**[Website](https://tritan.gg)** | " +
          "**[Status Page](https://status.tritan.gg)**"
      )
      .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL())
      .setTimestamp();

    interaction.followUp({ embeds: [embed] });
  }
};
