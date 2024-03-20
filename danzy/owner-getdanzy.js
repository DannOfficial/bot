const { readFileSync } = require('fs')

let danz = async (m, { usedPrefix, command, text }) => {
    let ar = Object.keys(danzy)
    let ar1 = ar.map(v => v.replace('.js', ''))
    if (!text) throw `uhm.. teksnya mana?\n\ncontoh:\n${usedPrefix + command} creator`
    if (!ar1.includes(text)) return m.reply(`'${text}' tidak ditemukan!\n\n${ar1.map(v => ' ' + v).join`\n`}`)
    let dann = readFileSync('./danzy/' + text + '.js', 'utf-8')
    let thumb = 'https://telegra.ph/file/e7e06f759a0549bff9a64.jpg'
    conn.sendMessage(m.chat, {
text: dann,
contextInfo: {
externalAdReply: {
title: namebot,
body: wm,
thumbnailUrl: thumb,
sourceUrl: sig,
mediaType: 1,
renderLargerThumbnail: true
}}})
}
danz.help = ['getcmd'].map(v => v + ' <teks>')
danz.tags = ['owner']
danz.command = /^(getcommand|gcmd|gd)$/i

danz.owner = true

module.exports = danz