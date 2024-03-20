var { tiktok, tiktokslide, tiktoks, tiktok2, tiktokv2 } = require("../lib/scrape");
var fetch = require("node-fetch");

var danz = async (m, { conn, text, usedPrefix, command }) => {
  switch (command) {
    case 'tiktok':
    case 'tt':
    case 'ttdl':
      try {
        if (!text) {
          return conn.reply(m.chat, `Masukkan URL!\n
Contoh: *${usedPrefix + command} https://vt.tiktok.com/xxx*`, m);
        }
        var res = await tiktok(text).catch(async _ => await tiktok2(text).catch(async _ => await tiktokv2(text)));
        var hasil = `• Title: *${res.title}*\n• Username: *${res.author}*`;
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
        await conn.reply(m.chat, wait, fkonn);
        conn.sendFile(m.chat, res.nowm, '', hasil, fkonn, null, { contextInfo: { mentionedJid: [m.sender] } });
      } catch (e) {
        console.log(e);
        return m.reply("Terjadi kesalahan!");
      }
      break;

    case 'tiktoks':
    case 'tiktoktrend':
      if (!text) {
        return conn.reply(m.chat, `Masukkan Username!\n
Contoh: *${usedPrefix + command} notnot8*`, m);
      }
      var result = await tiktoks(text, 'second_parameter'); // Tambahkan parameter yang diperlukan
      var cover = result.cover;
      var name2 = m.sender;
      var fkonn2 = {
        key: {
          fromMe: false,
          participant: `0@s.whatsapp.net`,
          ...(m.chat ? { remoteJid: '6283137550315@s.whatsapp.net' } : {})
        },
        message: {
          contactMessage: {
            displayName: `${await conn.getName(name2)}`,
            vcard: `BEGIN:VCARD
VERSION:3.0
N:;a,;;;\nFN:${name2}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel
END:VCARD`
          }
        }
      };
      await conn.reply(m.chat, wait, fkonn2);
      conn.sendFile(m.chat, result.no_watermark, '', result.title, m, null, {
        contextInfo: {
          forwardingScore: fsizedoc,
          externalAdReply: {
            body: null,
            containsAutoReply: true,
            mediaType: 1,
            mediaUrl: sig,
            renderLargerThumbnail: true,            showAdAttribution: true,
            sourceId: null,
            sourceType: 'PDF',
            previewType: 'PDF',
            sourceUrl: null,
            thumbnail: await (await fetch(cover)).buffer(),
            thumbnailUrl: sig,
            title: `${result.title}`
          }
        }
      });
      await conn.sendFile(m.chat, result.music, 'tiktok.mp3', null, m, true, {
        type: 'audioMessage',
        ptt: false,
        seconds: 0,
        contextInfo: {
          forwardingScore: fsizedoc,
          externalAdReply: {
            body: null,
            containsAutoReply: true,
            mediaType: 1,
            mediaUrl: sig,
            renderLargerThumbnail: true,
            showAdAttribution: true,
            sourceId: null,
            sourceType: 'PDF',
            previewType: 'PDF',
            sourceUrl: null,
            thumbnail: await (await fetch(cover)).buffer(),
            thumbnailUrl: sig,
            title: `${result.title}`
          }
        }
      });
      break;
      
    case 'tiktokslide':
    case 'ttslide':
      if (!text) {
        return conn.reply(m.chat, `Masukkan URL!\n
Contoh: *${usedPrefix + command} https://vt.tiktok/xxx*`, m);
      }
      var result2 = await tiktokslide(text);
      var name3 = m.sender;
      var fkonn3 = {
        key: {
          fromMe: false,
          participant: `0@s.whatsapp.net`,
          ...(m.chat ? { remoteJid: '6283137550315@s.whatsapp.net' } : {})
        },
        message: {
          contactMessage: {
            displayName: `${await conn.getName(name3)}`,
            vcard: `BEGIN:VCARD
VERSION:3.0
N:;a,;;;\nFN:${name3}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel
END:VCARD`
          }
        }
      };
      await conn.reply(m.chat, wait, fkonn3);
      for (let i = 0; i < result2.data.length; i++) {
        var media = result2.data[i];
        await conn.sendFile(m.chat, media.url, '', media.title, m, null, { contextInfo: { mentionedJid: [m.sender] } });
      }
      break;
  }
};

danz.command = danz.help = ["tiktok", "tt", "ttdl", "ttslide", "tiktokslide", "tiktoks", "tiktoktrend"];
danz.tags = ["downloader"];

module.exports = danz;