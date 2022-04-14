"use strict";

module.exports = async (client) => {
  client.guilds.fetch();

  // Readd to db lazy
  // client.guilds.cache.forEach((i) => {
  //    client.emit("guildCreate", i);
  //	console.log(`Added ${i} to the db`);
  //  });

  // Set status, and status loop.
  client.functions.setStatusInterval(client);

  // Check and send reminders.
  client.functions.checkReminders(client);

  // Check and send yaoi shit
  client.functions.yaoiPoster(client);

  // Deploy Slash Commands
  //client.functions.deploySlashCommands(client);
};
