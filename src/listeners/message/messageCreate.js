"use strict";

let { Collection, MessageEmbed, WebhookClient } = require("discord.js"),
  Statcord = require("statcord.js"),
  mongoose = require("mongoose"),
  newRelic = require("newrelic");

module.exports = async (client, message) => {
  const errorWebhook = new WebhookClient({
    id: client.config.webhooks.ERROR_CHANNEL_WEBHOOK_ID,
    token: client.config.webhooks.ERROR_CHANNEL_WEBHOOK_SECRET
  });

  const controlWebhook = new WebhookClient({
    id: client.config.webhooks.CONTROL_CHANNEL_WEBHOOK_ID,
    token: client.config.webhooks.CONTROL_CHANNEL_WEBHOOK_SECRET
  });

  const commandLogWebhook = new WebhookClient({
    id: client.config.webhooks.COMMAND_LOG_WEBHOOK_ID,
    token: client.config.webhooks.COMMAND_LOG_WEBHOOK_SECRET
  });

  if (message.author.bot) {
    return;
  }

  if (message.channel.type == "DM") {
    return client.functions.dmHandler(message, client, controlWebhook);
  }

  if (message.guild)
    if (!client.guilds.cache.get(message.guild.id)) {
      await client.guilds.fetch(message.guild.id);
    }

  message.guild.members.fetch();

  const settings = await client.models.guild.findOne(
    {
      guildID: message.guild.id
    },
    (err, guild) => {
      if (err) console.error(err);
      if (!guild) {
        const newGuild = new client.models.guild({
          _id: mongoose.Types.ObjectId(),
          guildID: message.guild.id,
          guildName: message.guild.name,
          guildCreated: message.guild.createdAt,
          prefix: client.config.helpers.default_prefix,
          is_premium: false,
          is_blacklisted: false,
          event_logs: null,
          join_leave: null,
          mute_role: null,
          betaGuild: false,
          messageCount: 1,
          disabledBumpReminders: false,
          auto_delete_channel: null,
          appeal_link: null,
          autoCommandDeletion: true
        });
        newGuild
          .save()
          .then((result) => console.log(result))
          .catch((err) => console.error(err));
        return message.channel
          .send(
            "This server was not in our database! We have now added and you should be able to use legacy bot commands."
          )
          .then((m) =>
            setTimeout(() => {
              m.delete();
            }, 10000)
          );
      }
    }
  );

  client.functions.blacklistCheck(message, settings, controlWebhook, client);
  client.functions.memberMessageCount(client, message);
  client.functions.afkCheck(message, client);
  client.functions.levelUpMessages(message, client, settings);
  client.functions.bumpReminder(message, client, settings);
  client.functions.performAutomod(message, settings, client);
  client.functions.countManager(message, client, settings);
  client.functions.autoDelete(message, settings);
  client.functions.mentionRegex(message, settings, client);
  client.functions.massMentionLog(message, client, settings);
  client.functions.thanksuwu(message, client);

  let thisId;
  if (client.config.tokens.production_mode) thisId = client.config.tokens.id;
  if (client.config.tokens.dev_mode) thisId = client.config.tokens.dev_id;

  let fuckmedaddy;
  if (message.content.startsWith(`<@!${thisId}>`)) fuckmedaddy = `<@!${thisId}> `;
  if (message.content.startsWith(`<@${thisId}>`)) fuckmedaddy = `<@${thisId}> `;
  if (message.content.startsWith(settings.prefix)) fuckmedaddy = settings.prefix;

  if (!message.content.startsWith(fuckmedaddy)) return;
  let args = message.content.slice(fuckmedaddy.length).trim().split(/ +/);

  let commandName = args.shift().toLowerCase();
  let command =
    client.commands.get(commandName) ||
    client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

  client.functions.customCommands(message, client, settings, commandName);

  if (!command) return;

  Statcord.ShardingClient.postCommand(commandName, message.author.id, client);

  client.functions.permissionsCheck(message, client);
  client.functions.commandCount(client, commandName);
  newRelic.incrementMetric(commandName, [1]);
  newRelic.incrementMetric("Commands Ran", [1]);

  if (client.config.helpers.blacklisted_users.includes(message.author.id)) {
    message.react(client.config.helpers.error_x);

    message.channel.send(
      `<@!${message.author.id}>, you have been blacklisted from this bot (most likely due to abuse). If you any questions, please reach out to the developers.\nhttps://tritan.gg/support`
    );

    let embed = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp")
      .setTitle("Blacklisted User Alert")
      .addField("User", message.author.tag + ` (ID: ${message.author.id})`, true)
      .addField("Guild", message.guild.name + ` (ID: ${message.guild.id})`, true)
      .addField("Command", commandName, true)
      .setColor(client.config.embeds.embed_color)
      .setTimestamp();

    return commandLogWebhook.send({
      username: "Tritan Alerts",
      avatarURL: "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp",
      embeds: [embed]
    });
  }
  if (command.inBeta && !settings.betaGuild) {
    message.react(client.config.helpers.error_x);

    message.reply(
      "this command is for beta guilds only. Please reach out in our support server to enable this setting."
    );

    let embed = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp")
      .setTitle("Unauthorized Beta Command Alert")
      .addField("User", message.author.tag + ` (ID: ${message.author.id})`, true)
      .addField("Guild", message.guild.name + ` (ID: ${message.guild.id})`, true)
      .addField("Command", commandName, true)
      .setColor(client.config.embeds.embed_color)
      .setTimestamp();

    return commandLogWebhook.send({
      username: "Tritan Alerts",
      avatarURL: "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp",
      embeds: [embed]
    });
  }

  if (command.devOnly && !client.config.helpers.developer_ids.includes(message.author.id)) {
    message.react(client.config.helpers.error_x);

    message.reply("This command can only be used by authorized developers.");

    let embed = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp")
      .setTitle("Unauthorized Developer Command Alert")
      .addField("User", message.author.tag + ` (ID: ${message.author.id})`, true)
      .addField("Guild", message.guild.name + ` (ID: ${message.guild.id})`, true)
      .addField("Command", commandName, true)
      .setColor(client.config.embeds.embed_color)
      .setTimestamp();

    return commandLogWebhook.send({
      username: "Tritan Alerts",
      avatarURL: "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp",
      embeds: [embed]
    });
  }

  /** if (command.premium && !settings.is_premium) {
    message.react(client.config.helpers.error_x);

    let premiumEmbed = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp")
      .setTitle(`${client.config.helpers.error_x} Premium Not Enabled`)
      .setDescription(
        `You tried running a premium command in a server that isn't premium. Please consider supporting Tritan Bot's development by donating for a premium subscription.`
      )
      .addField(`Get Premium`, `[Click Me](https://tritan.gg/#premium)`)
      .addField(`Get Support`, `[Click Me](https://tritan.gg/support)`)

      .setColor(client.config.embeds.embed_color)
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
    return message.reply({ embeds: [premiumEmbed] });
  }  */

  if (command.nsfw && !message.channel.nsfw) {
    message.react(client.config.helpers.error_x);

    let nsfw = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp")
      .setTitle(`${client.config.helpers.error_x} Channel Not NSFW`)
      .setDescription(`You tried running a nsfw command in a sfw channel, please don't do it again.`)
      .setImage("https://i.imgur.com/oe4iK5i.gif")
      .setColor(client.config.embeds.embed_color)
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
    return message.channel.send({ embeds: [nsfw] });
  }

  if (!client.cooldowns.has(command.name)) {
    client.cooldowns.set(command.name, new Collection());
  }

  const now = Date.now();
  const timestamps = client.cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 5) * 1000;

  if (timestamps.has(message.author.id)) {
    if (!client.config.helpers.developer_ids.includes(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        let embed = new MessageEmbed()
          .setAuthor({
            name: `Tritan Bot`,
            iconURL: "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp"
          })
          .setTitle("Cooldown Alert")
          .addField("User", message.author.tag + ` (ID: ${message.author.id})`, true)
          .addField("Guild", message.guild.name + ` (ID: ${message.guild.id})`, true)
          .addField("Command", commandName, true)
          .addField("Cooldown", timeLeft.toString(), true)
          .setColor(client.config.embeds.embed_color)
          .setTimestamp();

        controlWebhook.send({
          username: "Tritan Alerts",
          avatarURL: "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp",
          embeds: [embed]
        });

        let embed2 = new MessageEmbed()
          .setAuthor({
            name: `Tritan Bot`,
            iconURL: "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp"
          })
          .setDescription(
            `You are currently on command cooldown, please wait \`${timeLeft}\` more seconds before reusing this command.`
          )
          .setTimestamp()
          .setColor(client.config.embeds.embed_color)
          .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL());

        return message.reply({ embeds: [embed2] });
      }
    }
  }

  if (!client.config.helpers.developer_ids.includes(message.author.id)) {
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
  }

  try {
    command.execute(message, args, client);
  } catch (error) {
    message.react(client.config.helpers.error_x);

    console.error(client.logger.redBright("[Command Error]"), error);

    client.functions.errorEmbed(message, commandName, errorWebhook, error);
  }

  client.functions.commandLog(message, commandName, commandLogWebhook);

  if (settings.autoCommandDeletion) {
    setTimeout(() => message.delete(), 10000);
  }
  message.react(client.config.helpers.check_mark);
};
