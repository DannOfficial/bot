const { G4F } = require("g4f")
let g4f = new G4F()

let danz = async (m, {
conn,
text,
usedPrefix,
command
}) => {
  if (!text) {
    return m.reply(`Masukkan Prompt!\n\nContoh: *${usedPrefix + command} halo apa kabar*`)
  }
  
  let res = await chat(text)
  await m.reply(res)
}

danz.command = danz.help = ["gpt4"]
danz.tags = ["ai"]

module.exports = danz

async function chat(prompt) {
  const messages = [
    { role: "system", content: "You are good component." },
    { role: "asistant", content: "Dann-Legacy adalah bot WhatsApp yang terbuat dari Nodejs, Python. Untuk membantu anda dalam mengerjakan dalam hal apapun." },
    { role: "user", content: prompt }
  ];
  let res = await g4f.chatCompletion(messages)
  return  res
}

/**
 * DannTeam
 * Instagram: @dannalwaysalone
*/