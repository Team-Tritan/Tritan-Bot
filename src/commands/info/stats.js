"use strict";

const { MessageEmbed } = require("discord.js"),
  { version } = require("discord.js"),
  moment = require("moment"),
  m = require("moment-duration-format"),
  os = require("os"),
  cpuStat = require("cpu-stat"),
  ms = require("ms"),
  osutils = require("os-utils");

module.exports = {
  name: "stats",
  description: "Sends detailed info about the client",
  usage: "(Prefix)stats",
  category: "Info",
  async execute(message, args) {
    const waiting = await message.channel.send(
      `${message.client.config.helpers.birb} Please wait, fetching stats from the server.`
    );

    let cpuLol;

    cpuStat.usagePercent(function (err, percent, seconds) {
      if (err) {
        console.log(message.client.logger.yellow("[ERROR: Stats Command CPUStat]"), `${err}`);
      }

      const embed = new MessageEmbed()
        .setAuthor({
          name: `${message.client.config.embeds.authorName}`,
          iconURL: `${message.client.config.embeds.authorIcon}`
        })
        .setTitle("__**Bot Stats:**__")
        .setDescription("Tritan Bot is proudly hosted by Team Tritan.")
        .addField(
          "⏳ Mem Usage",
          `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} / ${(
            os.totalmem() /
            1024 /
            1024
          ).toFixed(2)} MB`,
          true
        )
        .addField("❄️ Shard", `${message.guild.shardId}`, true)
        .addField("📁 Users on Shard", `${message.client.users.cache.size - 1}`, true)
        .addField("📁 Servers on Shard", `${message.client.guilds.cache.size}`, true)
        .addField("📁 Channels on Shard", `${message.client.channels.cache.size}`, true)
        .addField("👾 Discord.js", `v${version}`, true)
        .addField("🤖 CPU", `\`\`\`md\n${os.cpus().map((i) => `${i.model}`)[0]}\`\`\``)
        .addField("🤖 CPU Usage", `\`${percent.toFixed(2)}%\``, true)
        .addField("⚛️ Total Cores", cpuStat.totalCores().toString(), true)
        .addField("🤖 Arch", `\`${os.arch()}\``, true)
        .addField("💻 Platform", osutils.platform(), true)
        .addField("🤖 Node", `${process.version}`, true)
        .addField("🏓 API Latency", `${message.client.ws.ping}ms`, true)
        .addField(
          "Links",
          "**[Invite Me](https://discord.com/api/oauth2/authorize?client_id=732783297872003114&permissions=8&scope=bot) | " +
            "[Support Server](https://discord.gg/ScUgyE2)** | " +
            "**[Website](https://tritan.gg)**"
        )
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp()
        .setColor(message.client.config.embeds.embed_color);
      waiting.edit({ content: null, embeds: [embed] });
    });
  }
};
