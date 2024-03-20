const axios = require("axios")

let danz = async (m, {
conn,
text,
usedPrefix,
command
}) => {
  if (!text) {
    return m.reply(`Masukkan Pertanyaan!\n\nContoh: *${usedPrefix + command} siapa kamu*`)
  }
  
  let res = await bard(text)
  conn.reply(m.chat, res, m)
}

danz.command = danz.help = ["bard", "gbard"]
danz.tags = ["ai"]

module.exports = danz

async function bard(prompt) {
  try {
    const response = await axios.post('https://bardieapi.fasturl.cloud/api/onstage', {
      ask: prompt
    }, {
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      }
    });
    return response.data.content;
  } catch (error) {
    console.error(error);
  }
}

/**
 * DannTeam
 * ig: @dannalwaysalone
*/