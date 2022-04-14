"use strict";

const react = require("../../helpers/client/reactionRoles");

module.exports = async (client, reaction, user) => {
  if (user.partial) await user.fetch();
  if (reaction.partial) await reaction.fetch();
  if (reaction.message.partial) await reaction.message.fetch();
  let rolefetch = await react.fetchrr(
    client,
    reaction.message.guild.id,
    reaction.message.id,
    reaction.emoji.name
  );
  if (!rolefetch) return;
  let member = await reaction.message.guild.members.cache.get(user.id);
  if (member.roles.cache.has(rolefetch.roleid)) {
    await member.roles.remove(rolefetch.roleid);
    console.log(
      `Role ${rolefetch.roleid} from ${reaction.emoji.name} has been removed from ${member} in ${reaction.message.guild.name}.`
    );
  }
};
