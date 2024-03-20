var acrcloud = require('acrcloud')

var acr = new acrcloud({
	host: 'identify-ap-southeast-1.acrcloud.com',
	access_key: '94750ce3fbe3ff3890174c2cbd8a6b79',
	access_secret: 'plChFe8WOJhlvfqogfE0oxkjeAo4y9GTuWoV6zmB'
})

var danz = async (m, { conn, usedPrefix, command }) => {
	let q = m.quoted ? m.quoted : m
	let mime = (q.msg || q).mimetype || q.mediaType || ''
	if (/video|audio/.test(mime)) {
		let buffer = await q.download()
		await m.reply(wait)
		let { status, metadata } = await acr.identify(buffer)
		if (status.code !== 0) return m.reply(status.msg)
		let { title, artists, album, genres, release_date } = metadata.music[0]
		let txt = `*• Title:* ${title}${artists ? `\n*• Artists:* ${artists.map(v => v.name).join(', ')}` : ''}`
		txt += `${album ? `\n*• Album:* ${album.name}` : ''}${genres ? `\n*• Genres:* ${genres.map(v => v.name).join(', ')}` : ''}\n`
		txt += `*• Release Date:* ${release_date}`
       m.reply(txt.trim())
	} else return m.reply(`Reply audio/video with command ${usedPrefix + command}`)
}
danz.command = danz.help = ['whatmusic', 'tebakmusik']
danz.tags = ['tools']

module.exports = danz