var { createHash } = require('crypto')
var fetch = require('node-fetch')
var Reg = /\|?(.*)([.|] *?)([0-9]*)$/i

var danz = async (m, { conn, usedPrefix, command }) => {
	function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}
  var name = conn.getName(m.sender)
  var age = pickRandom(['30','29','28','27','26','25','24','23','22','21','20','19','18','17','16','15','14','13','12','11','10','9'])
  var user = global.db.data.users[m.sender]
  if (user.registered === true) throw `Anda sudah terdaftar\nMau daftar ulang? ${usedPrefix}unreg <SN|SERIAL NUMBER>`
  user.name = name.trim()
  user.age = age
  user.regTime = + new Date
  user.registered = true
  var sn = createHash('md5').update(m.sender).digest('hex')
  var who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.fromMe ? conn.user.jid : m.sender
  var thumb = 'https://telegra.ph/file/b5cc36920ff446bd25de7.jpg'
  var cap = `
Daftar berhasil!

╭─「 Info User 」
│ Nama: ${name}
│ Umur: ${age} tahun
│ SN: ${sn}
╰────

*Jika SN kamu lupa ketik ${usedPrefix}ceksn*`
   conn.sendFile(m.chat, thumb, 'register.jpg', `${cap}`, m)
}
danz.help = ['daftar2']
danz.tags = ['main']
danz.command = /^(daftar2)$/i

module.exports = danz