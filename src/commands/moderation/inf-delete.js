"use strict";

const { MessageEmbed, Permissions } = require("discord.js");

module.exports = {
  name: "inf-delete",
  description: "Delete an infraction by ID.",
  usage: "(Prefix)inf-delete <infraction id>",
  category: "Moderation",
  async execute(message, args) {
    if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
      return message
        .reply("You don't have enough permission to view this member's infractions.")
        .then((m) => setTimeout(() => m.delete(), 10000));
    }

    const caseID = args[0];
    if (!caseID)
      return message.channel
        .send(`${message.client.config.helpers.error_x} You need to specify the infraction ID.`)
        .then((m) => setTimeout(() => m.delete(), 10000));

    message.client.models.infractions
      .findByIdAndDelete(caseID)
      .then(async (document) => {
        if (!document)
          return message.channel
            .send("That is an invalid infraction ID!")
            .then((m) => setTimeout(() => m.delete(), 10000));

        if (document.user == message.member.id) {
          const newinf = new message.client.models.infractions({
            _id: document._id,
            GuildID: document.GuildID,
            GuildName: document.GuildName,
            TargetID: document.TargetID,
            TargetTag: document.TargetTag,
            ModeratorID: document.ModeratorID,
            ModeratorTag: document.ModeratorTag,
            InfractionType: document.InfractionType,
            Reason: document.Reason,
            Time: document.Time
          });
          await newinf.save();
          return message.channel
            .send("You can't delete infractions for yourself!")
            .then((m) => setTimeout(() => m.delete(), 10000));
        } else {
          const embed = new MessageEmbed();
          embed.setAuthor({
            name: `${message.client.config.embeds.authorName}`,
            iconURL: `${message.client.config.embeds.authorIcon}`
          });
          embed.setTitle("Successfully Deleted Infraction");
          embed.setDescription(`Infraction ${caseID} has been removed from our records.`);
          embed.setTimestamp();
          embed.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
          embed.setColor(message.client.config.embeds.embed_color);
          return message.channel.send({ embeds: [embed] }).then((m) => setTimeout(() => m.delete(), 10000));
        }
      })
      .catch((err) => {
        console.log("Inf-Delete Error", err);
        return message.channel
          .send("Error when deleting infraction, please try again later.\n" + err)
          .then((m) => setTimeout(() => m.delete(), 10000));
      });
  }
};
