/**
 * DannTeam
 * ig: @dannalwaysalone
*/

var fs = require('fs');

var danz = async (m, { conn, usedPrefix, text, args, command }) => {
  try {
    const status = conn.fetchStatus(nomorown + "@s.whatsapp.net")
    const authors = await conn.getName(nomorown + "@s.whatsapp.net")
    var name = m.sender;

    var fkonn = {
      key: {
        fromMe: false,
        participant: `0@s.whatsapp.net`,
        ...(m.chat ? { remoteJid: '6283137550315@s.whatsapp.net' } : {})
      },
      message: {
        contactMessage: {
          displayName: `${await conn.getName(name)}`,
          vcard: `BEGIN:VCARD
VERSION:3.0
N:;a,;;;\nFN:${name}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel
END:VCARD`
        }
      }
    };

    if (command == 'creator') {
      var vcard = `BEGIN:VCARD
VERSION:3.0
N:WhatsApp; DannLonely
NICKNAME:👑 Developer
ORG: danz
TITLE:soft
item1.TEL;waid=6283137550315:+62 831-3755-0315
item1.X-ABLabel:Contact Owner
item2.URL:https://wa.me/+6283137550315
item2.X-ABLabel:💬 More
item3.EMAIL;type=INTERNET: danigtps@gmail.com
item3.X-ABLabel:Email
item4.ADR:;;🇮🇩 Indonesia;;;;\nitem4.X-ABADR:💬 More
item4.X-ABLabel:Lokasi
BDAY;value=date:📮20 Desember 2007
END:VCARD`;

      var tag_own = await conn.sendMessage(m.chat, { contacts: { displayName: wm, contacts: [{ vcard }] }}, { quoted: fkonn });

      var caption = `👋 Hai *@${m.sender.split('@')[0]}*, Nih owner saya kak. Jangan dispam yah.`;
      
      await conn.reply(m.chat, caption, fkonn, { mentions: conn.parseMention(caption) });
    }

    if (command == 'owner') {
      var vcard = `BEGIN:VCARD
VERSION:3.0
N:;${authors};;;\nFN:${authors}\nORG:${authors}\nTITLE:\nitem1.TEL;waid=6283137550315:+62 831-3755-0315
item1.X-ABLabel:${authors}\nX-WA-BIZ-DESCRIPTION:${status}
X-WA-BIZ-NAME:${authors}\nEND:VCARD`;
      
      await conn.sendMessage(m.chat, { contacts: { displayName: wm, contacts: [{ vcard }] }}, { quoted: fkonn });

      var caption = `Halo kak @${m.sender.split('@')[0]} itu nomor ownerku, jangan di spam yah kak`;

      await conn.reply(m.chat, caption, fkonn, { mentions: conn.parseMention(caption) });
    }
  } catch (e) {
    console.log(e);
  }
};

danz.command = danz.help = ['owner', 'creator'];
danz.tags = ['info'];

module.exports = danz;