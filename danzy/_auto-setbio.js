var danz = m => m;
danz.all = async function(m) {
  var setting = db.data.settings[this.user.jid];
  if (new Date() * 1 - setting.status > 1000) {
    var _uptime = process.uptime() * 1000;
    var uptime = clockString(_uptime);
    await this.setBio(`${global.wm2} | Runtime: ${uptime} |  Mode: ${global.opts['self'] ? 'Private' : setting.groupOnly ? 'Group' : 'Publik'} | Version: ${global.version}`).catch(_ => _);
    setting.status = new Date() * 1;
  }
};

module.exports = danz;

function clockString(ms) {
  var h = isNaN(ms) ? '--' : Math.floor(ms / 3600000);
  var m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
  var s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
}