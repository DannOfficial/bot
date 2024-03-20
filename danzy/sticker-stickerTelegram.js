var fetch = require('node-fetch')
var { sticker } = require('../lib/sticker')

var danz = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) return m.reply(`Masukkan URL!\n\nContoh: *${usedPrefix + command} https://t.me/addstickers/namapack*`)
    if (!args[0].match(/(https:\/\/t.me\/addstickers\/)/gi)) return m.reply("URL Salah atau tidak Valid!")
    var packName = args[0].replace("https://t.me/addstickers/", "")
    var gas = await fetch(`https://api.telegram.org/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/getStickerSet?name=${encodeURIComponent(packName)}`, { method: "GET", headers: { "User-Agent": "GoogleBot" } })
    var json = await gas.json()
    m.reply(`*Total stiker:* ${json.result.stickers.length}
*Estimasi selesai:* ${json.result.stickers.length * 1.5} detik`.trim())
    for (var i = 0; i < json.result.stickers.length; i++) {
        var fileId = json.result.stickers[i].thumb.file_id
        var gasIn = await fetch(`https://api.telegram.org/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/getFile?file_id=${fileId}`)
        var jisin = await gasIn.json()
        var stiker = await sticker(false, "https://api.telegram.org/file/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/" + jisin.result.file_path, global.packname, global.author)
        await conn.sendMessage(m.chat, {sticker: stiker })
        await delay(1500)
    }
    m.reply('Berhasil!')
}

danz.help = ['stikertelegram <url>']
danz.tags = ['sticker']
danz.command = /^(stic?kertele(gram)?)$/i

danz.limit = true
danz.premium = true

module.exports = danz

var delay = time => new Promise(res => setTimeout(res, time))