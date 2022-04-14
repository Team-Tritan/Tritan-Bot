"use strict";

const { Permissions } = require("discord.js");

module.exports = {
  name: "removerole",
  description: "Removes a role to a member",
  usage: "removerole <user mention> <role name>",
  category: "Moderation",
  async execute(message, args) {
    await message.client.guilds.fetch(message.guild.id);

    if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
      return message
        .reply("You don't have enough permission to manage this member's roles.")
        .then((m) => setTimeout(() => m.delete(), 10000));
    }

    if (message.mentions.users.size === 0)
      return message.channel
        .send(
          `${message.client.config.helpers.error_x} Please mention a user to give the role to.\nExample: *addrole @user <role id | role name | role mention>`
        )
        .then((m) => setTimeout(() => m.delete(), 10000));

    let member = message.guild.members.cache.get(message.mentions.users.first().id);
    if (!member)
      return message.channel
        .send(`${message.client.config.helpers.error_x} **Error:** That user does not seem valid.`)
        .then((m) => setTimeout(() => m.delete(), 10000));

    let role =
      message.mentions.roles.first() ||
      message.guild.roles.cache.get(args[0]) ||
      message.guild.roles.cache.find(
        (rl) => rl.name.toLowerCase() === args.slice(0).join(" ").toLowerCase()
      ) ||
      message.guild.roles.cache.find((rl) => rl.name.toUpperCase() === args.slice(0).join(" ").toUpperCase());

    if (!role)
      return message
        .reply(`${message.client.config.helpers.error_x} **Error:** Unable to find that role in this server!`)
        .then((m) => setTimeout(() => m.delete(), 10000));

    member.roles.remove(role).catch((e) => {
      return message.channel.send(`${message.client.config.helpers.error_x} **Error:**\n${e}`);
    });

    return message.channel.send(
      `${message.client.config.helpers.check_mark} **${
        message.author.username
      }**, I've removed the **${role}** role to **${message.mentions.users.first().username}**.`
    );
  }
};
