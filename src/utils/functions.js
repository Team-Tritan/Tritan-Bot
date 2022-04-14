let { MessageEmbed, WebhookClient, Permissions } = require("discord.js"),
  mongoose = require("mongoose"),
  quickdb = require("quick.db"),
  Levels = require("discord-xp"),
  fs = require("fs-extra"),
  ms = require("ms"),
  fetch = require("node-fetch"),
  LINK_PATTERN =
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/,
  DISCORD_INVITE_PATTERN =
    /(https?:\/\/)?(www.)?(discord.(gg|io|me|li|link|plus)|discorda?p?p?.com\/invite|invite.gg|dsc.gg|urlcord.cf)\/[^\s/]+?(?=\b)/;

// If you are reading this code - I'm so sorry

// ==================== Useful Functions ==================== //

/**
 * Checks if message was sent by a bot.
 * @param {Object} message
 */
function isBot(message) {
  if (message.author.bot) {
    return true;
  }
}

/** Does it contain a link?
 * @param {String} text
 */
function containsLink(text) {
  return LINK_PATTERN.test(text);
}

/** Is the link a discord invite?
 * @param {String} text
 */
function containsDiscordInvite(text) {
  return DISCORD_INVITE_PATTERN.test(text);
}

/**
 * Return a random integer
 * @param {Int} min
 * @param {Int} max
 * @returns Int
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 *
 * @returns Random 16 character string
 */
function generatePassword() {
  var length = 16,
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()",
    retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

/**
 * Returns capitalized sentance in string.
 * @param {String} string
 */
function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Shorten for Embeds
 * @param {String} text
 * @param {Integer} maxLen
 * @returns
 */
async function shorten(text, maxLen = 2000) {
  return text.length > maxLen ? `${text.substr(0, maxLen - 3)}...` : text;
}

/**
 * 8ball response generator
 * @returns 8ball command responses
 */
function doMagic8BallVoodoo() {
  var rand = ["Yes", "No", "Why are you even trying?", "What do you think? NO", "Maybe", "Never", "Yep"];

  return rand[Math.floor(Math.random() * rand.length)];
}

/**
 * Shuffle Array for Trivia
 * @param {*} array
 */
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

/**
 * Get Channel From Mention
 * @param {String} mention
 * @returns Channel ID
 */
function getChannelFromMention(mention) {
  if (!mention) return;

  if (mention.startsWith("<@") && mention.endsWith(">")) {
    mention.slice(2, -1);

    if (mention.startsWith("!")) {
      mention = mention.slice(1);
    }
  } else {
    return;
  }
}

/**
 * Sleep Function
 * @param {Integer} milliseconds
 */
function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

// ==================== Startup Functions ==================== //
/**
 * Set initial status
 * @param {Obj} client
 */
async function setStatusInitial(client) {
  console.log(client.logger.magenta("[Status Update]"), "Stats Updated for Status Loop");

  const promises = [
    client.shard.fetchClientValues("guilds.cache.size"),
    client.shard.broadcastEval((c) => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0))
  ];
  return Promise.all(promises).then((results) => {
    const totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
    const totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);

    client.user.setActivity(`*help | tritan.gg | ${client.shard.count} shards, ${totalMembers} users.`, {
      type: "WATCHING"
    });
    console.log(client.logger.magenta("[Status Update]"), "Initial Status Set");
  });
}

/**
 * Set Status Interval
 * @param {Object} client
 */
async function setStatusInterval(client) {
  setInterval(async () => {
    const promises = [
      client.shard.fetchClientValues("guilds.cache.size"),
      client.shard.broadcastEval((c) => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0))
    ];
    return Promise.all(promises).then((results) => {
      const totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
      const totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);

      let statusArray = [
        `*help | tritan.gg | ${client.shard.count} shards, ${totalMembers} users.`,
        `*help | tritan.gg | ${totalGuilds} servers, ${totalMembers} users.`,
        `is this real?`,
        `discord really out here getting uglier`,
        `${totalMembers} awesome people.`,
        `${totalMembers} cuties.`,
        `all the uwus`,
        `https://tritan.gg/invite`,
        `all the youtube drama.`,
        `all the twitter beef.`,
        `a dead server lol rip`,
        `over discord`,
        `the world burn`,
        `all the owos`,
        `cute humans`,
        `all the commands`,
        `https://tritan.gg/support`,
        `Jacob I miss you papi`,
        `If you are reading this- you have to use light mode for 5 minutes.`,
        `epicbot is my gf`,
        `bananananananabanabananabanannanabananananananananananananbananananbanananana`,
        `My sprinkler goes like thisstststststststststststststststststststststststst and comes back like ttttttttttttttttttttttttttttttttttttttte`,
        `my feelings get hurt`,
        `If you're reading this, you're gay now.`,
        `humanity go to shit`,
        `AI taking over`,
        `(づ￣ ³￣)づ`,
        `(・_・;)`,
        `~(>_<~)`,
        "╰(*´︶`*)╯",
        `i took a flight to spain but the s is silent`,
        `Remember when phones were stupid and people were smart? Good times`,
        `we've been trying to reach you about your cars extended warranty`,
        `u sus for reading this, but I love you`,
        `roses are red, the sun is shining; my mental health is severely declining`,
        `lets say, hypothetically, shawty is like a melody`,
        `water isnt wet`,
        `the only thing gamers can defend is their virginity oops`,
        `you're the reason soap has instructions`,
        `astrid is hot`,
        `scooby-doo is an alien, dm for details`,
        `relationships are temporary, but monke is forever`,
        `this toaster kinda hot tho`,
        `dot is very poggers`,
        `gimmie the sauce`,
        `i'm not a fan of you`,
        `no crafter I haven't...`
      ];
      let typeArray = ["WATCHING", "PLAYING", "LISTENING", "COMPETING"];

      const randomStatus = Math.floor(Math.random() * (statusArray.length - 1) + 1);
      const newActivity = statusArray[randomStatus];

      const randomType = Math.floor(Math.random() * (typeArray.length - 1) + 1);
      const newType = typeArray[randomType];

      client.user.setActivity(`${newActivity}`, {
        type: "WATCHING"
      });
    });
  }, 2 * 60000);
}

