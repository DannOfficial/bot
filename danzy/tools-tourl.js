let uploadFile = require('../lib/uploadFile.js')
let uploadImage = require('../lib/uploadImage.js')

let danz = async (m) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!mime) return m.reply('Tidak ada media')
  let media = await q.download()
  let isTele = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime)
  let link = await (isTele ? uploadImage : uploadFile)(media)
  m.reply(`*Link:*
${link}
Size: ${media.length} Byte's
${isTele ? 'Tidak ada kadaluarsa' : 'Unknown'}`)
}
danz.help = ['upload <reply|media>', 'tourl <reply|media>']
danz.tags = ['tools']
danz.command = /^(tourl|upload)$/i

module.exports = danz