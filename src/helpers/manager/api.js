"use strict";

const { api_port } = require("../../../config/helpers"),
  { inspect } = require("util"),
  { post } = require("snekfetch"),
  chalk = require("chalk"),
  express = require("express");

const app = express();

let endpoints = {
  Landing: "/",
  "Uptime Robot": "/status",
  Promises: "/promises",
  Eval: "/eval/:code"
};

module.exports = (manager) => {
  app.disable("X-Powered-By");

  app.listen(api_port, () => {
    console.log(chalk.blue("[Startup]"), `Bot API running on port ${api_port}.`);
  });

  app
    .get("/", (req, res) => {
      res.setHeader("Content-Type", "application/json");
      return res.json({
        Status: 200,
        Message: "Tritan Bot Internal API",
        Endpoints: endpoints
      });
    })

    .get("/status", (req, res) => {
      res.setHeader("Content-Type", "application/json");
      return res.json({ status: "owo im ok", Updated: Date(Date.now()) });
    })

    .get("/promises", async (req, res) => {
      const promises = [
        manager.fetchClientValues("guilds.cache.size"),
        manager.broadcastEval((c) => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0))
      ];
      return Promise.all(promises).then((results) => {
        const totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
        const totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);

        return res.json({ guilds: totalGuilds, users: totalMembers });
      });
    })

    .get("/eval/:code", async (req, res) => {
      const code = req.params.code;

      if (!code) {
        return res.json({
          Status: 400,
          Message: "No code provided."
        });
      }

      var evaled = null;

      try {
        evaled = eval(code);
      } catch (err) {
        evaled = false;

        const { body } = await post("https://bin.tritan.gg/documents").send(err.toString());
        return res.json(err);
      }

      if (evaled === null || evaled == false) {
        return;
      }

      if (typeof evaled !== "string") {
        evaled = require("util").inspect(evaled);
      }

      let output = eval(code);
      if (
        output instanceof Promise ||
        (Boolean(output) && typeof output.then === "function" && typeof output.catch === "function")
      )
        output = await output;
      output = inspect(output, { depth: 0, maxArrayLength: null });
      output = clean(output);
      if (output.length < 1000) {
        const { body } = await post("https://bin.tritan.gg/documents").send(output);
        return res.json(output);
      } else {
        const { body } = await post("https://bin.tritan.gg/documents").send(output);

        return res.json(output);
      }

      function clean(text) {
        return text
          .replace(/`/g, "`" + String.fromCharCode(8203))
          .replace(/@/g, "@" + String.fromCharCode(8203));
      }
    });

  /** .get("/commands", async (req, res) => {
      res.setHeader("Content-Type", "application/json");
      return res.json({ commands: Commands });
    }); */
};
