let { webp2png } = require('../lib/webp2mp4')

let danz = async (m, { conn, isOwner, usedPrefix, command, text }) => {
  if (!isOwner) throw false
  try {
    var q = m.quoted ? m.quoted : m
    var ras = await q.download()
    var sel = await webp2png(ras)
  } finally {
    if (sel) await conn.sendStimg(m.chat, sel, m, { packname: global.packname, author: global.author })
    else throw false
  }
}

danz.help = ['colong <reply sticker>']
danz.tags = ['owner']
danz.command = /^(co?lo?n?g)$/i

module.exports = danz