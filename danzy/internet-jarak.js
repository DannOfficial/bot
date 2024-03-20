var axios = require('axios');
var cheerio = require('cheerio');

var danz = async (m, { 
conn,
 text,
 usedPrefix,
 command
 }) => {
	var [from, to] = text.split`|`
	if (!(from && to)) return m.reply(`Contoh: ${usedPrefix + command} jakarta|bandung`)
	var data = await jarak(from, to)
	if (data.img) return conn.sendMessage(m.chat, { image: data.img, caption: data.desc }, { quoted: m })
	else m.reply(data.desc)
}

danz.command = danz.help = ['jarak']
danz.tags = ['internet']

module.exports = danz

async function jarak(dari, ke) {
	var html = (await axios(`https://www.google.com/search?q=${encodeURIComponent('jarak ' + dari + ' ke ' + ke)}&hl=id`)).data
	var $ = cheerio.load(html), obj = {}
	var img = html.split("var s=\'")?.[1]?.split("\'")?.[0]
	obj.img = /^data:.*?\/.*?;base64,/i.test(img) ? Buffer.from(img.split`,` [1], 'base64') : ''
	obj.desc = $('div.BNeawe.deIvCb.AP7Wnd').text()?.trim()
	return obj
}

/**
  * DannTeam
  * ig: @dannalwaysalone
*/