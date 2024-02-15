// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits } = require("discord.js");

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, readyClient => {
  console.log("discord up");
});

client.on("disconnect", () => {
  setTimeout(() => {
    try {
      client.login(JSON.parse(process.env.KELNER_BOT).id);
    } catch (err) {
      console.log(err);
    }
  }, 60000);
});

try {
  client.login(process.env.DISCORD_TOKEN);
} catch (err) {
  console.error(err);
}

exports.client = client;
