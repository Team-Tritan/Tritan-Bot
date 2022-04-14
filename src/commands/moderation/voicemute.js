"use strict";

const { MessageEmbed, Permissions } = require("discord.js");

module.exports = {
  name: "voicemute",
  description: "Mute a user who is in a voice channel",
  usage: "(Prefix)voicemute <mention or id> <reason>",
  category: "Moderation",
  async execute(message, args, client) {
    await message.guild.members.fetch();
    await message.client.guilds.fetch(message.guild.id);

    if (
      !message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR) &&
      !message.member.permissions.has(Permissions.FLAGS.MUTE_MEMBERS)
    )
      return message.reply(`You don't have permission to use this command!`);

    const muteUser =
      message.guild.members.cache.get(message.mentions.users.first().id) ||
      message.guild.members.cache.get(args[0]);

    const muteReason = args.join(" ").slice(23);

    if (muteUser.voice.serverMute) {
      return message.channel
        .send("Member is not in a voice channel or is already muted.")
        .then((m) => setTimeout(() => m.delete(), 10000));
    }

    try {
      muteUser.voice.setMute(true, "muteReason");
    } catch (err) {
      console.error(err);
      message
        .reply("I was unable to voice mute this user, please check my permissions and try again.\n" + err)
        .then((m) => setTimeout(() => m.delete(), 10000));
    }

    try {
      muteUser.user.send(
        `You've been **Muted** from **${message.guild.name}**, Reason: **${muteReason || "None"}**.`
      );
    } catch (err) {
      console.err(err);
      message.reply("Unable to dm this member... muting.").then((m) => setTimeout(() => m.delete(), 10000));
    }

    message.channel.send(
      `**${muteUser.user.tag}** was successfully voice muted in the server. Reason: **${
        muteReason || "None"
      }**. `
    );
  }
};
