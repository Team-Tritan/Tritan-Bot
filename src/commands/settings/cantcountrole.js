const { MessageEmbed, Permissions } = require("discord.js"),
  mongoose = require("mongoose");

module.exports = {
  name: "cantcountrole",
  description: "Set the cant count role for users who mess up in your counting channel",
  usage: "(Prefix)cantcountrole <role mention or ID>",
  category: "Settings",
  async execute(message, args) {
    if (!args[0]) return message.channel.send("You need to tag the role when running this command.");
    const role = message.mentions.roles.first().id || message.guild.roles.cache.get(args[0]);
    const settings = await message.client.models.guild.findOne({ guildID: message.guild.id });

    if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
      let noPerms = new MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setTitle("Can't Count Role")
        .setDescription("You are not allowed or do not have permission to set the can't count role.")
        .setColor(message.client.config.embeds.embed_color)
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp();
      return message.channel.send({ embeds: [noPerms] }).then((m) => setTimeout(() => m.delete(), 10000));
    }

    await settings.updateOne({
      cantCountRole: role
    });

    let SetCH = new MessageEmbed()
      .setAuthor({
        name: `${message.client.config.embeds.authorName}`,
        iconURL: `${message.client.config.embeds.authorIcon}`
      })
      .setTitle("Can't Count Role")
      .setDescription(`The can't count role has been set to <@&${role}>.`)
      .setColor(message.client.config.embeds.embed_color)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp();
    return message.channel.send({ embeds: [SetCH] });
  }
};
