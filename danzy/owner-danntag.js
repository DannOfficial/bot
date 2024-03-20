let fs = require('fs')
let fetch = require('node-fetch')
let danz = async(m, { conn, text, participants }) => {
const fkontak = {
	"key": {
    "participants":"0@s.whatsapp.net",
		"remoteJid": "status@broadcast",
		"fromMe": false,
		"id": "Halo"
	},
	"message": {
		"contactMessage": {
			"vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
		}
	},
	"participant": "0@s.whatsapp.net"
}

    conn.sendMessage(m.chat, { text: text, mentions: participants.map(a => a.id) }, { quoted: fkontak })
    }
danz.help = ['dann <pesan>']
danz.tags = ['group']
danz.command = /^(dann)$/i

danz.group = true
danz.admin = false
danz.owner = true

module.exports = danz