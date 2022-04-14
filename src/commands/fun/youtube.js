const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "youtube",
  description: "Watch a queue of youtube videos with your friends!",
  category: "Fun",
  usage: "(prefix)youtube",
  async execute(message, args) {
    let client = message.client;

    if (!message.member.voice.channelId) {
      let bigpenis = new MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setTitle(":x: | You need to join a voice channel first!")
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp()
        .setColor(message.client.config.embeds.embed_color);
      return message.channel.send({ embeds: [bigpenis] });
    }

    if (message.member.voice.channelId) {
      client.discordTogether
        .createTogetherCode(message.member.voice.channelId, "youtube")
        .then(async (invite) => {
          let daddydick = new MessageEmbed()
            .setAuthor({
              name: `${message.client.config.embeds.authorName}`,
              iconURL: `${message.client.config.embeds.authorIcon}`
            })

            .setThumbnail(message.author.displayAvatarURL())
            .setTitle("Watch Youtube Together!")
            .setDescription(
              `With this command, you can watch youtube together with friends in a voice channel!\n\n[**Click here to join!**](${invite.code})\n\n Please note that this only works on desktop devices at this time.`
            )
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
            .setTimestamp()
            .setColor(message.client.config.embeds.embed_color);
          return message.channel.send({ embeds: [daddydick] });
        });
    }
  }
};

module.exports.slash = {
  name: "watch",
  description: "Watch Youtube on Discord!",
  options: [
    {
      name: "youtube",
      description: "Watch Youtube on Discord!",
      type: "SUB_COMMAND"
    }
  ],
  async execute(client, interaction, args) {
    if (interaction.options.getSubcommand() === "youtube") {
      await interaction.deferReply();

      let member = client.guilds.cache.get(interaction.guild.id).members.cache.get(interaction.member.id);

      if (!member.voice.channelId) {
        return interaction.followUp("You need to join a voice channel first!");
      }

      client.discordTogether.createTogetherCode(member.voice.channelId, "youtube").then(async (invite) => {
        let embed = new MessageEmbed()
          .setAuthor({
            name: `Tritan Bot`,
            iconURL: "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp"
          })
          .setTitle("Watch Youtube Together!")
          .setDescription(
            `With this command, you can watch youtube together with friends in a voice channel!\n\n[**Click here to join!**](${invite.code})\n\n Please note that this only works on desktop devices at this time.`
          )
          .setTimestamp()
          .setColor(client.config.embeds.embed_color);

        return interaction.followUp({ embeds: [embed] });
      });
    }
  }
};
