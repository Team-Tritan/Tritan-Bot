"use strict";

const Tritan = require("./base/tritan"),
  client = new Tritan(),
  loadCommands = require("./base/loadCommands"),
  loadEvents = require("./base/loadEvents"),
  loadPlayerEvents = require("./base/loadPlayerEvents"),
  rejectionHandler = require("./helpers/client/rejectionHandler"),
  newRelic = require("newrelic");

(async () => {
  rejectionHandler(process, client);
  loadCommands(client);
  loadEvents(client);
  loadPlayerEvents(client);

  client.functions.startupCollectionAmounts(client);
  client.functions.updateCommandsList(client);
  client.functions.clearTempDirectory(client);
})();
