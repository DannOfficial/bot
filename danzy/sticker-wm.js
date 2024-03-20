var { sticker } = require('../lib/sticker')
var uploadFile = require('../lib/uploadFile')
var uploadImage = require('../lib/uploadImage')
var { webp2png } = require('../lib/webp2mp4')

var danz = async (m, { conn, text }) => {
  var stiker = false
  try {
    var [packname, ...author] = text.split`|`
    author = (author || []).join`|`
    var q = m.quoted ? m.quoted : m
    var mime = m.quoted.mimetype || ''
    if (/webp/.test(mime)) {
      var img = await q.download()
      var out = await webp2png(img)
      if (!img) return m.reply(`Balas stiker dengan perintah ${usedPrefix + command} <packname>|<author>`)
      stiker = await sticker(0, out, packname || '', author || '')
    } else if (/image/.test(mime)) {
      var img = await q.download()
      var link = await uploadImage(img)
      if (!img) return m.reply(`Balas gambar dengan perintah ${usedPrefix + command} <packname>|<author>`)
      stiker = await sticker(0, link, packname || '', author || '')
    } else if (/video/.test(mime)) {
      if ((q.msg || q).seconds > 11) return m.reply('Maksimal 10 detik!')
      var img = await q.download()
      var link = await uploadFile(img)
      if (!img) return m.reply(`Balas video dengan perintah ${usedPrefix + command} <packname>|<author>`)
      stiker = await sticker(0, link, packname || '', author || '')
    }
  } finally {
    if (stiker) await conn.sendFile(m.chat, stiker, 'wm.webp', '', m, false, { asSticker: true })
    else return m.reply('Conversion failed')
  }
}

danz.help = ['wm <packname>|<author>']
danz.tags = ['sticker']
danz.command = /^(wm|take)$/i

danz.limit = true

module.exports = danz