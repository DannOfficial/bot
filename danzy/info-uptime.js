let danz = async (m, { conn }) => {
    let _uptime = process.uptime() * 1000
    let uptime = clockString(_uptime)

m.reply(`
┌─〔 R U N T I M E 〕
├ Bot Aktif Selama ${uptime}
└────
    `)
}
danz.help = ['runtime']
danz.tags = ['info']
danz.command = /^(uptime|runtime)$/i

module.exports = danz

function clockString(ms) {
    let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
    let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
    let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}