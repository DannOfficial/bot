let danz = m => m

let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i
danz.before = async function (m, { user, isBotAdmin, isAdmin }) {
  if ((m.isBaileys && m.fromMe) || m.fromMe || !m.isGroup) return true
  let chat = global.db.data.chats[m.chat]
  let isGroupLink = linkRegex.exec(m.text)
  let hapus = m.key.participant
  let bang = m.key.id

  if (chat.antiLink && isGroupLink) {
    await m.reply(`${htki} *Antilink* ${htka}\n\nTerdeteksi *${await conn.getName(m.sender)}* kamu telah mengirim link group!\n\nMaaf kamu akan dikeluarkan dari group`)
    if (isAdmin) return m.reply('*Kamu admin, tidak dapat dikick*')
    if (!isBotAdmin) return m.reply('*Bot tidak menjadi admin*')
    let linkGC = ('https://chat.whatsapp.com/' + await conn.groupInviteCode(m.chat))
    let isLinkconnGc = new RegExp(linkGC, 'i')
    let isgclink = isLinkconnGc.test(m.text)
    if (isgclink) return m.reply('Antilink terdeteksi! kamu akan saya kick!')
    await conn.groupParticipantsUpdate(m.chat, [m.sender], "remove")
    return conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: hapus }})
  }
  return true
}

module.exports = danz