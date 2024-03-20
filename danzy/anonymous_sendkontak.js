const { Presence } = require('@whiskeysockets/baileys');
const PhoneNumber = require('awesome-phonenumber');

async function danz(m, { command, conn, text }) {
    this.anonymous = this.anonymous || {};
    let who = m.sender;
    let room = Object.values(this.anonymous).find(room => room.check(who));
    if (!room) throw 'Kamu tidak berada di anonymous chat';
    let other = room.other(who);
    var name = text ? text : conn.getName(m.sender);
    var number = who.split('@')[0];
    let vcard = `
BEGIN:VCARD
VERSION:3.0
FN:${name.replace(/\n/g, '\\n')}
TEL;type=CELL;type=VOICE;waid=${number}:${PhoneNumber('+' + number).getNumber('international')}
END:VCARD`;

    this.reply(m.chat, `Kamu berhasil mengirim kontak kepada partner mu..`, m);
    if (other) {
        this.reply(other, `Partner mengirimkan kontak kepadamu`, m);
        this.sendMessage(other, {
            contacts: [{
                displayName: name,
                vcard: vcard
            }]
        });
    }
}

danz.command = danz.help = ['sendkontak'];
danz.tags = ['anonymous'];
danz.private = true;
danz.fail = null;

module.exports = danz;