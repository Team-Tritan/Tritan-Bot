"use strict";

const { Client, Intents, Collection, MessageEmbed } = require("discord.js"),
  { DiscordTogether } = require("discord-together"),
  { Player } = require("discord-player"),
  { GiveawaysManager } = require("discord-giveaways"),
  { Database } = require("quickmongo"),
  { MongooseSentryLogger } = require("mongoose-sentry-logger"),
  { token, dev_token, production_mode } = require("../../config/tokens"),
  mongoose = require("mongoose"),
  StarboardsManager = require("discord-starboards"),
  react = require("../helpers/client/reactionRoles"),
  Levels = require("discord-xp");

// If you are reading this code - I'm so sorry

class Tritan extends Client {
  constructor() {
    super({
      rateLimitAsError: true,
      compress: true,
      restTimeOffset: 0,
      fetchAllMembers: true,
      fetchAllRoles: true,
      fetchAllChannels: true,
      fetchAllEmojis: true,
      partials: ["MESSAGE", "CHANNEL", "GUILD_MEMBER", "REACTION", "MESSAGE", "USER"],
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_INTEGRATIONS,
        Intents.FLAGS.GUILD_WEBHOOKS,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGE_TYPING
      ]
    });

    // ***** Login Data *****
    let bot_token;
    if (production_mode) bot_token = token;
    if (!production_mode) bot_token = dev_token;

    // ***** Tritan Attachments *****
    this.login(bot_token);
    this.logger = require("chalk");

    this.config = [];
    this.models = [];
    this.slashDiscordData = [];

    this.commands = new Collection();
    this.slashcommands = new Collection();
    this.events = new Collection();
    this.cooldowns = new Collection();
    this.inviteCache = new Collection(); // store invite data for invite tracking
    this.antiScamCache = new Collection(); // store message data for anti_scam feature

    this.snipes = new Map();
    this.react = new Map();
    this.fetchforguild = new Map();
    this.usersMap = new Map();

    this.discordTogether = new DiscordTogether(this);
    this.player = new Player(this);

    this.functions = require("../utils/functions");
    this.copypastas = require("../utils/copypastas");

    this.config.embeds = require("../../config/embeds");
    this.config.tokens = require("../../config/tokens");
    this.config.webhooks = require("../../config/webhooks");
    this.config.helpers = require("../../config/helpers");

    this.models.guild = require("../../models/guild");
    this.models.reminders = require("../../models/reminders");
    this.models.rr = require("../../models/reactionRoles");
    this.models.cc = require("../../models/cc");
    this.models.commands = require("../../models/commands");
    this.models.economy = require("../../models/economy");
    this.models.infractions = require("../../models/infractions");
    this.models.webhooks = require("../../models/webhooks");
    this.models.messages = require("../../models/messages");
    this.models.thanks = require("../../models/thanks");

    this.sentry = require("@sentry/node");
    this.tracing = require("@sentry/tracing");

    // ***** Sentry Init *****
    this.sentry.init({
      dsn: this.config.tokens.sentryDSN,
      integrations: [new this.tracing.Integrations.Mongo()],
      tracesSampleRate: 1.0,
      attachStacktrace: true,
      debug: true,
      environment: "production"
    });

    MongooseSentryLogger.init({
      mongoose,
      dsn: this.config.tokens.sentryDSN,
      debug: true
    });

    // ***** Database Utils *****
    Levels.setURL(this.config.tokens.mongodb);
    react.setURL(this.config.tokens.mongodb);