/**
 * Log amount of commands, slash, and events.
 */
function startupCollectionAmounts(client) {
  console.log(client.logger.green.underline(`${client.commands.size} commands loaded into memory.`));
  console.log(client.logger.green.underline(`${client.events.size} events loaded into memory.`));
  console.log(
    client.logger.green.underline(`${client.slashcommands.size} slash commands loaded into memory.`)
  );
}

/**
 * Update commands list in docs folder.
 */
function updateCommandsList(client) {
  const table = require("markdown-table");
  const commands = client.commands;
  const categories = [];
  commands.forEach((cmd) => {
    if (!categories.includes(cmd.category)) {
      categories.push(cmd.category);
    }
  });
  let text = `# Commands  \nHere's the list of Tritan Bot's commands. This one contains more than **${Math.floor(
    commands.size / 10
  )}0 commands** in **${
    categories.length
  } categories**!  \n\n#### Contents of the table  \n**Name**: The name of the command  \n**Description**: A brief explanation of the purpose of the command  \n**Usage**: The arguments/options that the command takes in parameters \n\n`;

  categories
    .sort(function (a, b) {
      const aCmdsLength = commands.filter((cmd) => cmd.category === a).length;
      const bCmdsLength = commands.filter((cmd) => cmd.category === b).length;
      return aCmdsLength > bCmdsLength ? -1 : 1;
    })
    .forEach((cat) => {
      const arrCat = [["Name", "Description", "Usage"]];
      const cmds = commands.filter((cmd) => cmd.category === cat);
      text += `### ${cat} (${cmds.length} commands)\n\n`;
      cmds
        .sort(function (a, b) {
          return a.name < b.name ? -1 : 1;
        })
        .forEach((cmd) => {
          arrCat.push([`**${cmd.name}**`, `${cmd.description}`, `${cmd.usage ? cmd.usage : "None"}`]);
        });
      text += `${table(arrCat)}\n\n`;
    });
  const fs = require("fs");
  if (fs.existsSync("../docs")) {
    fs.writeFileSync("../docs/commands.md", text);
    console.log(client.logger.blue("[Startup]"), "Command list updated!");
  }
}

/**
 * Clear Temp Directory
 * @param {Obj} client
 */
async function clearTempDirectory(client) {
  let dir = "./tmp";

  // With Promises:
  fs.emptyDir(dir)
    .then(() => {
      console.log(client.logger.blue("[Startup]"), "Temp directory cleared!");
    })
    .catch((err) => {
      console.log(client.logger.red("[Startup]"), "Error clearing temp directory!", err);
    });
}

// ==================== Database Reminder Functions ==================== //
/**
 * Check Reminders & Send
 * @param {Obj} client
 */
async function checkReminders(client) {
  setInterval(async function () {
    const reminder = await client.models.reminders
      .find({
        active: true
      })
      .catch((err) => console.error(err));

    if (!reminder) return;

    reminder.forEach(async (x) => {
      const time = x.reminderTime;
      const timeLeft = time - Date.now();

      if (timeLeft < 10 && x.voteReminder && !x.bumpReminder) {
        let isInCache = client.users.cache.get(x.authorID);
        if (!isInCache) {
          return;
        }

        console.log(client.logger.blue("[Reminders] Processing Vote Reminder, ID " + x.id));
        let embed = new MessageEmbed()
          .setAuthor({
            name: `Tritan Bot`,
            iconURL: "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp"
          })
          .setThumbnail(`http://cdn.tritan.gg/tritan-bot/timer-thumbnail.png`)
          .setColor(client.config.embeds.embed_color)
          .setTitle(`You can vote again!`)
          .setDescription(
            `Thank you so much for your support, we're just messaging to remind you that you're able to vote on top.gg again as 12 hours has passed.\n\n[Click here to vote!](https://top.gg/bot/732783297872003114/vote)`
          )
          .setTimestamp();
        return client.users.cache
          .get(x.authorID)
          .send({ embeds: [embed] })
          .catch((err) => console.error(err))
          .then(async () => {
            console.log(client.logger.blue("[Reminders] Vote Reminder Sent, ID " + x.id));
            await x
              .updateOne({
                active: false
              })
              .catch((err) => console.error(err));
            return console.log(console.log(client.logger.blue("[Reminders] Vote Reminder, ID " + x.id)));
          });
      }

      const isInCache = await client.users.fetch(x.authorID);
      if (!isInCache) return;

      if (timeLeft < 10 && !x.bumpReminder) {
        console.log(client.logger.blue("[Reminders] Processing Normal Reminder"));
        let duser = await client.users.fetch(x.authorID);
        const embed = new MessageEmbed()
          .setAuthor({
            name: `Tritan Bot`,
            iconURL: "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp"
          })
          .setThumbnail(`http://cdn.tritan.gg/tritan-bot/timer-thumbnail.png`)
          .setColor(client.config.embeds.embed_color)
          .setTitle(`Reminder Up!`)
          .setDescription(`You had asked me to remind you about \`${x.reminderText}\`.`)
          .setTimestamp()
          .setFooter(`Requested by ${x.authorTag}`, duser.displayAvatarURL());

        try {
          await client.channels.cache
            .get(x.reminderChannelID)
            .send({ content: `<@!${x.authorID}>`, embeds: [embed] })
            .then(async () => {
              console.log(client.logger.blue("[Reminders] Normal Reminder Sent"));
              await x
                .updateOne({
                  active: false
                })
                .catch((err) => console.error(err));
              console.log(client.logger.blue("[Reminders] Normal Reminder Disabled, ID " + x.id));
            });
        } catch {
          return client.users.cache
            .get(x.authorID)
            .send({ content: `Failed to send this message in <#${x.reminderChannelID}>.`, embeds: [embed] })
            .then(async () => {
              console.log(client.logger.blue("[Reminders] Normal Reminder Sent, ID " + x.id));
              await x
                .updateOne({
                  active: false
                })
                .catch((err) => console.error(err));
              console.log(client.logger.blue("[Reminders] Normal Reminder Disabled, ID " + x.id));
            });
        }
      }

      if (timeLeft < 10 && x.bumpReminder) {
        console.log(client.logger.blue("[Reminders] Processing Bump Reminder"));
        let embed = new MessageEmbed()
          .setAuthor({
            name: `Tritan Bot`,
            iconURL: "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp"
          })
          .setTitle(
            "It's been two hours, you should be able to bump the server again (unless someone else already has)."
          )
          .setTimestamp()
          .setColor(client.config.embeds.embed_color);

        try {
          await client.channels.cache
            .get(x.reminderChannelID)
            .send({ content: `<@!${x.authorID}>`, embeds: [embed] })
            .catch((err) => console.error(err))
            .then(async () => {
              console.log(client.logger.blue("[Reminders] Bump Reminder Sent, ID " + x.id));
              await x
                .updateOne({
                  active: false
                })
                .catch((err) => console.error(err));
              console.log(client.logger.blue("[Reminders] Bump Reminder Disabled, ID " + x.id));
            });
        } catch {
          await client.users.cache
            .get(x.authorID)
            .send({ content: `Failed to send this message in <#${x.reminderChannelID}>.`, embeds: [embed] })
            .then(async () => {
              console.log(client.logger.blue("[Reminders] Bump Reminder Sent, ID " + x.id));
              await x
                .updateOne({
                  active: false
                })
                .catch((err) => console.error(err));
              console.log(client.logger.blue("[Reminders] Bump Reminder Disabled, ID " + x.id));
            });
        }
      }
    });
  }, 10000);
}

