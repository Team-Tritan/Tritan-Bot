"use strict";

const { MessageEmbed, Permissions } = require(`discord.js`);

module.exports = {
  name: "lock",
  description: "Lock a channel, denies @everyone send message permissions",
  usage: "(Prefix)lock <optional channel mention> <reason>",
  category: "Moderation",
  async execute(message, args) {
    await message.client.guilds.fetch(message.guild.id);

    const settings = await message.client.models.guild.findOne({
      guildID: message.guild.id
    });

    if (!settings.event_logs) {
      return message
        .reply("You need to set a logging channel before using any moderation commands.")
        .then((m) => setTimeout(() => m.delete(), 10000));
    }

    const channel = message.client.functions.getChannelFromMention(args[0])
      ? message.client.functions.getChannelFromMention(args[0])
      : message.channel.id;

    const reason = args.join(" ");

    if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
      return message.channel.send("You need `manage channel` permissons to run this command.");
    }

    try {
      message.guild.channels.cache
        .get(channel)
        .permissionOverwrites.edit(message.guild.id, { SEND_MESSAGES: false });
    } catch (err) {
      console.error(err);
      return message
        .reply("I was unable to lock this channel, please check my permissions and try again.")
        .then((m) => setTimeout(() => m.delete(), 10000));
    }

    let lockembed = new MessageEmbed()
      .setAuthor({
        name: `${message.client.config.embeds.authorName}`,
        iconURL: `${message.client.config.embeds.authorIcon}`
      })
      .setTitle(`🔒 Channel Lockdown`)
      .addField("Channel: ", `${message.channel.name} (<#${message.channel.id}>)`, true)
      .addField("Reason: ", `${reason ? reason : "No reason has been set."}`, true)
      .setColor(message.client.config.embeds.embed_color)
      .setTimestamp()
      .setFooter(`Locked by ${message.author.tag}`, message.author.displayAvatarURL());

    message.channel.send({ embeds: [lockembed] });

    const log_channel = await message.client.channels.fetch(settings.event_logs);
    return log_channel.send({ embeds: [lockembed] });
  }
};
