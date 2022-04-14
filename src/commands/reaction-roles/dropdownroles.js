"use strict";

const { MessageSelectMenu } = require("discord.js");
const { MessageEmbed, Permissions, MessageActionRow } = require("discord.js");

module.exports = {
  name: "dropdownroles",
  description: "Create a new role reaction menu.",
  usage: "(Prefix)dropdownrolesdropdownroles <channel mention> <messageID> <role mention>",
  category: "Reaction Roles",

  async execute(message, args, client) {
    if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_SERVER)) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setAuthor(client.config.embeds.authorName, client.config.embeds.authorIcon)
            .setTitle(":x: | You do not have permissions to add or edit the reaction roles for this server.")
            .setColor(client.config.embeds.embed_color)
            .setFooter(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL())
            .setTimestamp()
        ]
      });
    }

    const channel = message.mentions.channels.first();
    let messageId = args[1];
    const role = message.mentions.roles.first();

    if (!channel || channel.type !== "GUILD_TEXT") {
      return message.channel
        .send(":x: | You need to tag a valid channel. Run `*help dropdownroles` for more information.")
        .then((m) => setTimeout(() => m.delete(), 10000));
    }

    if (!role) {
      return message.channel
        .send(":x: | You need to tag a valid role. Run `*help dropdownroles` for more information.")
        .then((m) => setTimeout(() => m.delete(), 10000));
    }

    if (!messageId) {
      return message.channel
        .send(":x: | You need to tag a valid message id. Run `*help dropdownroles` for more information.")
        .then((m) => setTimeout(() => m.delete(), 10000));
    }

    const targetMessage = await channel.messages.fetch(messageId, {
      cache: true,
      force: true
    });

    if (!targetMessage) {
      return message.channel
        .send(":x: | You need to tag a valid message id. Run `*help dropdownroles` for more information.")
        .then((m) => setTimeout(() => m.delete(), 10000));
    }

    if (targetMessage.author.id !== client.user?.id) {
      return message.channel
        .send(
          `:x: | Please provide a message ID that was sent from <@!${client.user?.id}>, you can use the embed command to do so.`
        )
        .then((m) => setTimeout(() => m.delete(), 10000));
    }

    let row = targetMessage.components[0];
    if (!row) {
      row = new MessageActionRow();
    }

    const option = [
      {
        label: role.name,
        value: role.id
      }
    ];

    let menu = row.components[0];
    if (menu) {
      for (const o of menu.options) {
        if (o.value === option[0].value) {
          return message.channel
            .send(`:x: | <@&${o.value}> is already a part of this menu.`)
            .then((m) => setTimeout(() => m.delete(), 10000));
        }
      }

      menu.addOptions(option);
      menu.setMaxValues(menu.options.length);
    } else {
      row.addComponents(
        new MessageSelectMenu()
          .setCustomId("auto-roles")
          .setMinValues(0)
          .setMaxValues(1)
          .setPlaceholder("No Roles Selected")
          .addOptions(option)
      );
    }

    targetMessage.edit({
      components: [row]
    });

    return message
      .reply(
        `${client.config.helpers.check_mark} | Successfully added <@&${role.id}> to the self roles menu.`
      )
      .then((m) => setTimeout(() => m.delete(), 10000));
  }
};

module.exports.slash = {
  name: "self-roles",
  description: "Create a new self role menu.",
  options: [
    {
      name: "create-dropdown",
      description: "Create a dropdown menu for self assignable roles.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "channel",
          description: "The channel of the message you want to attach the role menu to.",
          type: "CHANNEL",
          required: true
        },
        {
          name: "message_id",
          description: "The message ID that you want to attach the role menu to.",
          type: "STRING",
          required: true
        },
        {
          name: "role",
          description: "The role that you want to add to the dropdown menu.",
          type: "ROLE",
          required: true
        }
      ]
    }
  ],

  async execute(client, interaction, args) {
    if (interaction.options.getSubcommand() === "create-dropdown") {
      if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_SERVER)) {
        return interaction.reply({
          embeds: [
            new MessageEmbed()
              .setAuthor(client.config.embeds.authorName, client.config.embeds.authorIcon)
              .setTitle(
                ":x: | You do not have permissions to add or edit the reaction roles for this server."
              )
              .setColor(client.config.embeds.embed_color)
              .setFooter(`Requested by: ${interaction.user.tag}`, interaction.user.displayAvatarURL())
              .setTimestamp()
          ]
        });
      }

      let role = interaction.options.getRole("role");
      let messageId = interaction.options.getString("message_id");
      let channel = interaction.options.getChannel("channel");

      const targetMessage = await channel.messages.fetch(messageId, {
        cache: true,
        force: true
      });

      if (targetMessage.author.id !== client.user?.id) {
        return interaction.reply({
          content: `:x: | Please provide a message ID that was sent from <@!${client.user?.id}>, you can use the embed command to do so.`,
          ephemeral: true
        });
      }

      let row = targetMessage.components[0];
      if (!row) {
        row = new MessageActionRow();
      }

      const option = [
        {
          label: role.name,
          value: role.id
        }
      ];

      let menu = row.components[0];
      if (menu) {
        for (const o of menu.options) {
          if (o.value === option[0].value) {
            return interaction.reply({
              content: `:x: | <@&${o.value}> is already a part of this menu.`,
              ephemeral: true
            });
          }
        }

        menu.addOptions(option);
        menu.setMaxValues(menu.options.length);
      } else {
        row.addComponents(
          new MessageSelectMenu()
            .setCustomId("auto-roles")
            .setMinValues(0)
            .setMaxValues(1)
            .setPlaceholder("No Roles Selected")
            .addOptions(option)
        );
      }

      targetMessage.edit({
        components: [row]
      });

      return interaction.reply({
        content: `${client.config.helpers.check_mark} | Successfully added <@&${role.id}> to the self roles menu.`,
        ephemeral: true
      });
    }
  }
};
