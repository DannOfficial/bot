var { igdl } = require("../lib/scrape")

var danz = async (m, {
conn,
text,
usedPrefix,
command
}) => {
  if (!text) {
  return m.reply(`Masukkan URL!\n\nContoh: *${usedPrefix + command} https://instagram.com/reels/xxx*`)
  }
  if (!text.includes('instagram.com')) {
  return m.reply(`Masukkan URL Instagram!\n\nContoh: *${usedPrefix + command} https://instagram.com/reels/xxx*`)
  }
  var res = await igdl(text)
  await m.reply(wait)
  conn.sendFile(m.chat, res[0].url, '', wm, m)
}

danz.command = danz.help = ["ig", "igdl"]
danz.tags = ["downloader"]

module.exports = danz