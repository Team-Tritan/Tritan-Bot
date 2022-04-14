"use strict";

const mongoose = require("mongoose"),
  reactionModel = require("../../../models/reactionRoles");

class react {
  static async setURL(dbUrl) {
    if (!dbUrl) throw new TypeError("A database url was not provided.");
    return mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }

  static async createrr(client, guildId, msgid, roleid, emoji, dm) {
    if (!client) throw new TypeError("An client was not provided.");
    if (!guildId) throw new TypeError("A guild id was not provided.");
    if (!msgid) throw new TypeError("A message id was not provided.");
    if (!emoji) throw new TypeError("A reaction/emoji was not provided.");
    if (!roleid) throw new TypeError("A role id was not provided.");
    dm = dm ? dm : false; // when dm is undefined // if they should get a message , when they get the role
    const issame = await reactionModel.findOne({
      guildid: guildId,
      msgid: msgid,
      reaction: emoji,
      roleid: roleid
    });
    if (issame) return false;

    const newRR = new reactionModel({
      guildid: guildId,
      msgid: msgid,
      reaction: emoji,
      roleid: roleid,
      dm: dm
    });

    await newRR.save().catch((e) => console.log(`Failed to create reaction role: ${e}`));
    client.react.set(msgid + emoji, {
      ///this saves the msgid in a map to prevent a fetch
      guildid: guildId,
      msgid: msgid,
      reaction: emoji,
      roleid: roleid,
      dm: dm
    });
    return newRR;
  }

  /**
   * @param {object} [client] - Discord client, will save the data in a Map to prevent multiple fetches
   * @param {string} [guildId] - Discord guild id.
   * @param {string} [msgid] - on which should the reaction roles be.
   * @param {string} [emoji] - on which emoji u would get the role
   */

  static async deleterr(client, guildId, msgid, emoji) {
    if (!client) throw new TypeError("An client was not provided.");
    if (!guildId) throw new TypeError("A guild id was not provided.");
    if (!msgid) throw new TypeError("A message id was not provided.");
    if (!emoji) throw new TypeError("A reaction/emoji was not provided.");

    const reactionRole = await reactionModel.findOne({
      guildid: guildId,
      msgid: msgid,
      reaction: emoji
    });
    if (!reactionRole) return false;

    await reactionModel
      .findOneAndDelete({ guildid: guildId, msgid: msgid, reaction: emoji })
      .catch((e) => console.log(`Failed to reaction: ${e}`));

    client.react.delete(msgid + emoji);

    return reactionRole;
  }

  /**
   * @param {object} [client] - Discord client, will save the data in a Map to prevent multiple fetches
   * @param {string} [guildId] - Discord guild id.
   * @param {string} [msgid] - on which should the reaction roles be.
   * @param {string} [newroleid] - Discord guild id.
   * @param {string} [emoji] - on which emoji u would get the role
   */

  static async editrr(client, guildId, msgid, newroleid, emoji) {
    if (!client) throw new TypeError("An client was not provided.");
    if (!guildId) throw new TypeError("A guild id was not provided.");
    if (!msgid) throw new TypeError("A message id was not provided.");
    if (!emoji) throw new TypeError("A reaction/emoji was not provided.");
    if (!newroleid) throw new TypeError("A role id was not provided.");

    const reactionRole = await reactionModel.findOne({
      guildid: guildId,
      msgid: msgid,
      reaction: emoji
    });
    if (!reactionRole) return false;
    reactionRole.roleid = newroleid;

    await reactionRole.save().catch((e) => console.log(`Failed to save new prefix: ${e}`));
    client.react.set(msgid + emoji, {
      ///this saves the msgid in a map to prevent a fetch
      guildid: guildId,
      msgid: msgid,
      reaction: emoji,
      roleid: newroleid,
      dm: reactionRole.dm
    });
    return;
  }

  /**
   * @param {object} [client] - Discord client, will save the data in a Map to prevent multiple fetches
   * @param {string} [guildId] - Discord guild id.
   * @param {string} [msgid] - Discord guild id.
   * @param {string} [emoji] - Discord guild id.
   */

  static async fetchrr(client, guildId, msgid, emoji) {
    if (!client) throw new TypeError("An client was not provided.");
    if (!guildId) throw new TypeError("A guild id was not provided.");
    if (!client.fetchforguild.has(guildId)) {
      let allrole = await reactionModel
        .find({ guildid: guildId })
        .sort([["guildid", "descending"]])
        .exec();
      let i = 0;
      for (i; i < Object.keys(allrole).length; i++) {
        await client.react.set(allrole[i].msgid + allrole[i].reaction, {
          ///this saves the msgid in a map to prevent a fetch
          guildid: allrole[i].guildid,
          msgid: allrole[i].msgid,
          reaction: allrole[i].reaction,
          roleid: allrole[i].roleid,
          dm: allrole[i].dm
        });
      }
      client.fetchforguild.set(guildId, {
        ///this saves the msgid in a map to prevent a fetch
        guildid: guildId,
        totalreactions: Object.keys(allrole).length
      });
    }
    return client.react.get(msgid + emoji);
  }

  /**
   * @param {object} [client] - Discord client, will save the data in a Map to prevent multiple fetches
   */
  static async fetchallrr(client) {
    if (!client) throw new TypeError("An client was not provided.");
    let all = await reactionModel
      .find({})
      .sort([["guildid", "descending"]])
      .exec();

    /*   let i = 0;
    for(i ; i < Object.keys(all).length; i++){
      client.react.set(all[i].msgid+all[i].reaction, { ///this saves the msgid in a map to prevent a fetch
        guildid: all[i].guildid,
        msgid: all[i].msgid, 
        reaction: all[i].reaction , 
        roleid: all[i].roleid,
        dm: all[i].dm
      }); 
    }*/

    return all;
  }
}

module.exports = react;
