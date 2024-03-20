var { createHash } = require('crypto')
var Reg = /\|?(.*)([.|] *?)([0-9]*)$/i

var handler = async function (m, { conn, text, usedPrefix }) {
  var user = global.db.data.users[m.sender]
  if (user.registered === true) throw `Anda sudah terdaftar\nMau daftar ulang? ${usedPrefix}unreg <SN|SERIAL NUMBER>`
  if (!Reg.test(text)) throw `Format salah\n*${usedPrefix}daftar nama.umur*`
  var [_, name, splitter, age] = text.match(Reg)
  if (!name) throw 'Nama tidak boleh kosong (Alphanumeric)'
  if (!age) throw 'Umur tidak boleh kosong (Angka)'
  age = parseInt(age)
  if (age > 60) throw 'Umur terlalu tua 😂'
  if (age < 6) throw 'Bayi bisa ngetik sesuai format bjir ._.'
  var __waktuh = (new Date - global.db.data.users[m.sender].reglast)
   var _waktuh = (+ 86400000 - __waktuh)
   var waktuh = clockString(_waktuh)
   if (new Date - global.db.data.users[m.sender].reglast > + 86400000) {
   user.reglast = new Date * 1
  user.name = name.trim()
  user.age = age
  user.regTime = + new Date
  user.registered = true
  var expnye = global.db.data.users[m.sender].exp += 10000
  var uang = global.db.data.users[m.sender].money += 20000
  var limitnye = global.db.data.users[m.sender].limit += 20
// var nabungnye = global.db.data.users[m.sender].nabung += 100000
// var banknye = global.db.data.users[m.sender].bank += 1000000
// var petnye = global.db.data.users[m.sender].pet += 20
// var cuponye = global.db.data.users[m.sender].cupon += 10
// var legendarynye = global.db.data.users[m.sender].legendary += 50
// var boxs = global.db.data.users[m.sender].boxs += 50
// var berliannye = global.db.data.users[m.sender].berlian += 5
// var emasbatangnye = global.db.data.users[m.sender].emasbatang += 10
// var emasbiasanye = global.db.data.users[m.sender].emasbiasa += 15
// var botolnye = global.db.data.users[m.sender].botol += 10000
// var karudsnye = global.db.data.users[m.sender].kardus += 10000
// var kalengnye = global.db.data.users[m.sender].kaleng += 10000
// var anggurnye = global.db.data.users[m.sender].anggur += 10000
// var jeruknye = global.db.data.users[m.sender].jeruk += 10000
// var apelnye = global.db.data.users[m.sender].apel += 10000
// var pisangnye = global.db.data.users[m.sender].pisang += 10000
// var mangganye = global.db.data.users[m.sender].mangga += 10000
  var chatnye =`Selamat kamu mendapatkan :\n+1000 Exp\n+1000 Money\n+5 Limit` // \n\nJangan lupa ketik :\n${usedPrefix}codereg 070698\nUntuk mendapatkan bonus! \n+100000 Nabung Exp\n+1000000 Nabung Money\n+10 Cupon\n+10 Pet Random\n+50 Boxs\n+50 Legendary\n+5 Berlian\n+15 EmasBiasa\n+10 EmasBatang\n+10000 Kaleng\n+10000 Kardus\n+10000 Botol\n+10000 Anggur\n+10000 Jeruk\n+10000 Apel\n+10000 Mangga\n+10000 Pisang`
  var sn = createHash('md5').update(m.sender).digest('hex')
  m.reply(`
Daftar berhasil!

╭─「 Info User 」
│ Nama: ${name}
│ Umur: ${age} tahun
│ SN: ${sn}
╰────

*Jika SN kamu lupa ketik ${usedPrefix}ceksn*

${chatnye}
`.trim())
} else m.reply(`Kamu sudah *daftar*..\nMohon tunggu ${waktuh} untuk bisa *daftar* kembali..`)
}
handler.help = ['daftar'].map(v => v + ' <nama>.<umur>')
handler.tags = ['main']

handler.command = /^(daftar|reg(ister)?)$/i

module.exports = handler

function clockString(ms) {
  var h = Math.floor(ms / 3600000)
  var m = Math.floor(ms / 60000) % 60
  var s = Math.floor(ms / 1000) % 60
  console.log({ms,h,m,s})
  return [h, m, s].map(v => v.toString().padStart(2, 0) ).join(':')
}