// ==================== Depreciated Functions ==================== //
/**
 * LEGACY Auto Mod: Anti Invite
 * @param {Object} message
 * @param {DB Object} settings
 * @param {Object} client
 */
async function antiInvite(message, settings, client) {
  //let channelID = message.channel.id;
  if (!settings.antiInvite || message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return;

  // Whitelist by Channel ID
  //if (settings.antiInviteChannelWhitelist.includes(channelID)) return;

  // Whitelist by invite code
  // if (message.content.includes(settings.antiInviteCodeWhitelist)) return;

  let rar = [
    /d\s*?i\s*?s\s*?c\s*?o\s*?r\s*?d\s*?(?:a\s*?p\s*?p\s*?|)[^]{0,3}?\s*?c\s*?o\s*?m\s*?[^]{0,3}?(?:i\s*?n\s*?v\s*?i\s*?t\s*?e|c\s*?o\s*?d\s*?e)[^]{0,3}?[\w ]{2,}/g,
    /d\s*?i\s*?s\s*?c\s*?o\s*?r\s*?d\s*?[^]{0,3}?\s*?g\s*?g\s*?[^]{0,3}?(?:i\s*?n\s*?v\s*?i\s*?t\s*?e|c\s*?o\s*?d\s*?e|)[^]{0,3}?[\w ]{2,}/g
  ];
  let isInvite = false;
  for (let regex of rar) if (regex.test(message.content)) isInvite = true;

  if (isInvite && (await message.delete().catch(() => {}))) {
    let embed = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp")
      .setTitle(`🚨 Member Warning`)
      .setColor(message.client.config.embeds.embed_color)
      .setThumbnail(message.author.avatarURL)
      .addField("Member:", `${message.author.tag} (ID: ${message.author.id})`)
      .addField("Moderator:", `Tritan Bot: Auto Mod`)
      .addField("Time:", message.createdAt)
      .addField("Reason:", `Posted an invite link in ${message.channel.name}:\n${message.content}`)
      .setTimestamp()
      .setFooter(`${message.guild.name}`, message.guild.iconURL());
    if (settings.appeal_link) {
      embed.addField("Appeal Infraction:", `${settings.appeal_link}`);
    }
    message.author.send({ embeds: [embed] });

    const log_channel = await message.client.channels.fetch(settings.event_logs);
    log_channel.send({ embeds: [embed] });

    const newInfraction = new message.client.models.infractions({
      _id: mongoose.Types.ObjectId(),
      GuildID: message.guild.id,
      GuildName: message.guild.name,
      TargetID: message.author.id,
      TargetTag: message.author.tag,
      ModeratorID: "Tritan Bot: Auto Mod",
      ModeratorTag: "Tritan Bot: Auto Mod",
      InfractionType: "Warning",
      Reason: `Posted an invite link in ${message.channel.name}: ${message.content}`,
      Time: message.createdAt
    });
    newInfraction
      .save()
      .then((result) => console.log(result))
      .catch((err) => console.error(err));
  }
}

// ==================== Legacy Automod Functions ==================== //

/**
 * Counting Channel Moderation
 * @param {Object} message
 * @param {Object} client
 * @param {DB Object} settings
 */
async function countManager(message, client, settings) {
  if (message.channel.id === settings.countingChannel) {
    if (message.content.startsWith(settings.prefix)) return;
    const lastNumber = await settings.countingLastNumber;

    // Incorrect Number
    if (parseInt(message.content) !== lastNumber + 1) {
      message.react(client.config.helpers.error_x);

      await settings.updateOne({
        countingLastNumber: 0
      });

      // Cant count role
      if (settings.cantCountRole) {
        client.guilds.cache
          .get(settings.guildID)
          .members.cache.get(message.author.id)
          .roles.add(settings.cantCountRole);
      }

      let fuckUp = new MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setDescription(`This loser messed up the count, the next number is 1.`)
        .setColor(message.client.config.embeds.embed_color);
      return message.channel.send({ embeds: [fuckUp] });
    }
    // Correct Number
    if (parseInt(message.content) == lastNumber + 1) {
      message.react(client.config.helpers.check_mark);

      settings.countingLastNumber += 1;
      settings.save().catch((error) => console.error(error));
    }
  }
}

/**
 * Auto Message Deletion
 * @param {Object} message
 * @param {DB Object} settings
 */
async function autoDelete(message, settings) {
  if (settings.auto_delete_channel) {
    if (
      message.channel.id === settings.auto_delete_channel &&
      !message.content.includes(settings.auto_delete_keyword)
    ) {
      setTimeout(() => {
        message.delete();
      }, 1000);
    }
  }
}

// ==================== Command Response Functions ==================== //
/**
 * Mention Reponse
 * @param {Object} message
 * @param {Object} settings
 * @param {Object} client
 */
function mentionRegex(message, settings, client) {
  const mentionRegexStuff = RegExp(`^<@!?${message.client.user.id}>$`);
  if (message.content.match(mentionRegexStuff)) {
    const uwu = `\`\`\`css\n${settings.prefix}\`\`\``;
    const fuckmejacob = `\`\`\`css\n${settings.prefix}help\`\`\``;
    const owo = `\`\`\`css\n@${message.client.user.tag}\`\`\``;
    const hehe = `\`\`\`css\n@${message.client.user.tag} help\`\`\``;

    const embed = new MessageEmbed()
      .setAuthor(`Tritan Bot`, "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp")
      .setTitle("Hi there, I'm Tritan Bot! :p")
      .addField(`Legacy Prefix`, uwu, false)
      .addField(`Legacy Usage`, fuckmejacob, false)
      .addField(`Mention Prefix`, owo, false)
      .addField(`Mention Usage`, hehe, false)
      .setDescription(
        `\nIf you like me, please consider [voting](https://tritan.gg/vote), or [inviting](https://tritan.gg/invite) me to your server! Thank you for using Tritan, we hope you enjoy it, as we always look forward to improve the bot.`
      )
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setColor(client.config.embeds.embed_color);
    message.channel.send({ embeds: [embed] });
  }
}

/**
 * Custom Commands
 * @param {Obj} message
 * @param {Obj} client
 * @param {DB Obj} settings
 * @param {String} commandName
 */
async function customCommands(message, client, settings, commandName) {
  const thisCommand = await client.models.cc.findOne({
    guildID: message.guild.id,
    name: commandName
  });
  if (!thisCommand) return;

  if (thisCommand) {
    message.react(client.config.helpers.check_mark);
    setTimeout(() => {
      message.delete();
    }, 1000);
    return message.channel.send(thisCommand.response);
  }
}

/**
 * Command Counter
 * @param {Object} client
 * @param {String} commandName
 */
async function commandCount(client, commandName) {
  client.models.commands
    .findOne({
      commandName: commandName
    })
    .then(async (c) => {
      if (!c) {
        const newCommand = new client.models.commands({
          commandName: commandName,
          timesUsed: 0
        });
        await newCommand.save().catch((e) => client.log(e));
        c = await client.models.commands.findOne({
          commandName: commandName
        });
      }
      c.timesUsed += 1;
      await c.save().catch((e) => client.log(e));
    });
}

/**
 * Command Use Logs
 * @param {Object} message
 * @param {Object} client
 * @param {String} commandName
 * @param {Constant} commandLogWebhook
 */
async function commandLog(message, commandName, commandLogWebhook) {
  console.log(
    message.client.logger.blue("[Legacy Command Ran]"),
    `${commandName} was run by ${message.author.tag}.`
  );

  let commandLog = new MessageEmbed()
    .setAuthor(`📘 Command Logs`, "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp")
    .addField("Command", `${commandName}`, true)
    .addField("Shard", `${message.guild.shardId}`, true)
    .addField("Author", `${message.author.tag} (${message.author.id})`, false)
    .addField("Guild", `${message.guild.name} (${message.guild.id})`, false)
    .setColor(message.client.config.embeds.embed_color)
    .setTimestamp();
  commandLogWebhook.send({
    username: "Tritan Alerts",
    avatarURL: "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp",
    embeds: [commandLog]
  });
}

// ==================== Error Response Functions ==================== //
/**
 * Error Reply Embeds
 * @param {Object} message
 * @param {String} commandName
 */
async function errorEmbed(message, commandName, errorWebhook, error) {
  let errorEmbed = new MessageEmbed()
    .setAuthor(`Tritan Bot`, "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp")
    .setDescription(
      "This command did not run successfully, please run `*support` to tell a developer in my support server."
    )
    .addField("Command Name:", `${commandName}`)
    .addField("Error Debugging:", `${error}`)
    .addField("Guild Name:", `${message.guild.name}`)
    .addField("Guild ID:", `${message.guild.id}`)
    .addField("Channel Name:", `${message.channel.name}`)
    .addField("Channel ID:", `${message.channel.id}`)
    .addField("Message Author:", `${message.author}`)
    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
    .setTimestamp()
    .setColor("#FFFF00");

  message.reply({ embeds: [errorEmbed] });

  errorWebhook.send({
    username: "Tritan Errors",
    avatarURL: "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp",
    embeds: [errorEmbed]
  });
}

/**
 * DM Handler
 * @param {Obj} message
 * @param {Obj} client
 * @param {Obj} controlWebhook
 */
async function dmHandler(message, client, controlWebhook) {
  if (message.channel.type == "DM") {
    let embed = new MessageEmbed()
      .setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())
      .setTitle("DM Received:")
      .addField(`Member:`, `<@!${message.author.id}> (${message.author.id})`)
      .addField("Message:", message.content || "N/A", false);
    if (message.attachments.first()) {
      embed.setImage(message.attachments.first().url);
    }
    embed.setTimestamp().setColor(client.config.embeds.embed_color);
    controlWebhook.send({
      username: "Tritan Bot",
      avatarURL: "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp",
      embeds: [embed]
    });

    let embedReply = new MessageEmbed()
      .setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())
      .setTitle("DM Received:")
      .setDescription(
        "Hi there! Sadly you can't run commands in the DMs. Also note that any messages you have sent will be sent to my developers, not the guild that may have issued an infraction."
      )
      .addField("Bot Support", "[Click Here](https://tritan.gg/support)")
      .setTimestamp()
      .setColor(client.config.embeds.embed_color);
    return message.reply({ embeds: [embedReply] });
  }
}

