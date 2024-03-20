let danz = async (m, { conn, text, isOwner }) => {   
   if (!text) return m.reply('_Masukkan Nama Grup!_')
   try{
    m.reply(wait)
    let group = await conn.groupCreate(text, [m.sender])
    let link = await conn.groupInviteCode(group.gid)
    let url = 'https://chat.whatsapp.com/' + link;
    m.reply('_Berhasil Membuat Grup *' + text + '*_\n\n*Nama:* ' + text + '\n*ID:* ' + group.gid + '\n*Link:* ' + url)
    } catch (e) {
    let [namagc, partici] = text.split('|')
    if (!namagc) return m.reply('Format Salah!')
    if (!partici) return m.reply('Tag user sebagai member baru!')
    let mem = conn.parseMention(`@${parseInt(m.sender)} ${partici}`)
    let ha = await conn.groupCreate(namagc, mem).catch(console.error)
    console.log(JSON.stringify(ha));
    await m.reply(`*GROUP CREATE*

\`\`\`Group Telah Dibuat @${m.sender.replace(/@.+/, '')}\`\`\`


${JSON.stringify(ha.participants)}`)
     conn.groupMakeAdmin(ha.gid, [m.sender])
   if (!isOwner) {
      await conn.modifyChat(ha.gid, 'delete', {
            includeStarred: false
          }).catch(console.error)
         conn.groupLeave(ha.gid)
    }
  }
}
danz.command = danz.help = ['creategroup', 'creategc', 'buatgc']
danz.tags = ['owner']
danz.group = true
danz.premium = true

module.exports = danz