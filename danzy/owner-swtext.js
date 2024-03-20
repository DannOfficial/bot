/**
 * DannTeam
 * Instagram: @dannalwaysalone
*/

let danz = async (m, {
  conn,
  text,
  usedPrefix,
  command
}) => {
  if (!text) {
    return m.reply(`Masukkan Prompt!\n\nContoh: *${usedPrefix + command} halo*`)
  }

  conn.sendMessage(
    'status@broadcast',
    {
      text: text
    }, {
      backgroundColor: randomColor(),
      font: 3,
      statusJidList: [m.sender],
      broadcast: true
    });
  await m.reply(`Berhasil memposting dengan *${text}*`)
}

danz.command = danz.help = ["swtext"]
danz.tags = ["owner", "tools"]
danz.owner = true

module.exports = danz

function randomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}