/**
 * Blacklist Check
 * @param {Object} message
 * @param {Object} settings
 * @param {Object} controlWebhook
 * @param {Object} client
 */
function blacklistCheck(message, settings, controlWebhook, client) {
  if (settings.is_blacklisted) {
    message.channel.send("...why am I in a blacklisted guild?");

    message.guild.leave();

    let embed = new MessageEmbed()
      .setAuthor(message.guild.name, message.guild.iconURL())
      .setTitle(`❌ Left Blacklisted Guild`)
      .addField(`Server Name:`, message.guild.name, false)
      .addField(`Guild ID:`, message.guild.id, false)
      .addField(`Guild Member Count:`, message.guild.memberCount, false)
      .addField(`Shard:`, message.guild.shardId, false)
      .setColor(client.config.embed.embed_color)
      .setTimestamp()
      .setFooter("Tritan Bot");

    controlWebhook.send({
      username: "Tritan Bot",
      avatarURL: "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp",
      embeds: [embed]
    });
  }
}

/**
 * Message Count by User
 * @param {Object} client
 * @param {Object} message
 * @param {Constant} mongoose
 */
async function memberMessageCount(client, message) {
  const memberMessages = await client.models.messages.findOne({
    guildID: message.guild.id,
    userID: message.author.id
  });

  if (!memberMessages) {
    const newMember = new client.models.messages({
      _id: mongoose.Types.ObjectId(),
      guildID: message.guild.id,
      userID: message.author.id,
      messageCount: 1
    });
    newMember.save().catch((error) => console.error(error));
  }

  if (memberMessages) {
    memberMessages.messageCount += 1;
    memberMessages.save().catch((error) => console.error(error));
  }
}

