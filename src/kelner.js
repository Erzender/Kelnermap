require("dotenv").config();

const { client } = require("./discordbot");
const express = require("express");
const app = express();
const cors = require("cors");
const core = require("./core");
const randomString = require("./utils").randomString;

let discord = { send: () => {} };

setTimeout(
  () =>
    (discord = client.channels.cache.get(process.env.DISCORD_COMMAND_CHANNEL)),
  2000
);

app.use(cors());
app.use(express.json());

let state = { plateau: {}, tokens: {}, auth: {} };

app.post("/auth", (req, res) => {
  if (!req.body.token) return res.status(403).json({ code: "missing_token" });
  if (!state.tokens[req.body.token])
    return res.status(403).json({ code: "wrong_token" });
  let newToken = randomString(64);
  state = {
    ...state,
    auth: { ...state.auth, [newToken]: state.tokens[req.body.token] }
  };
  delete state.tokens[req.body.token];
  return res.json({ newToken });
});

core.command(async command => {
  if (command.command.length === 0) {
    let token = randomString(36);
    state = {
      ...state,
      tokens: { ...state.tokens, [token]: command.joueureuse }
    };

    discord.send(
      `tellraw ${command.joueureuse} ${JSON.stringify([
        {
          text: "Clique ici",
          color: "red",
          underlined: true,
          clickEvent: {
            action: "open_url",
            value: process.env.URL + "?token=" + token
          }
        },
        {
          text: " pour te connecter",
          color: "white",
          underlined: false
        }
      ])}`
    );
  }
});

app.listen(process.env.PORT || 8081);
