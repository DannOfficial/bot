/**
  * DannTeam
  * ig: @dannalwaysalone
*/

var { GoogleGenerativeAI } = require("@google/generative-ai");
var genAI = new GoogleGenerativeAI(pickRandom(['AIzaSyAxyeDIZautcsjCWYEfsranT9z-i14wDLU', 'AIzaSyCfH7p_qrkbNJ4pTE51_oU8I6G5tKR8kIs']));
var model = genAI.getGenerativeModel({ model: "gemini-pro" });

var danz = async (m, {
conn,
text,
usedPrefix,
command
}) => {
  if (!text) {
    return m.reply(`Masukkan Prompt!\n\nContoh: *${usedPrefix + command} halo apa kabar*`);
  }  
  var res = await model.generateContent(text);
  m.reply(res.response.text())
}

danz.command = danz.help = ["gemini"]
danz.tags = ["ai"]

module.exports = danz;

function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())]
}