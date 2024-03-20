var { tiktok } = require('../lib/scrape');
var fetch = require('node-fetch');

var danz = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Masukkan URL!\n\nContoh: *${usedPrefix + command} https://tiktok.com/xxx*`)
  var thumb = 'https://telegra.ph/file/e7e06f759a0549bff9a64.jpg'
  var json = await tiktok(text)
  await m.reply(wait)
await conn.sendFile(m.chat, json.audio, 'tiktok.mp3', null, m, true, {
type: 'audioMessage',  
ptt: false, seconds: 0,contextInfo: { 
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
thumbnail: await (await fetch(thumb)).buffer(),
 thumbnailUrl: sig,
 title: `${json.author + json.title}` }}})
}
danz.help = ['tiktokmp3'].map(v => v + ' <url>')
danz.tags = ['downloader']
danz.command = /^(tikaudio|tiktokmp3|ttdlmp3|ttmp3|tiktokdlmp3|gettt)$/i
module.exports = danz

/**
  * DannTeam
  * ig: @dannalwaysalone
*/