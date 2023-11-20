const { CronJob } = require("cron");
const { execCommand } = require("./commands");

const init = commander => {
  const job = new CronJob(
    "* * * * * *", // cronTime
    function() {
      commander.exec();
    }, // onTick
    null, // onComplete
    true, // start
    "Europe/Paris" // timeZone
  );
};

exports.cron = init;
