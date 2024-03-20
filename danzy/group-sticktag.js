var fetch = require('node-fetch')
var { sticker } = require('../lib/sticker.js')
var uploadFile = require('../lib/uploadFile.js')
var uploadImage = require('../lib/uploadImage.js')
var { webp2png } = require('../lib/webp2mp4.js')

var danz = async (m, { conn, text, usedPrefix, command, participants}) => {
var who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
var pp = await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://telegra.ph/file/a2ae6cbfa40f6eeea0cf1.jpg')
var name = await conn.getName(who)
var stiker = false

    if (!m.quoted) throw 'reply stikernya...'
  var mime = m.quoted.mimetype || ''
  if (!/webp/.test(mime)) throw 'stiker invalid'
  var media = await m.quoted.download()
  var out = Buffer.alloc(0)
    try {
    out = await uploadImage(media)
    } catch {
    out = await webp2png(media)
    }
    
    stiker = await sticker(false, out, global.packname, global.author)
    if (stiker) conn.sendFile(m.chat, stiker, 'sticker.webp', '', m, null, { fileLength: fsizedoc, contextInfo: {
    mentions: participants.map(a => a.id),
      externalAdReply :{
        showAdAttribution: true,
        mediaUrl: sig,
        mediaType: 2,
        description: wm, 
        title: '👋 Hai, ' + name + ' ',
        body: botdate,
       thumbnail: await(await fetch(pp)).buffer(),
      sourceUrl: sgc
     }}
  })
}

danz.help = ['stickertag <caption|reply>', 'sticktag <url>']
danz.tags = ['group']
danz.command = /^(stickertag|sticktag)$/i

module.exports = danz


var isUrl = (text) => {
  return text.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|gif|png)/, 'gi'))
}