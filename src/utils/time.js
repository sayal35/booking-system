const moment = require("moment-timezone");

function toUTC(dateStr, hour) {
  return moment
    .tz(`${dateStr} ${hour}:00`, "YYYY-MM-DD HH:mm", "Asia/Kathmandu")
    .utc()
    .toDate();
}

module.exports = { toUTC };
