/**
  * DannTeam
  * ig: @dannalwaysalone
*/

let danz = async (m, { conn }) => {
  const c = await conn.groupMetadata(m.chat)
  const online = Object.entries(conn.chats).filter(([k, v]) => k.endsWith('@s.whatsapp.net') && v.presences && c.participants.some(p => k.startsWith(p.id))).sort((a, b) => a[0].localeCompare(b[0], 'id', { sensitivity: 'base' })).map(([k], i) => `*${i + 1}.* @${k.split('@')[0]}`).join('\n');

  let text = `Daftar peserta online di grup ${c.subject}:\n
`
  text += online

  conn.reply(m.chat, text, m)
}

danz.command = danz.help = ["listonline"]
danz.tags = ["group"]

module.exports = danz