    const dbOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: false,
      poolSize: 5,
      connectTimeoutMS: 10000,
      family: 4,
      logger: MongooseSentryLogger,
      loggerLevel: "info"
    };

    mongoose.connect(this.config.tokens.mongodb, dbOptions);
    mongoose.Promise = global.Promise;

    mongoose.connection.on("connected", () => {
      console.log(this.logger.blue("[Startup]"), "Database Connected");
    });

    // ***** Giveaway Manager *****
    const giveawaySchema = new mongoose.Schema(
      {
        messageId: String,
        channelId: String,
        guildId: String,
        startAt: Number,
        endAt: Number,
        ended: Boolean,
        winnerCount: Number,
        prize: String,
        messages: {
          giveaway: String,
          giveawayEnded: String,
          inviteToParticipate: String,
          drawing: String,
          dropMessage: String,
          winMessage: mongoose.Mixed,
          embedFooter: mongoose.Mixed,
          noWinner: String,
          winners: String,
          endedAt: String,
          hostedBy: String
        },
        thumbnail: String,
        hostedBy: String,
        winnerIds: { type: [String], default: undefined },
        reaction: mongoose.Mixed,
        botsCanWin: Boolean,
        embedColor: mongoose.Mixed,
        embedColorEnd: mongoose.Mixed,
        exemptPermissions: { type: [], default: undefined },
        exemptMembers: String,
        bonusEntries: String,
        extraData: mongoose.Mixed,
        lastChance: {
          enabled: Boolean,
          content: String,
          threshold: Number,
          embedColor: mongoose.Mixed
        },
        pauseOptions: {
          isPaused: Boolean,
          content: String,
          unPauseAfter: Number,
          embedColor: mongoose.Mixed,
          durationAfterPause: Number
        },
        isDrop: Boolean,
        allowedMentions: {
          parse: { type: [String], default: undefined },
          users: { type: [String], default: undefined },
          roles: { type: [String], default: undefined }
        }
      },
      { id: false }
    );

    const giveawayModel = mongoose.model("giveaways", giveawaySchema);

    const GiveawayManagerWithOwnDatabase = class extends GiveawaysManager {
      async getAllGiveaways() {
        return await giveawayModel.find().lean().exec();
      }

      async saveGiveaway(messageId, giveawayData) {
        await giveawayModel.create(giveawayData);
        return true;
      }

      async editGiveaway(messageId, giveawayData) {
        await giveawayModel.updateOne({ messageId }, giveawayData, { omitUndefined: true }).exec();
        return true;
      }

      async deleteGiveaway(messageId) {
        await giveawayModel.deleteOne({ messageId }).exec();
        return true;
      }
    };

    this.giveawaysManager = new GiveawayManagerWithOwnDatabase(this, {
      storage: false,
      updateCountdownEvery: 10000,
      default: {
        botsCanWin: false,
        embedColor: this.config.embeds.embed_color,
        embedColorEnd: this.config.embeds.embed_color,
        reaction: "👋",
        hasGuildMembersIntent: true
      }
    });

    this.giveawaysManager.on("giveawayEnded", (giveaway, winners) => {
      winners.forEach((member) => {
        const embed = new MessageEmbed()
          .setAuthor({
            name: `Tritan Bot`,
            iconURL: "https://s3.wasabisys.com/team-tritan/tritan-bot/logo.webp"
          })
          .setTitle(`<:pin:785224364785139722> Congratulations!!!`)
          .setDescription(
            `<a:gif:785224385811185744> Congratulations ${member.user.username}, you won **${giveaway.prize}**! Please reach out to the server that had initiated this giveaway to claim your prize.`
          )
          .addField("Link", `[Giveaway](${giveaway.messageURL})`)
          .setTimestamp()
          .setColor(this.config.embeds.embed_color);
        member.send({ embeds: [embed] });
      });
    });

    // ***** Starboards Manager *****
    const db = new Database(this.config.tokens.mongodb);
    db.once("ready", async () => {
      console.log(this.logger.blue("[Startup]"), `Starboards helper attached to the client.`);
      if ((await db.get("Starboards")) === null) await db.set("Starboards", []);
    });

    class StarboardsManagerCustomDb extends StarboardsManager {
      async getAllStarboards() {
        return await db.get("Starboards");
      }

      async saveStarboard(data) {
        await db.push("Starboards", data);
        return true;
      }

      async deleteStarboard(channelId, emoji) {
        let newStarboardsArray = await db.get("Starboards");
        newStarboardsArray = newStarboardsArray.filter(
          (starboard) => !(starboard.channelId === channelId && starboard.options.emoji === emoji)
        );
        await db.set("Starboards", newStarboardsArray);
        return true;
      }

      async editStarboard(channelId, emoji, data) {
        const starboards = await db.get("Starboards");
        const newStarboardsArray = starboards.filter(
          (starboard) => !(starboard.channelId === channelId && starboard.options.emoji === emoji)
        );
        newStarboardsArray.push(data);
        await db.set("Starboards", newStarboardsArray);
        return true;
      }
    }

    this.starboardsManager = new StarboardsManagerCustomDb(this, {
      storage: false
    });
  }
}

module.exports = Tritan;
