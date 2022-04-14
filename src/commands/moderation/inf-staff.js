"use strict";

const { MessageEmbed, Permissions, MessageAttachment } = require("discord.js"),
  fs = require("fs");

module.exports = {
  name: "inf-staff",
  description: "Get all infractions given by a staff member",
  usage: "(Prefix)inf-staff <mention or id>",
  category: "Moderation",
  async execute(message, args) {
    const client = message.client;

    if (!message.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
      return message
        .reply(`You don't have enough permission to view this member's infractions.`)
        .then((m) => setTimeout(() => m.delete(), 10000));
    }
    let target = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
    if (!target)
      return message.channel
        .send(
          `${message.client.config.helpers.error_x} I can't find that user, they have to be in your guild to access their data. Try using the dashboard for a list of all infractions.`
        )
        .then((m) => setTimeout(() => m.delete(), 10000));

    const filedescriptor = Date.now();
    var file = fs.createWriteStream(`./tmp/staff-infractions-${filedescriptor}.txt`);
    file.on("error", function (err) {
      console.log(err);
    });

    setTimeout(() => {}, 5000);

    let array = [];

    let warnings = await message.client.models.infractions.find({
      ModeratorID: target.id,
      GuildID: message.guild.id
    });

    if (warnings.length == 0) {
      file.write("No infractions to display.");
    } else {
      warnings.forEach(async (warning) => {
        file.write(
          `ID: ${warning._id}\nMember: ${warning.TargetTag}\nType: ${warning.InfractionType}\nModerator: ${warning.ModeratorTag}\nReason: ${warning.Reason}\nTime/Date: ${warning.Time}\n\n\n`
        );
        array.push(
          `ID: \`${warning._id}\`\nMember: \`${warning.TargetTag}\n\`Type: \`${warning.InfractionType}\n\`Moderator: \`${warning.ModeratorTag}\n\`Reason: \`${warning.Reason}\n\`Time/Date: \`${warning.Time}\n\``
        );
      });
    }

    file.end();
    const finished_file = new MessageAttachment(`./tmp/staff-infractions-${filedescriptor}.txt`);

    const string = array.join("\n\n");
    const embedable = await message.client.functions.shorten(string);

    const embed = new MessageEmbed()
      .setAuthor({
        name: `${message.client.config.embeds.authorName}`,
        iconURL: `${message.client.config.embeds.authorIcon}`
      })
      .setTitle(`Infractions Search`)
      .setDescription(`There are no infractions from this user.`);
    if (array.length > 0) {
      embed.setDescription(`${embedable}`);
      embed.addField("Note", "For the entire list, reference the txt file provided.");
    }
    embed
      .setColor(message.client.config.embeds.embed_color)
      .setTimestamp()
      .setFooter("Requested by: " + message.author.tag, message.author.displayAvatarURL({ dynamic: true }));

    message.channel.send({
      embeds: [embed],
      files: [finished_file]
    });
  }
};