/**
 * AFK Check
 * @param {Object} message
 * @param {Object} client
 */
async function afkCheck(message, client) {
  let afk = new quickdb.table("AFKs");
  let mentioned = message.mentions.members.first();
  if (mentioned) {
    let status = await afk.fetch(mentioned.id);
    if (status) {
      const AFKembed = new MessageEmbed()
        .setAuthor({
          name: `Tritan Bot`,
          iconURL: "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp"
        })
        .setColor(message.client.config.embeds.embed_color)
        .setDescription(`The user mentioned above (${mentioned.user.tag}) is in AFK mode.`)
        .addField(`Reason:`, `**${status}**`)
        .setTimestamp()
        .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL());
      message.channel.send({ embeds: [AFKembed] }).catch(console.error);
    }
  }
  if (afk) {
    const status = new quickdb.table("AFKs");
    let afk = await status.fetch(message.author.id);
    if (afk) {
      const embed = new MessageEmbed()
        .setAuthor({
          name: `Tritan Bot`,
          iconURL: "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp"
        })
        .setDescription("You are no longer in AFK mode.")
        .setTimestamp()
        .setColor(message.client.config.embeds.embed_color)
        .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL());
      message.channel.send({ content: `<@!${message.author.id}>`, embeds: [embed] });
      status.delete(message.author.id);
    }
  }
}

/**
 * Level Up Messages
 * @param {Object} message
 * @param {Object} client
 * @param {DB Object} settings
 */
async function levelUpMessages(message, client, settings) {
  const randomAmountOfXp = Math.floor(Math.random() * 29) + 1; // Min 1, Max 30
  const hasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, randomAmountOfXp);
  if (settings.rank_channel) {
    if (hasLeveledUp) {
      const user = await Levels.fetch(message.author.id, message.guild.id);
      const embed = new MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setDescription(`\`${message.author.tag}\` has leveled up to rank **${user.level}**. :tada:`)
        .setColor(client.config.embeds.embed_color);

      const thisWebhook = await client.models.webhooks.findOne({
        guildID: settings.guildID,
        channelID: settings.rank_channel
      });

      if (thisWebhook) {
        const webhookClient = new WebhookClient({
          id: thisWebhook.webhookID,
          token: thisWebhook.webhookSecret
        });

        try {
          return await webhookClient.send({
            username: "Tritan Bot",
            avatarURL: "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp",
            embeds: [embed]
          });
        } catch {
          return await client.models.webhooks.findOneAndDelete({
            guildID: settings.guildID,
            channelID: settings.rank_channel
          });
        }
      }
    }
  }
}

/**
 * Bump Reminders
 * @param {Object} message
 * @param {Object} client
 * @param {DB Object} settings
 */
async function bumpReminder(message, client, settings) {
  if (!settings.disabledBumpReminders) {
    if (message.content == "!d bump") {
      await message.guild.members.fetch("302050872383242240");
      const Disboard = message.guild.members.cache.get("302050872383242240");
      if (!Disboard) return;

      const already = await message.client.models.reminders.findOne({
        active: true,
        bumpReminder: true,
        guildID: message.guild.id
      });

      if (already) {
        if (already.authorID == message.author.id) {
          return;
        }

        const newReminder = new message.client.models.reminders({
          _id: mongoose.Types.ObjectId(),
          active: true,
          authorTag: message.author.tag,
          authorID: message.author.id,
          guildID: message.guild.id,
          reminderChannelID: message.channel.id,
          reminderTime: already.reminderTime,
          reminderText: "Bump reminder",
          bumpReminder: true
        });
        newReminder.save();
        return message
          .reply(
            "There is already an active bump reminder in this server, you have been added to the reminder list."
          )
          .then((m) => setTimeout(() => m.delete(), 10000));
      }

      let time = "2h";

      const newReminder = new message.client.models.reminders({
        _id: mongoose.Types.ObjectId(),
        active: true,
        authorTag: message.author.tag,
        authorID: message.author.id,
        guildID: message.guild.id,
        reminderChannelID: message.channel.id,
        reminderTime: Date.now() + ms(time),
        reminderText: "Bump reminder",
        bumpReminder: true
      });
      newReminder.save();

      let bumpEmbed = new MessageEmbed()
        .setAuthor({
          name: `Tritan Bot`,
          iconURL: "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp"
        })
        .setTitle("Thanks for your support! I'll remind you once you can bump again.")
        .setTimestamp()
        .setColor(message.client.config.embeds.embed_color);
      message.channel.send({ content: `<@!${message.author.id}>`, embeds: [bumpEmbed] });
    }
  }
}

