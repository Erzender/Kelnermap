exports.SERPILLER = async (client, message, args, player) => {
  message.channel.send("weather Theia clear");
  message.channel.send(
    `tellraw @a ["",{"text":"["},{"text":"SERPILLER","bold":true,"color":"dark_red"},{"text":">","bold":true},{"text":" A","obfuscated":true,"color":"gold"},{"text":"QUE LA LUMIERE SAUCE !","color":"gold"},{"text":"A","obfuscated":true,"color":"gold"}]`
  );
};
