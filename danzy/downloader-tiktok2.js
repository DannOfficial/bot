var { tiktokdl } = require("../lib/scraper");

var danz = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`Masukkan URL!\n\nContoh: *${usedPrefix + command} https://vt.tiktok.com/xxx*`);
  }
  
  if (!text.includes('tiktok.com')) {
    return m.reply(`Masukkan URL Tiktok!\n\nContoh: *${usedPrefix + command} https://vt.tiktok.com/xxx*`);
  }
  
  try {
    var result = await tiktokdl(text);
    var hasil = result.map((res) => {
      var danzy = conn.reply(m.chat, `*${htki} Tiktok Downloader ${htka}*\n
• Title: *${res.title}*
• Description: *${res.description}*
• Duration: *${res.duration}*

_Sedang mengirim Video dan Audio..._`, m);
      return conn.sendFile(m.chat, res.mp4, '', danzy, m);
    });
  } catch (e) {
    console.error(e);
  }
};

danz.command = danz.help = ["tiktok2", "tt2", "ttdl2"];
danz.tags = ["downloader"];

module.exports = danz;