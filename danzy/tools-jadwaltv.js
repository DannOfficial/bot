var fs = require('fs');
var axios = require('axios');
var cheerio = require('cheerio');

var danz = async (m, { text, usexPrefix, command }) => {
	if (!text) return m.reply(`Masukkan Channel!\n\nContoh: *${usedPrefix + command} mnctv*`)
	let res = await jadwalTV(text)
	let txt = res.result.map((v) => `[${v.jam.replace('WIB', ' WIB')}] ${v.acara}`).join`\n`
	m.reply(`Jadwal TV ${res.channel}\n\n${txt}`)
}
danz.help = ['jadwaltv']
danz.tags = ['tools']
danz.command = /^jadwaltv$/i

module.exports = danz

async function jadwalTV(name) {
	let list = JSON.parse(fs.readFileSync('./src/jadwaltv.json', 'utf-8'))
	let data = list.find((v) => (new RegExp(name, 'gi')).test(v.channel)), result = []
	if (!data) throw 'List Channel:\n\n' + list.map(v => v.channel).sort().join('\n')
	let html = (await axios.get(`https://www.jadwaltv.net/${data.isPay ? 'jadwal-pay-tv/' : ''}${data.value}`)).data
	let $ = cheerio.load(html)
	$('div > table.table').find('tbody > tr').slice(1).each(function () {
		let jam = $(this).find('td').eq(0).text()
		let acara = $(this).find('td').eq(1).text()
		if (!/Jadwal TV/gi.test(acara) && !/Acara/gi.test(acara)) result.push({ jam, acara })
	})
	return { channel: data.channel.toUpperCase(), result }
}