var fetch = require("node-fetch");

var count = 0;

var danz = async (m, {
  conn,
  text,
  usedPrefix,
  command
}) => {
  if (!text) {
    return m.reply(`Masukkan Request!\n
Contoh: *${usedPrefix + command} rpg werewolf min*`);
  }
  
  if (count >= 3) {
    return m.reply("Maaf, maksimal hanya dapat melakukan request 3 kali per hari.");
  }
  
  if (text.length < 10) {
    return m.reply("Alasan harus memiliki minimal 10 kata.");
  }
  
  var dari = "• Dari: @" + m.sender.split("@")[0];
  var randomID = "• ID: " + Math.random().toString(36).substr(2, 9);
  var alasan = "• Alasan: " + text;
  
  var pesan = `${dari}\n${randomID}\n${alasan}`;
  
  var ftext = {
    key: {
      fromMe: false,
      participant: `0@s.whatsapp.net`,
      ...(m.chat ? { remoteJid: "6282331033919-1625305606@g.us" } : {}),
    },
    message: {
      extendedTextMessage: {
        text: text,
        title: namebot,
        jpegThumbnail: await (
          await fetch("https://telegra.ph/file/d9c17295943787a7c7354.jpg")
        ).buffer(),
      },
    },
  };
  
  conn.sendMessage(m.chat, {
    react: {
      text: "🆗",
      key: m.key,
    },
  });
  
  conn.reply(m.chat, `${pesan}\n\nBerhasil dikirim ke owner @${nomorown.split("@")[0]}`, ftext, { mentions: conn.parseMention(pesan) });
  conn.reply(nomorown + "@s.whatsapp.net", pesan, ftext, { mentions: conn.parseMention(pesan) });
  
  count++;
}

danz.command = danz.help = ["request"]
danz.tags = ["main"]

module.exports = danz;