var danz = async (m, {
  conn,
  text,
  usedPrefix,
  command
}) => {
  if (!text) {
    return m.reply(`Masukkan Umur!\n\nContoh: *${usedPrefix + command} 1*`)
  }
  var user = global.db.data.users[m.sender]
  var age = parseInt(text)

  if (age <= 70) {
    user.age = age
    m.reply(`Sukses mengganti umur ke *${age}*`)
  } else {
    m.reply(`Umur maksimal *70 tahun*`)
  }
}

danz.command = danz.help = ["setumur", "setage"]
danz.tags = ["database"]

module.exports = danz