/**
 * Mass Mention Logs
 * @param {Object} message
 * @param {Object} client
 * @param {DB Object} settings
 */
async function massMentionLog(message, client, settings) {
  if (message.mentions.everyone || message.mentions.roles.first()) {
    let embed = new MessageEmbed()
      .setAuthor(message.author.tag, message.author.avatarURL())
      .setColor(client.config.embeds.embed_color)
      .setTitle("📣 Mass Ping")
      .addField(`Author:`, message.author.tag)
      .addField(`Sent Message:`, message.toString())
      .addField("Channel:", "<#" + message.channel + "> (" + message.channel.name + ")")
      .setTimestamp()
      .setFooter("ID: " + message.author.id);

    const thisWebhook = await client.models.webhooks.findOne({
      guildID: settings.guildID,
      channelID: settings.event_logs
    });

    if (thisWebhook) {
      const webhookClient = new WebhookClient({
        id: thisWebhook.webhookID,
        token: thisWebhook.webhookSecret
      });

      try {
        return await webhookClient.send({
          username: "Tritan Bot",
          avatarURL: "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp",
          embeds: [embed]
        });
      } catch {
        return await client.models.webhooks.findOneAndDelete({
          guildID: settings.guildID,
          channelID: settings.event_logs
        });
      }
    }
  }
}

/**
 * Deploy Slash Commands
 * @param {Obj} client
 */
async function deploySlashCommands(client) {
  try {
    await client.application.commands.set(client.slashDiscordData);
  } catch (e) {
    console.log(client.logger.red("[Deploy]"), "Error deploying slash commands!", e);
  }
  console.log(client.logger.magenta("[Deploy]"), "Slash commands deployed.");
}

/**
 * LEGACY Anti Link
 * @param {Obj} message
 * @param {Db Obj} settings
 * @returns
 */
async function antiLinkSpam(message, settings) {
  if (settings.antiInvite) {
    if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
      if (message.content.includes("https://" || "http://")) {
        message.delete();

        let embed = new MessageEmbed()
          .setAuthor(message.author.tag, message.author.avatarURL())
          .setColor(message.client.config.embeds.embed_color)
          .setTitle("📣 Anti-Link Spam")
          .setDescription("You are not allowed to post links in this server.")
          .setFooter(`Sent by: ${message.author.tag}`, message.author.displayAvatarURL());

        message.channel.send({ embeds: [embed] });
        message.author.send({ embeds: [embed] });

        await new message.client.models.infractions({
          _id: mongoose.Types.ObjectId(),
          GuildID: message.guild.id,
          TargetID: message.author.id,
          TargetTag: message.author.tag,
          ModeratorID: message.client.user.id,
          ModeratorTag: message.client.user.tag,
          Reason: `Link Spam Posted - ${message.content}`,
          Date: message.createdAt
        }).save();

        if (settings.event_logs) {
          let embed = new MessageEmbed()
            .setAuthor(message.author.tag, message.author.avatarURL())
            .setColor(message.client.config.embeds.embed_color)
            .setTitle("📣 Anti-Link Spam:")
            .addField("User:", `${message.author.tag}`, true)
            .addField("Channel:", `${message.channel.name}`, true)
            .addField("Message:", `${message.content}`, true)
            .setFooter(`Sent by: ${message.author.tag}`, message.author.displayAvatarURL())
            .setTimestamp()
            .setFooter("ID: " + message.author.id);

          const thisWebhook = await message.client.models.webhooks.findOne({
            guildID: settings.guildID,
            channelID: settings.event_logs
          });

          if (thisWebhook) {
            const webhookClient = new WebhookClient({
              id: thisWebhook.webhookID,
              token: thisWebhook.webhookSecret
            });

            try {
              return await webhookClient.send({
                username: "Tritan Bot",
                avatarURL: "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp",
                embeds: [embed]
              });
            } catch {
              return await message.client.models.webhooks.findOneAndDelete({
                guildID: settings.guildID,
                channelID: settings.event_logs
              });
            }
          }
        }
      }
    }
  }
}

/**
 * Permissions Reminder Message
 * @param {Obj} message
 * @param {Obj} client
 * @returns
 */
