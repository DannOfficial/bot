var danz = async (m, {
    conn,
    groupMetadata,
    usedPrefix,
    text,
    command
}) => {
    if (!text && !m.quoted) return m.reply(`Masukkan Pesan!\n
Contoh: *${usedPrefix + command} save ${m.sender.split("@")[0]}*`)
    var get = await groupMetadata.participants.filter(v => v.id.endsWith('.net')).map(v => v.id)
    var count = get.length;
    var sentCount = 0;
    await m.reply(wait);
    for (var i = 0; i < get.length; i++) {
        setTimeout(async function() {
            if (text) {
                await conn.sendMessage(get[i], {
                    text: text
                });
            } else if (m.quoted) {
                await conn.copyNForward(get[i], m.getQuotedObj(), false);
            } else if (text && m.quoted) {
                await conn.sendMessage(get[i], {
                    text: text + "\n" + m.quoted.text
                });
            }
            count--;
            sentCount++;
            if (count === 0) {
                m.reply(`Berhasil Pushkontak!\nJumlah terkirim: *${sentCount}*`);
            }
        }, i * 1000);
    }
}

danz.command = danz.help = ['pushkontak']
danz.tags = ['owner']
danz.owner = true
danz.group = true
module.exports = danz