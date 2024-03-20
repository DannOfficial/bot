var path = require("path");
var fs = require("fs");

var handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Masukkan Nama File!\n\nContoh: ${usedPrefix + command} plugins/creator.js`
  let filePath = path.join(process.cwd(), text)
  if (!fs.existsSync(filePath)) {
  return m.reply('File atau Folder yang anda cari tidak di temukan!')
  }
  if (fs.statSync(filePath).isDirectory()) {
  fs.rmdirSync(filePath, { recursive: true })
  } else {
  fs.unlinkSync(filePath)
  }
  
  m.reply(`Berhasil menghapus ${text}!`)
}

handler.command = handler.help = ['df', 'deletefitur', 'delfitur']
handler.tags = ['owner']
handler.owner = true

module.exports = handler