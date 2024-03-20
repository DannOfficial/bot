var { downloadContentFromMessage } = require('@whiskeysockets/baileys')
var danz = m => m

danz.before = async function (m) {
    var chat = db.data.chats[m.chat]
    if (/^[.~#/\$,](read)?viewonce/.test(m.text)) return
    if (!chat.viewonce || chat.isBanned) return
    if (m.mtype == 'viewOnceMessageV2') {
        var msg = m.message.viewOnceMessage.message
        var type = Object.keys(msg)[0]
        var media = await downloadContentFromMessage(msg[type], type == 'imageMessage' ? 'image' : 'video')
        var buffer = Buffer.from([])
        for await (var chunk of media) {
            buffer = Buffer.concat([buffer, chunk])
        }
        if (/video/.test(type)) {
            return this.sendFile(m.chat, buffer, 'media.mp4', msg[type].caption || '', m)
        } else if (/image/.test(type)) {
            return this.sendFile(m.chat, buffer, 'media.jpg', msg[type].caption || '', m)
        }
    }
}

module.exports = danz