"use strict";

const { MessageEmbed } = require("discord.js"),
  { QueryType, QueueRepeatMode } = require("discord-player"),
  lyricsFinder = require("lyrics-finder");

module.exports.slash = {
  name: "music",
  description: "The music category contains commands for music.",
  options: [
    {
      name: "backtrack",
      description: "Go to the last played song in the music queue.",
      type: "SUB_COMMAND"
    },
    {
      name: "bassboost",
      description: "Toggles bassboost filter",
      type: "SUB_COMMAND"
    },
    {
      name: "loop",
      description: "Sets loop mode.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "mode",
          type: "INTEGER",
          description: "Loop type",
          required: true,
          choices: [
            {
              name: "Off",
              value: QueueRepeatMode.OFF
            },
            {
              name: "Track",
              value: QueueRepeatMode.TRACK
            },
            {
              name: "Queue",
              value: QueueRepeatMode.QUEUE
            },
            {
              name: "Autoplay",
              value: QueueRepeatMode.AUTOPLAY
            }
          ]
        }
      ]
    },
    {
      name: "lyrics",
      description: "Shows the lyrics for the currently playing song.",
      type: "SUB_COMMAND"
    },
    {
      name: "nowplaying",
      description: "Shows the currently that is currently playing.",
      type: "SUB_COMMAND"
    },
    { name: "pause", description: "Pause the current playing song.", type: "SUB_COMMAND" },
    {
      name: "play",
      description: "Play a song!",
      type: "SUB_COMMAND",
      options: [
        {
          name: "query",
          type: "STRING",
          description: "The song you want to play",
          required: true
        }
      ]
    },
    {
      name: "search",
      description: "Search for a song and select the results from a list!",
      type: "SUB_COMMAND",
      options: [
        {
          name: "query",
          type: "STRING",
          description: "The song you want to search for.",
          required: true
        }
      ]
    },
    {
      name: "queue",
      description: "See the queue",
      type: "SUB_COMMAND"
    },

    {
      name: "resume",
      description: "Resume the current song",
      type: "SUB_COMMAND"
    },
    {
      name: "shuffle",
      description: "Shuffle the song queue into a random order, 3+ songs required..",
      type: "SUB_COMMAND"
    },
    { name: "skip", description: "Skip to the next song.", type: "SUB_COMMAND" },
    {
      name: "soundcloud",
      description: "Play a song from soundcloud!",
      type: "SUB_COMMAND",
      options: [
        {
          name: "query",
          type: "STRING",
          description: "The song you want to play",
          required: true
        }
      ]
    },
    {
      name: "stop",
      description: "Stop the player",
      type: "SUB_COMMAND"
    },
    {
      name: "volume",
      description: "Change the volume of the music that is currently playing.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "amount",
          type: "INTEGER",
          description: "The volume amount to set (0-100)",
          required: false
        }
      ]
    }
  ],

  async execute(client, interaction, args) {
    // Backtrack
    if (interaction.options.getSubcommand() === "backtrack") {
      interaction.deferReply();

      const queue = client.player.getQueue(interaction.guildId);

      if (!queue || !queue.playing) {
        let embed = new MessageEmbed()
          .setAuthor(
            `${interaction.client.config.embeds.authorName}`,
            `${interaction.client.config.embeds.authorIcon}`
          )
          .setDescription(`❌ | No music is currently being played.`)
          .setColor(client.config.embeds.embed_color)
          .setTimestamp()
          .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL());

        return void interaction.followUp({
          embeds: [embed]
        });
      }

      const success = queue.back();

      let embed2 = new MessageEmbed()
        .setAuthor(
          `${interaction.client.config.embeds.authorName}`,
          `${interaction.client.config.embeds.authorIcon}`
        )
        .setDescription(success ? `✅ | Went back a song!` : "❌ | Something went wrong!")
        .setColor(client.config.embeds.embed_color)
        .setTimestamp()
        .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL());

      return void interaction.followUp({
        embeds: [embed2]
      });
    }

    // Search
    if (interaction.options.getSubcommand() === "search") {
      await interaction.deferReply();

      const query = interaction.options.getString("query");

      const res = await client.player.search(query, {
        requestedBy: interaction.user,
        searchEngine: QueryType.AUTO
      });

      if (!res || !res.tracks.length)
        return interaction.followUp(`No results found ${interaction.user}... try again ? ❌`);

      const queue = await client.player.createQueue(interaction.guild, {
        ytdlOptions: {
          filter: "audioonly",
          highWaterMark: 1 << 25,
          dlChunkSize: 0,
          quality: "highestaudio",
          maxReconnects: 10
        },
        metadata: interaction.channel
      });

      const embed = new MessageEmbed();

      embed.setColor(client.config.embeds.embed_color);
      embed.setAuthor(`Tritan Bot`, client.user.displayAvatarURL({ size: 1024, dynamic: true }));
      embed.setTitle(`Results for: ${query}`);

      const maxTracks = res.tracks.slice(0, 10);

      embed
        .setDescription(
          `${maxTracks
            .map((track, i) => `**${i + 1}**. ${track.title} | ${track.author}`)
            .join("\n")}\n\nSelect choice between **1** and **${maxTracks.length}** or **cancel** ⬇️`
        )

        .setColor(client.config.embeds.embed_color)
        .setTimestamp()
        .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL());

      interaction.followUp({ embeds: [embed] });

      const filter = (interaction) => interaction.user.id === interaction.user.id;

      const collector = interaction.channel.createMessageCollector({ filter, time: 15000 });

      collector.on("collect", async (query) => {
        if (query.content.toLowerCase() === "cancel")
          return interaction.followUp(`Search cancelled ✅`) && collector.stop();

        const value = parseInt(query.content);

        if (!value || value <= 0 || value > maxTracks.length)
          return interaction.followUp(
            `Invalid response, try a value between **1** and **${maxTracks.length}** or **cancel**... try again ? ❌`
          );

        collector.stop();

        try {
          if (!queue.connection) await queue.connect(interaction.member.voice.channel);
        } catch {
          await client.player.deleteQueue(interaction.guild.id);
          return interaction.followUp(
            `I can't join the voice channel ${interaction.author}... try again ? ❌`
          );
        }

        await interaction.followUp(`Loading your search... 🎧`);

        queue.addTrack(res.tracks[query.content - 1]);

        if (!queue.playing) await queue.play();
      });

      collector.on("end", (msg, reason) => {
        if (reason === "time")
          return interaction.followUp(`Search timed out ${interaction.user}... try again ? ❌`);
      });
    }

    // Bassboost
    if (interaction.options.getSubcommand() === "bassboost") {
      const queue = client.player.getQueue(interaction.guildId);

      if (!queue || !queue.playing) {
        let embed1 = new MessageEmbed()
          .setAuthor(
            `${interaction.client.config.embeds.authorName}`,
            `${interaction.client.config.embeds.authorIcon}`
          )
          .setDescription("❌ | No music is currently being played.")
          .setColor(client.config.embeds.embed_color)
          .setTimestamp()
          .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL());
        return void interaction.followUp({
          embeds: [embed1]
        });
      }

      await queue.setFilters({
        bassboost: !queue.getFiltersEnabled().includes("bassboost"),
        normalizer2: !queue.getFiltersEnabled().includes("bassboost") // because we need to toggle it with bass
      });

      let embed2 = new MessageEmbed()
        .setAuthor(
          `${interaction.client.config.embeds.authorName}`,
          `${interaction.client.config.embeds.authorIcon}`
        )
        .setDescription(
          `🎵 | Bassboost ${queue.getFiltersEnabled().includes("bassboost") ? "Enabled" : "Disabled"}!`
        )
        .setColor(client.config.embeds.embed_color)
        .setTimestamp()
        .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL());

      return void interaction.reply({ embeds: [embed2] });
    }

    // Loop
    if (interaction.options.getSubcommand() === "loop") {
      await interaction.deferReply();

      const queue = client.player.getQueue(interaction.guildId);

      if (!queue || !queue.playing) {
        let embed = new MessageEmbed()
          .setAuthor(
            `${interaction.client.config.embeds.authorName}`,
            `${interaction.client.config.embeds.authorIcon}`
          )
          .setDescription("❌ | No music is currently being played.")
          .setColor(client.config.embeds.embed_color)
          .setTimestamp()
          .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL());
        return void interaction.followUp({
          embeds: [embed]
        });
      }

      const loopMode = interaction.options.get("mode").value;
      const success = queue.setRepeatMode(loopMode);
      const mode =
        loopMode === QueueRepeatMode.TRACK ? "🔂" : loopMode === QueueRepeatMode.QUEUE ? "🔁" : "▶";
      let dis = success ? mode | `Updated loop mode!` : `❌` | `Could not update loop mode!`;

      let embed2 = new MessageEmbed()
        .setAuthor(
          `${interaction.client.config.embeds.authorName}`,
          `${interaction.client.config.embeds.authorIcon}`
        )
        .setDescription(`${dis}`)
        .setColor(client.config.embeds.embed_color)
        .setTimestamp()
        .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL());

      return void interaction.followUp({
        embeds: [embed2]
      });
    }

    // Lyrics
    if (interaction.options.getSubcommand() === "lyrics") {
      await interaction.deferReply();

      const queue = client.player.getQueue(interaction.guildId);

      if (!queue || !queue.playing) {
        let embed = new MessageEmbed()
          .setAuthor(
            `${interaction.client.config.embeds.authorName}`,
            `${interaction.client.config.embeds.authorIcon}`
          )
          .setDescription(`❌ | No music is currently being played.`)
          .setColor(client.config.embeds.embed_color)
          .setTimestamp()
          .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL());
        return void interaction.followUp({
          embeds: [embed]
        });
      }

      let lyrics = null;

      try {
        lyrics = await lyricsFinder(queue.current.title, "");
        if (!lyrics) lyrics = `I'm sorry... no lyrics were found for ${queue.current.title}.`;
      } catch (error) {
        lyrics = `I'm sorry, no lyrics found were for ${queue.current.title}.`;
      }

      let embed2 = new MessageEmbed()
        .setAuthor(
          `${interaction.client.config.embeds.authorName}`,
          `${interaction.client.config.embeds.authorIcon}`
        )
        .setTitle(`Lyrics for ${queue.current.title}`)
        .setDescription(lyrics)
        .setColor(client.config.embeds.embed_color)
        .setTimestamp()
        .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL());

      if (embed2.description.length >= 2048) embed2.description = `${embed2.description.substr(0, 2045)}...`;

      return void interaction.followUp({
        embeds: [embed2]
      });
    }

    if (interaction.options.getSubcommand() === "nowplaying") {
      await interaction.deferReply();

      const queue = client.player.getQueue(interaction.guildId);

      if (!queue || !queue.playing) {
        let embed = new MessageEmbed()
          .setAuthor(
            `${interaction.client.config.embeds.authorName}`,
            `${interaction.client.config.embeds.authorIcon}`
          )
          .setDescription(`❌ | No music is currently being played.`)
          .setColor(client.config.embeds.embed_color)
          .setTimestamp()
          .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL());
        return void interaction.followUp({
          embeds: [embed]
        });
      }
      const progress = queue.createProgressBar();
      const perc = queue.getPlayerTimestamp();

      let embed2 = new MessageEmbed()
        .setAuthor(
          `${interaction.client.config.embeds.authorName}`,
          `${interaction.client.config.embeds.authorIcon}`
        )
        .setDescription(`🎶 | **${queue.current.title}**! (\`${perc.progress}%\`)`)
        .addField("\u200b", progress)
        .setColor(client.config.embeds.embed_color)
        .setTimestamp()
        .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL());

      return void interaction.followUp({
        embeds: [embed2]
      });
    }

    if (interaction.options.getSubcommand() === "pause") {
      await interaction.deferReply();

      const queue = client.player.getQueue(interaction.guildId);

      if (!queue || !queue.playing) {
        let embed = new MessageEmbed()
          .setAuthor(
            `${interaction.client.config.embeds.authorName}`,
            `${interaction.client.config.embeds.authorIcon}`
          )
          .setDescription(`❌ | No music is currently being played.`)
          .setColor(client.config.embeds.embed_color)
          .setTimestamp()
          .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL());
        return void interaction.followUp({
          embeds: [embed]
        });
      }

      const success = queue.setPaused(true);
      let embed2 = new MessageEmbed()
        .setAuthor(
          `${interaction.client.config.embeds.authorName}`,
          `${interaction.client.config.embeds.authorIcon}`
        )
        .setDescription(success ? "⏸ | Paused!" : "❌ | Something went wrong!")
        .setColor(client.config.embeds.embed_color)
        .setTimestamp()
        .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL());
      return void interaction.followUp({
        embeds: [embed2]
      });
    }

    if (interaction.options.getSubcommand() === "play") {
      if (
        interaction.guild.me.voice.channelId &&
        interaction.member.voice.channelId !== interaction.guild.me.voice.channelId
      ) {
        let embed = new MessageEmbed()
          .setAuthor(
            `${interaction.client.config.embeds.authorName}`,
            `${interaction.client.config.embeds.authorIcon}`
          )
          .setDescription(`❌ | You are not in the same voice channel as me. :(`)
          .setColor(client.config.embeds.embed_color)
          .setTimestamp()
          .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL());

        return void interaction.reply({
          embeds: [embed],
          ephemeral: true
        });
      }

      await interaction.deferReply();

      const query = interaction.options.get("query").value;
      const searchResult = await client.player
        .search(query, {
          requestedBy: interaction.user,
          searchEngine:
            interaction.commandName === "soundcloud" ? QueryType.SOUNDCLOUD_SEARCH : QueryType.AUTO
        })
        .catch(() => {});
      if (!searchResult || !searchResult.tracks.length) {
        let embed2 = new MessageEmbed()
          .setAuthor(
            `${interaction.client.config.embeds.authorName}`,
            `${interaction.client.config.embeds.authorIcon}`
          )
          .setDescription(`❌ | No results were found, try again using better wording.`)
          .setColor(client.config.embeds.embed_color)
          .setTimestamp()
          .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL());

        return void interaction.followUp({ embeds: [embed2] });
      }

      const queue = await client.player.createQueue(interaction.guild, {
        ytdlOptions: {
          filter: "audioonly",
          highWaterMark: 1 << 25,
          dlChunkSize: 0,
          quality: "highestaudio",
          maxReconnects: 10
        },
        metadata: interaction.channel
      });

      try {
        if (!queue.connection) await queue.connect(interaction.member.voice.channel);
      } catch {
        void client.player.deleteQueue(interaction.guildId);

        let embed3 = new MessageEmbed()
          .setAuthor(
            `${interaction.client.config.embeds.authorName}`,
            `${interaction.client.config.embeds.authorIcon}`
          )
          .setDescription(`❌ | Could not join your voice channel, please check my permissions.`)
          .setColor(client.config.embeds.embed_color)
          .setTimestamp()
          .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL());

        return void interaction.followUp({
          embeds: [embed3]
        });
      }

      let embed4 = new MessageEmbed()
        .setAuthor(
          `${interaction.client.config.embeds.authorName}`,
          `${interaction.client.config.embeds.authorIcon}`
        )
        .setDescription(`⏱ | Loading your ${searchResult.playlist ? "playlist" : "track"}...`)
        .setColor(client.config.embeds.embed_color)
        .setTimestamp()
        .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL());

      await interaction.followUp({
        embeds: [embed4]
      });

      searchResult.playlist ? queue.addTracks(searchResult.tracks) : queue.addTrack(searchResult.tracks[0]);
      if (!queue.playing) await queue.play();
    }

    if (interaction.options.getSubcommand() === "queue") {
      await interaction.deferReply();
      const queue = client.player.getQueue(interaction.guildId);

      if (!queue || !queue.playing) {
        let embed = new MessageEmbed()
          .setAuthor(
            `${interaction.client.config.embeds.authorName}`,
            `${interaction.client.config.embeds.authorIcon}`
          )
          .setDescription(`❌ | No music is currently being played.`)
          .setColor(client.config.embeds.embed_color)
          .setTimestamp()
          .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL());

        return void interaction.followUp({
          embeds: [embed]
        });
      }

      const currentTrack = queue.current;
      const tracks = queue.tracks.slice(0, 10).map((m, i) => {
        return `${i + 1}. **${m.title}** ([link](${m.url}))`;
      });

      let embed2 = new MessageEmbed()
        .setAuthor(
          `${interaction.client.config.embeds.authorName}`,
          `${interaction.client.config.embeds.authorIcon}`
        )
        .setTitle("Music Queue")
        .setDescription(
          `${tracks.join("\n")}${
            queue.tracks.length > tracks.length
              ? `\n...${
                  queue.tracks.length - tracks.length === 1
                    ? `${queue.tracks.length - tracks.length} more track`
                    : `${queue.tracks.length - tracks.length} more tracks`
                }`
              : ""
          }`
        )
        .addField("Now Playing", `🎶 | **${currentTrack.title}** ([link](${currentTrack.url}))`)
        .setColor(client.config.embeds.embed_color)
        .setTimestamp()
        .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL());

      return void interaction.followUp({
        embeds: [embed2]
      });
    }

    if (interaction.options.getSubcommand() === "resume") {
      await interaction.deferReply();

      const queue = client.player.getQueue(interaction.guildId);

      if (!queue || !queue.playing) {
        let embed = new MessageEmbed()
          .setAuthor(
            `${interaction.client.config.embeds.authorName}`,
            `${interaction.client.config.embeds.authorIcon}`
          )
          .setDescription(`❌ | No music is currently being played.`)
          .setColor(client.config.embeds.embed_color)
          .setTimestamp()
          .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL());

        return void interaction.followUp({ embeds: [embed] });
      }

      const success = queue.setPaused(false);

      let embed2 = new MessageEmbed()
        .setAuthor(
          `${interaction.client.config.embeds.authorName}`,
          `${interaction.client.config.embeds.authorIcon}`
        )
        .setDescription(success ? "▶ | Resumed!" : "❌ | Something went wrong!")
        .setColor(client.config.embeds.embed_color)
        .setTimestamp()
        .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL());

      return void interaction.followUp({
        embeds: [embed2]
      });
    }

    if (interaction.options.getSubcommand() === "shuffle") {
      await interaction.deferReply();

      const queue = client.player.getQueue(interaction.guildId);

      if (!queue || !queue.playing) {
        let embed = new MessageEmbed()
          .setAuthor(
            `${interaction.client.config.embeds.authorName}`,
            `${interaction.client.config.embeds.authorIcon}`
          )
          .setDescription(`❌ | No music is currently being played.`)
          .setColor(client.config.embeds.embed_color)
          .setTimestamp()
          .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL());

        return void interaction.followUp({
          embeds: [embed]
        });
      }

      const success = queue.shuffle();

      let embed2 = new MessageEmbed()
        .setAuthor(
          `${interaction.client.config.embeds.authorName}`,
          `${interaction.client.config.embeds.authorIcon}`
        )
        .setDescription(
          success
            ? `✅ | Successfully suffled the queue.`
            : "❌ | Something went wrong, you need more than 2 songs in the queue to shuffle."
        )
        .setColor(client.config.embeds.embed_color)
        .setTimestamp()
        .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL());

      return void interaction.followUp({
        embeds: [embed2]
      });
    }

    if (interaction.options.getSubcommand() === "skip") {
      await interaction.deferReply();

      const queue = client.player.getQueue(interaction.guildId);

      if (!queue || !queue.playing) {
        let embed = new MessageEmbed()
          .setAuthor(
            `${interaction.client.config.embeds.authorName}`,
            `${interaction.client.config.embeds.authorIcon}`
          )
          .setDescription(`❌ | No music is currently being played.`)
          .setColor(client.config.embeds.embed_color)
          .setTimestamp()
          .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL());

        return void interaction.followUp({
          embeds: [embed]
        });
      }

      const currentTrack = queue.current;
      const success = queue.skip();

      let embed2 = new MessageEmbed()
        .setAuthor(
          `${interaction.client.config.embeds.authorName}`,
          `${interaction.client.config.embeds.authorIcon}`
        )
        .setDescription(success ? `✅ | Skipped **${currentTrack}**!` : "❌ | Something went wrong!")
        .setColor(client.config.embeds.embed_color)
        .setTimestamp()
        .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL());

      return void interaction.followUp({
        embeds: [embed2]
      });
    }

    if (interaction.options.getSubcommand() === "soundcloud") {
      if (
        interaction.guild.me.voice.channelId &&
        interaction.member.voice.channelId !== interaction.guild.me.voice.channelId
      ) {
        let embed = new MessageEmbed()
          .setAuthor(
            `${interaction.client.config.embeds.authorName}`,
            `${interaction.client.config.embeds.authorIcon}`
          )
          .setDescription(`❌ | You are not in the same voice channel as me. :(`)
          .setColor(client.config.embeds.embed_color)
          .setTimestamp()
          .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL());

        return void interaction.reply({
          embeds: [embed],
          ephemeral: true
        });
      }

      await interaction.deferReply();

      const query = interaction.options.get("query").value;
      const searchResult = await client.player
        .search(query, {
          requestedBy: interaction.user,
          searchEngine:
            interaction.commandName === "soundcloud" ? QueryType.SOUNDCLOUD_SEARCH : QueryType.AUTO
        })
        .catch(() => {});
      if (!searchResult || !searchResult.tracks.length) {
        let embed2 = new MessageEmbed()
          .setAuthor(
            `${interaction.client.config.embeds.authorName}`,
            `${interaction.client.config.embeds.authorIcon}`
          )
          .setDescription(`❌ | No results were found, try again using better wording.`)
          .setColor(client.config.embeds.embed_color)
          .setTimestamp()
          .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL());

        return void interaction.followUp({ embeds: [embed2] });
      }

      const queue = await client.player.createQueue(interaction.guild, {
        ytdlOptions: {
          filter: "audioonly",
          highWaterMark: 1 << 25,
          dlChunkSize: 0,
          quality: "highestaudio",
          maxReconnects: 10
        },
        metadata: interaction.channel
      });

      try {
        if (!queue.connection) await queue.connect(interaction.member.voice.channel);
      } catch {
        void client.player.deleteQueue(interaction.guildId);

        let embed3 = new MessageEmbed()
          .setAuthor(
            `${interaction.client.config.embeds.authorName}`,
            `${interaction.client.config.embeds.authorIcon}`
          )
          .setDescription(`❌ | Could not join your voice channel, please check my permissions.`)
          .setColor(client.config.embeds.embed_color)
          .setTimestamp()
          .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL());

        return void interaction.followUp({
          embeds: [embed3]
        });
      }

      let embed4 = new MessageEmbed()
        .setAuthor(
          `${interaction.client.config.embeds.authorName}`,
          `${interaction.client.config.embeds.authorIcon}`
        )
        .setDescription(`⏱ | Loading your ${searchResult.playlist ? "playlist" : "track"}...`)
        .setColor(client.config.embeds.embed_color)
        .setTimestamp()
        .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL());

      await interaction.followUp({
        embeds: [embed4]
      });

      searchResult.playlist ? queue.addTracks(searchResult.tracks) : queue.addTrack(searchResult.tracks[0]);
      if (!queue.playing) await queue.play();
    }

    if (interaction.options.getSubcommand() === "stop") {
      await interaction.deferReply();

      const queue = client.player.getQueue(interaction.guildId);

      if (!queue || !queue.playing) {
        let embed = new MessageEmbed()
          .setAuthor(
            `${interaction.client.config.embeds.authorName}`,
            `${interaction.client.config.embeds.authorIcon}`
          )
          .setDescription(`❌ | No music is currently being played.`)
          .setColor(client.config.embeds.embed_color)
          .setTimestamp()
          .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL());

        return void interaction.followUp({
          embeds: [embed]
        });
      }

      queue.destroy();

      let embed2 = new MessageEmbed()
        .setAuthor(
          `${interaction.client.config.embeds.authorName}`,
          `${interaction.client.config.embeds.authorIcon}`
        )
        .setDescription(`🛑 | Stopped the player!`)
        .setColor(client.config.embeds.embed_color)
        .setTimestamp()
        .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL());

      return void interaction.followUp({ embeds: [embed2] });
    }

    if (interaction.options.getSubcommand() === "stop") {
      await interaction.deferReply();

      const queue = client.player.getQueue(interaction.guildId);

      if (!queue || !queue.playing) {
        let embed = new MessageEmbed()
          .setAuthor(
            `${interaction.client.config.embeds.authorName}`,
            `${interaction.client.config.embeds.authorIcon}`
          )
          .setDescription(`❌ | No music is currently being played.`)
          .setColor(client.config.embeds.embed_color)
          .setTimestamp()
          .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL());

        return void interaction.followUp({
          embeds: [embed]
        });
      }

      const vol = interaction.options.get("amount");

      if (!vol) {
        let embed2 = new MessageEmbed()
          .setAuthor(
            `${interaction.client.config.embeds.authorName}`,
            `${interaction.client.config.embeds.authorIcon}`
          )
          .setDescription(`🎧 | Current volume is **${queue.volume}**%.`)
          .setColor(client.config.embeds.embed_color)
          .setTimestamp()
          .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL());
        return void interaction.followUp({
          embeds: [embed2]
        });
      }

      if (vol.value < 0 || vol.value > 100) {
        let embed3 = new MessageEmbed()
          .setAuthor(
            `${interaction.client.config.embeds.authorName}`,
            `${interaction.client.config.embeds.authorIcon}`
          )
          .setDescription(`❌ | Volume range must be 0-100, no ear-rape today.`)
          .setColor(client.config.embeds.embed_color)
          .setTimestamp()
          .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL());

        return void interaction.followUp({
          embeds: [embed3]
        });
      }

      const success = queue.setVolume(vol.value);

      let embed4 = new MessageEmbed()
        .setAuthor(
          `${interaction.client.config.embeds.authorName}`,
          `${interaction.client.config.embeds.authorIcon}`
        )
        .setDescription(
          success ? `✅ | The volume has been set to **${vol.value}%**.` : "❌ | Something went wrong!"
        )
        .setColor(client.config.embeds.embed_color)
        .setTimestamp()
        .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL());

      return void interaction.followUp({
        embeds: [embed4]
      });
    }
  }
};
