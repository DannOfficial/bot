let danz = async (m, { conn, usedPrefix, command, args: [event], text }) => {
    if (!event) return await conn.reply(m.chat, `Contoh:
${usedPrefix + command} welcome @user
${usedPrefix + command} bye @user
${usedPrefix + command} promote @user
${usedPrefix + command} demote @user`.trim(), m)
    let mentions = text.replace(event, '').trimStart()
    let who = mentions ? conn.parseMention(mentions) : []
    let part = who.length ? who : [m.sender]
    let act = false
    m.reply(`Simulating ${event}...`)
    switch (event.toLowerCase()) {
        case 'add':
        case 'invite':
        case 'welcome':
            act = 'add'
            break
        case 'bye':
        case 'kick':
        case 'leave':
        case 'remove':
            act = 'remove'
            break
        case 'promote':
            act = 'promote'
            break
        case 'demote':
            act = 'demote'
            break
/*        case 'delete':
            deleted = m
            break
*/
        default:
            throw `List Event: welcome, bye, delete, promote, demote`
    }
    if (act) return conn.onParticipantsUpdate({
        id: m.chat,
        participants: part,
        action: act
    })
}
danz.help = ['simulate <event> <@mention>']
danz.tags = ['owner']
danz.command = /^simulate$/i
danz.owner = true
module.exports = danz