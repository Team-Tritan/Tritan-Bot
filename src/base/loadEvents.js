"use strict";

const { readdirSync } = require("fs"),
  menuEvents = (event) => require(`../listeners/interactions/menus/${event}`);

module.exports = (client) => {
  // Discord Events
  readdirSync("./listeners/").forEach((dir) => {
    if (dir !== "player") {
      const events = readdirSync(`./listeners/${dir}/`).filter((file) => file.endsWith(".js"));

      for (const file of events) {
        const event = require(`../listeners/${dir}/${file}`);
        const eventName = file.split(".")[0];
        client.on(eventName, event.bind(null, client));
        client.events.set(eventName, event);
      }
    }
  });

  // Custom Interaction Events
  client.on("interactionCreate", (m) => menuEvents("dropdown-roles")(m, client));
};