async function permissionsCheck(message, client) {
  if (!message.guild.me.permissions.has("536870252279")) {
    let embed = new MessageEmbed()
      .setAuthor(client.config.embeds.authorName, client.config.embeds.authorIcon)
      .setTitle("Missing Permissions")
      .setDescription(
        "I require the following permissions to execute all of my commands and functions. Due to the current permisisons I have, some things may not work correctly. This message will self-delete in 15 seconds."
      )
      .addField(
        "Required Permissions",
        "`VIEW_AUDIT_LOG`, `MANAGE_SERVER`, `MANAGE_ROLES`, `MANAGE_CHANNELS`, `KICK_MEMBERS`, `BAN_MEMBERS`, `CREATE_INSTANT_INVITE`, `CHANGE_NICKNAME`, `MANAGE_NICKNAMES`, `MANAGE_EMOJIS_AND_STICKERS`, `MANAGE_WEBHOOKS`, `VIEW_CHANNELS`, `SEND_MESSAGES`, `PUBLIC_THREADS`, `PRIVATE_THREADS`, `SEND_MESSAGES_IN_THREADS`, `MANAGE_MESSAGES`, `MANAGE_THREADS`, `EMBED_LINKS`, `ATTACH_FILES`, `READ_MESSAGE_HISTORY`, `USE_EXTERNAL_EMOJIS`, `USE_EXTERNAL_STICKERS`, `ADD_REACTIONS`, `USE_SLASH_COMMANDS`, `CONNECT`, `SPEAK`, `VIDEO`, `MUTE_MEMBERS`, `DEAFEN_MEMBERS`, `MOVE_MEMBERS`, `USE_VOICE_ACTIVITY`",
        true
      )
      .addField(
        "How to fix permissions?",
        "To fix the following permissions error, you can run the `*invite` or `/invite` command to reinvite the bot with the correct permissions. You can also allow these permissions by editing the role permissions for your bot's role, or my specific role. The permissions integer required is `536870252279`."
      )
      .addField(
        "Reinvite Links for Permission Fixes",
        `[Reinvite with Admin Permissions](https://discord.com/api/oauth2/authorize?client_id=732783297872003114&permissions=8&redirect_uri=https%3A%2F%2Ftritan.gg%2Fauth%2Fcallback&scope=bot%20applications.commands) | [Reinvite with Specific Permissions](https://discord.com/api/oauth2/authorize?client_id=732783297872003114&permissions=536870252279&redirect_uri=https%3A%2F%2Ftritan.gg%2Fauth%2Fcallback&scope=bot%20applications.commands)`
      )
      .setThumbnail(message.guild.iconURL())
      .setColor(client.config.embeds.embed_color)
      .setFooter(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp();

    return message.channel.send({ embeds: [embed] }).then((m) => setTimeout(() => m.delete(), 15000));
  }
}

/**
 * Thank You Counter Handler
 */
async function thanksuwu(message, client) {
  if (
    message.content.includes("thank") ||
    message.content.includes("Thank") ||
    message.content.includes("THANK") ||
    (message.content.includes("thx") && message.mentions.users.first())
  ) {
    let mentionID = message.mentions.users.first().id;

    let x = await client.models.thanks.findOne({ userID: mentionID });

    if (!x) {
      const newUser = new client.models.thanks({
        _id: mongoose.Types.ObjectId(),
        userID: mentionID,
        thanks: 1
      }).save();

      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setAuthor({
              name: message.client.config.embeds.authorName,
              iconURL: message.client.config.embeds.authorIcon
            })
            .setColor(message.client.config.embeds.embed_color)
            .setTimestamp()

            .setTitle(`${client.config.helpers.heawt} Thank you!`)
            .setThumbnail(message.mentions.users.first().displayAvatarURL())
            .setDescription(`<@${mentionID}>, thank you for being so rad!`)
            .setFooter(`This person has been thanked 1 time.`)
        ]
      });
    } else if (x) {
      x.thanks += 1;
      x.save();

      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setAuthor({
              name: message.client.config.embeds.authorName,
              iconURL: message.client.config.embeds.authorIcon
            })
            .setColor(message.client.config.embeds.embed_color)
            .setTimestamp()
            .setTitle(`${client.config.helpers.heawt} Thank you!`)
            .setThumbnail(message.mentions.users.first().displayAvatarURL())
            .setDescription(`<@${mentionID}>, thank you for being so rad!`)
            .setFooter(`This person has been thanked ${x.thanks} times.`)
        ]
      });
    }
  }
}

// ==================== AUTO MOD ==================== //

/**
 * Check if the message needs to be moderated and has required permissions
 * @param {Message} message
 */
const shouldModerate = (message) => {
  const { member, guild, channel } = message;

  // Ignore if bot cannot delete channel messages
  if (!channel.permissionsFor(guild.me).has("MANAGE_MESSAGES")) return false;

  // Ignore Possible Guild Moderators
  if (member.permissions.has(["KICK_MEMBERS", "BAN_MEMBERS", "MANAGE_GUILD"])) return false;

  // Ignore Possible Channel Moderators
  if (channel.permissionsFor(message.member).has("MANAGE_MESSAGES")) return false;
  return true;
};

/**
 * Perform moderation on the message
 * @param {Message} message
 */
