const delay = (time) => new Promise((res) => setTimeout(res, time))

let danz = async (m, { conn, text, usedPrefix, command, args, participants }) => {
  const time = db.data.users[m.sender].lastjoin + 86400000
  const linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i

  const name = m.sender
  const fkonn = {
    key: {
      fromMe: false,
      participant: '0@s.whatsapp.net',
      ...(m.chat ? { remoteJid: '6283137550315@s.whatsapp.net' } : {}),
    },
    message: {
      contactMessage: {
        displayName: await conn.getName(name),
        vcard: `BEGIN:VCARD
VERSION:3.0
N:;a,;;;
FN:${name}
item1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}
item1.X-ABLabel:Ponsel
END:VCARD`,
      },
    },
  }

  const [_, code] = text.match(linkRegex) || []

  if (!args[0]) return m.reply(`Masukkan Link!\n
Contoh: *${usedPrefix + command} https://chat.whatsapp.com/xxx*`)
  if (!code) return m.reply("Link tidak valid")
  if (!args[1]) return m.reply("Berapa hari?")
  if (isNaN(args[1])) return m.reply("Hanya angka yang mewakili hari!")

  const anubot = owner[0]
  m.reply('Tunggu 3 detik bot akan join')
  await delay(3000)

  try {
    const res = await conn.groupAcceptInvite(code)
    const b = await conn.groupMetadata(res)

    const d = b.participants.map((v) => v.id)
    const member = d.toString()
    const e = d.filter((v) => v.endsWith(anubot + '@s.whatsapp.net'))
    const jumlahHari = 86400000 * args[1]
    const now = new Date() * 1

    if (now < global.db.data.chats[res].expired) {
      global.db.data.chats[res].expired += jumlahHari
    } else {
      global.db.data.chats[res].expired = now + jumlahHari
    }

    if (e.length) {
      await m.reply(`Sukses invite bot ke group

${await conn.getName(res)}\n
Bot akan keluar secara otomatis setelah *${msToDate(global.db.data.chats[res].expired - now)}*`)
      await conn.reply(res, `Ada @${anubot} Owner-ku Di Sini, Aku Mau Keluar Aja Dah, Takut Kena Marah.

@${conn.user.jid.split(`@`)[0]} akan keluar 5 detik lagi
Bye😑
Thanks dah invite *${m.name}*`, fkonn, {
        mentions: d
      })
      await delay(5000)
      await conn.reply(res, `Tapi Boong 🤭`, 0)
      await conn.reply(owner[0] + '@s.whatsapp.net', `*INVITING!*\n
@${m.sender.split('@')[0]} telah mengundang ${conn.user.name} ke grup

${await conn.getName(res)}\n
${res}\n
Pesan : ${args[0]}\n
Bot akan keluar otomatis setelah *${msToDate(global.db.data.chats[res].expired - now)}*`, null, { mentions: [m.sender] })
    } else {
      await conn.reply(owner[0] + '@s.whatsapp.net', `*INVITING!*\n
@${m.sender.split('@')[0]} telah mengundang ${conn.user.name} ke grup

${await conn.getName(res)}\n
${res}\n
Pesan : ${args[0]}\n
Bot akan keluar otomatis setelah *${msToDate(global.db.data.chats[res].expired - now)}*`, null, { mentions: [m.sender] })
      await m.reply(`Sukses invite bot ke group

${await conn.getName(res)}\n
Bot akan keluar secara otomatis setelah *${msToDate(global.db.data.chats[res].expired - now)}*`)
      const mes = `Hello Everyone👋🏻

*${conn.user.name}* adalah salah satu Bot WhatsApp Multi-Device yang di bangun dengan Node.js, *${conn.user.name}* Baru aja di invite oleh *${m.name}*
Untuk menggunakan *${conn.user.name}* silahkan ketik
#menu

@${conn.user.jid.split('@')[0]} akan keluar secara otomatis setelah *${msToDate(global.db.data.chats[res].expired - now)}*`

      await conn.reply(res, mes, fkonn, { mentions: d })
    }
  } catch (e) {
    conn.reply(owner[0] + '@s.whatsapp.net', e)
    throw `Maaf bot tidak bisa bergabung ke grup!`
  }
}

danz.help = ['joins <chat.whatsapp.com> <day>']
danz.tags = ['owner']
danz.command = /^joins(ewa)?$/i
danz.owner = true

module.exports = danz

function msToDate(ms) {
  const days = Math.floor(ms / (24 * 60 * 60 * 1000))
  const daysms = ms % (24 * 60 * 60 * 1000)
  const hours = Math.floor((daysms) / (60 * 60 * 1000))
  const hoursms = ms % (60 * 60 * 1000)
  const minutes = Math.floor((hoursms) / (60 * 1000))
  const minutesms = ms % (60 * 1000)
  const sec = Math.floor((minutesms) / 1000)
  
  return days + " hari " + hours + " jam " + minutes + " menit"
}

function msToTime(duration) {
  const milliseconds = parseInt((duration % 1000) / 100)
  const seconds = Math.floor((duration / 1000) % 60)
  const minutes = Math.floor((duration / (1000 * 60)) % 60)
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

  const hoursFormatted = (hours < 10) ? "0" + hours : hours
  const minutesFormatted = (minutes < 10) ? "0" + minutes : minutes
  const secondsFormatted = (seconds < 10) ? "0" + seconds : seconds

  return hoursFormatted + " jam " + minutesFormatted + " menit"
}