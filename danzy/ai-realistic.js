/**
 * DannTeam
 * Instagram: @dannalwaysalone
*/

const { G4F } = require("g4f")

const g4f = new G4F()

let danz = async (m, {
  conn,
  text,
  usedPrefix,
  command,
}) => {
  if (!text) {
    return m.reply(`Masukkan Prompt!\n\nContoh: *${usedPrefix + command} a village*`)
  }
  let res = await realistic(text)
  let danz = Buffer.from(res, 'base64')
  conn.sendFile(m.chat, danz, '', `*${text}*\n\n${wm}`, m)
}

danz.command = danz.help = ["realistic"]
danz.tags = ["ai"]

module.exports = danz

async function realistic(prompt) {
  const imageGenerator = await g4f.imageGeneration(prompt, {
    debug: true,
    providers: g4f.providers.Pixart,
    providersOptions: {
      height: 512,
      width: 512,
      samplingMethod: "SA-Solver"
    }
  });
  
  return imageGenerator
}