async function performAutomod(message, settings, client) {
  if (!settings) return;
  const { automod } = settings;

  if (!shouldModerate(message)) return;

  const { channel, content, author, mentions } = message;
  const logChannel = settings.event_logs ? channel.guild.channels.cache.get(settings.event_logs) : null;

  let shouldDelete = false;
  let strikesTotal = 0;

  const embed = new MessageEmbed();

  // Max mentions
  if (mentions.members.size > automod.max_mentions) {
    embed.addField("Mentions", mentions.members.size.toString(), true);
    strikesTotal += mentions.members.size - automod.max_mentions;
    await client.models
      .infractions({
        _id: mongoose.Types.ObjectId(),
        GuildID: message.guild.id,
        GuildName: message.guild.name,
        TargetID: message.author.id,
        TargetTag: message.author.tag,
        ModeratorID: "Tritan Bot: Auto Mod",
        ModeratorTag: "Tritan Bot: Auto Mod",
        InfractionType: "Warning",
        Reason: `Mentioned more than ${automod.max_mentions} users in #${message.channel.name}: ${message.content}`,
        Time: message.createdAt
      })
      .save();
  }

  // Maxrole mentions
  if (mentions.roles.size > automod.max_role_mentions) {
    embed.addField("RoleMentions", mentions.roles.size.toString(), true);
    strikesTotal += mentions.roles.size - automod.max_role_mentions;
    await client.models
      .infractions({
        _id: mongoose.Types.ObjectId(),
        GuildID: message.guild.id,
        GuildName: message.guild.name,
        TargetID: message.author.id,
        TargetTag: message.author.tag,
        ModeratorID: "Tritan Bot: Auto Mod",
        ModeratorTag: "Tritan Bot: Auto Mod",
        InfractionType: "Warning",
        Reason: `Mentioned more than ${automod.max_role_mentions} roles in #${message.channel.name}: ${message.content}`,
        Time: message.createdAt
      })
      .save();
  }

  // Max Lines
  if (automod.max_lines > 0) {
    const count = content.split("\n").length;
    if (count > automod.max_lines) {
      embed.addField("New Lines", count.toString(), true);
      strikesTotal += Math.ceil((count - automod.max_lines) / automod.max_lines);
      await client.models
        .infractions({
          _id: mongoose.Types.ObjectId(),
          GuildID: message.guild.id,
          GuildName: message.guild.name,
          TargetID: message.author.id,
          TargetTag: message.author.tag,
          ModeratorID: "Tritan Bot: Auto Mod",
          ModeratorTag: "Tritan Bot: Auto Mod",
          InfractionType: "Warning",
          Reason: `Exceeded more than ${automod.nax_lines} lines in #${message.channel.name}: ${message.content}`,
          Time: message.createdAt
        })
        .save();
    }
  }

  // Anti links
  if (automod.anti_links) {
    if (containsLink(content)) {
      embed.addField("Links Found", true);
      shouldDelete = true;
      strikesTotal += 1;
      await client.models
        .infractions({
          _id: mongoose.Types.ObjectId(),
          GuildID: message.guild.id,
          GuildName: message.guild.name,
          TargetID: message.author.id,
          TargetTag: message.author.tag,
          ModeratorID: "Tritan Bot: Auto Mod",
          ModeratorTag: "Tritan Bot: Auto Mod",
          InfractionType: "Warning",
          Reason: `Links found in #${message.channel.name}: ${message.content}`,
          Time: message.createdAt
        })
        .save();
    }
  }

  // Anti Scam
  if (!automod.anti_links && automod.anti_scam) {
    if (containsLink(content)) {
      const key = message.author.id + "|" + message.guildId;
      if (message.client.antiScamCache.has(key)) {
        let antiScamInfo = message.client.antiScamCache.get(key);
        if (
          antiScamInfo.channelId !== message.channelId &&
          antiScamInfo.content === content &&
          Date.now() - antiScamInfo.timestamp < 2000
        ) {
          embed.addField("AntiScam Found", message.client.config.helpers.check_mark, true);
          shouldDelete = true;
          strikesTotal += 1;
          await client.models
            .infractions({
              _id: mongoose.Types.ObjectId(),
              GuildID: message.guild.id,
              GuildName: message.guild.name,
              TargetID: message.author.id,
              TargetTag: message.author.tag,
              ModeratorID: "Tritan Bot: Auto Mod",
              ModeratorTag: "Tritan Bot: Auto Mod",
              InfractionType: "Warning",
              Reason: `Anti-scam message found in #${message.channel.name}: ${message.content}`,
              Time: message.createdAt
            })
            .save();
        }
      } else {
        let antiScamInfo = {
          channelId: message.channelId,
          content,
          timestamp: Date.now()
        };
        message.client.antiScamCache.set(key, antiScamInfo);
      }
    }
  }

  // Anti Invites
  if (!automod.anti_links && automod.anti_invites) {
    if (containsDiscordInvite(content)) {
      embed.addField("Discord Invites", message.client.config.helpers.check_mark, true);
      shouldDelete = true;
      strikesTotal += 1;
      await client.models
        .infractions({
          _id: mongoose.Types.ObjectId(),
          GuildID: message.guild.id,
          GuildName: message.guild.name,
          TargetID: message.author.id,
          TargetTag: message.author.tag,
          ModeratorID: "Tritan Bot: Auto Mod",
          ModeratorTag: "Tritan Bot: Auto Mod",
          InfractionType: "Warning",
          Reason: `Discord invite found in #${message.channel.name}: ${message.content}`,
          Time: message.createdAt
        })
        .save();
    }
  }

  if (shouldDelete || strikesTotal > 0) {
    // delete message if deletable
    if (shouldDelete && message.deletable)
      message
        .delete()
        .then(async (_) => {
          const sentMsg = await message.channel.send({
            embeds: [
              new MessageEmbed()
                .setAuthor({
                  name: message.client.config.embeds.authorName,
                  iconURL: message.client.config.embeds.authorIcon
                })
                .setColor(message.client.config.embeds.embed_color)
                .setTimestamp()

                .setTitle("Auto Moderation")
                .setDescription("A message has been deleted per the auto-mod policy for this server.")
            ]
          });
          if (sentMsg?.deletable) setTimeout(() => sentMsg.delete().catch(() => {}), 5000);
        })
        .catch((ex) => {});

    // send automod log

    logChannel.send({
      embeds: [
        new MessageEmbed()
          .setAuthor({
            name: message.client.config.embeds.authorName,
            iconURL: message.client.config.embeds.authorIcon
          })
          .setColor(message.client.config.embeds.embed_color)
          .setTimestamp()

          .setTitle("Auto Moderation")
          .setThumbnail(author.avatarURL())
          .setDescription(
            `**Channel:** #${channel.name}\n**Content:**\n${content}\n\User ${author.tag} | ${author.id}`
          )
      ]
    });
  }
}

/**
 * Yaoi stuff
 * @param {Obj} client
 */
async function yaoiPoster(client) {
  setInterval(async () => {
    const unixTime = Math.floor(Date.now() / 1000);

    const uwu = await fetch("https://yaoi.tritan.dev/api/v1/yaoi").then((i) => i.json());
    const embed = new MessageEmbed()
      .setAuthor({
        name: client.config.embeds.authorName,
        iconURL: client.config.embeds.authorIcon
      })
      .setColor(client.config.embeds.embed_color)
      .setTitle("Here's some yaoi daddy!~")
      .setDescription(`[Visit our api!](https://lewd.tritan.dev)\n\nPosted: <t:${unixTime}:F>`)
      .setImage(uwu.url);

    client.channels.cache.get("943065216671944734").send({ embeds: [embed] });

    return console.log(client.logger.green(`[AUTOPOSTING]`), "Yaoi posted to priv nsfw channel.");
  }, 1000 * 60 * 30);
}

module.exports = {
  setStatusInitial,
  setStatusInterval,
  checkReminders,
  getRandomInt,
  generatePassword,
  capitalize,
  shorten,
  doMagic8BallVoodoo,
  shuffle,
  getChannelFromMention,
  countManager,
  autoDelete,
  mentionRegex,
  customCommands,
  commandCount,
  errorEmbed,
  commandLog,
  dmHandler,
  isBot,
  blacklistCheck,
  memberMessageCount,
  afkCheck,
  levelUpMessages,
  bumpReminder,
  massMentionLog,
  startupCollectionAmounts,
  updateCommandsList,
  deploySlashCommands,
  sleep,
  clearTempDirectory,
  permissionsCheck,
  thanksuwu,
  containsLink,
  containsDiscordInvite,
  shouldModerate,
  performAutomod,
  yaoiPoster
};
