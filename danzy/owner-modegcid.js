var danz = async (m, {
    conn,
    text,
    usedPrefix,
    command
}) => {
    if (!text) {
        return m.reply(`Masukkan ID Grup!\n\nContoh: *${usedPrefix + command} xxx@g.us*\n\nTutorial:\nKetik *${usedPrefix}cekidgc* untuk menampilkan ID Grup`)
    }
  
    if (!text.endsWith('@g.us')) {
        return m.reply("Hanya dapat id grup saja!")
    }
  
    var isPublic = command === "publikgcid";
    var self = global.opts["self"];

    if (self === isPublic) {
        return m.reply(`Bot sudah ${isPublic ? "Publik" : "Self"} dari sebelumnya ${m.sender.split("@")[0] === global.owner[1] ? "Mbak" : "Bang"}`)
    }

    global.opts["self"] = isPublic;

    if (isPublic) {
        let groupMetadata = await conn.groupMetadata(text);
        if (!groupMetadata) {
            return m.reply("Grup tidak ditemukan")
        }
        global.opts["selfId"] = text;
    } else {
        global.opts["selfId"] = "";
    }

    m.reply(`Berhasil ${isPublic ? "mengubah menjadi Publik" : "mengubah menjadi Self"} bot!`)
}

danz.command = danz.help = ["selfgcid", "publikgcid"]
danz.tags = ["owner"]
danz.owner = true

module.exports = danz

/**
  * DannTeam
  * ig: @dannalwaysalone
*/