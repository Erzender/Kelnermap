const fetch = require("node-fetch");
const fs = require("fs");
const FTPClient = require("ssh2-sftp-client");

exports.whitelister = async (client, message, args, player) => {
  if (args.length < 3) return message.channel.send("qui ?");

  try {
    let info = "";
    let sftp = new FTPClient();
    await sftp.connect({
      host: JSON.parse(process.env.KELNER_FTP).host,
      port: JSON.parse(process.env.KELNER_FTP).port,
      username: JSON.parse(process.env.KELNER_FTP).usr,
      password: JSON.parse(process.env.KELNER_FTP).pwd
    });
    let file = __dirname + "/../../../whitelist.json";
    await sftp.fastGet("/whitelist.json", file);
    let content = require(__dirname + "../../../whitelist.json");

    info = await (
      await fetch("http://tools.glowingmines.eu/convertor/nick/" + args[2])
    ).json();
    content.push({
      uuid: [8, 13, 18, 23].reduce(
        (total, cur) => total.slice(0, cur) + "-" + total.slice(cur),
        info.offlineuuid
      ),
      name: info.nick
    });
    content = content.filter(
      (item, pos, self) =>
        self.findIndex(item2 => item2.name === item.name) === pos
    );
    fs.writeFile(file, JSON.stringify(content), "utf8", () => {});
    await sftp.fastPut(file, "/whitelist.json");
    await sftp.end();
  } catch (err) {
    console.log(err);
    return message.channel.send("ça s'est chié");
  }
  message.channel.send("Ok.");
  let channel;
  try {
    channel = client.channels.get(JSON.parse(process.env.KELNER_BOT).console);
  } catch (err) {
    console.log(err);
    return;
  }
  channel.send("whitelist reload");
};