var { Image } = require('node-webpmux');
var { format } = require('util');

var danz = async (m, { conn, text }) => {
	if (!m.quoted) throw 'Reply a sticker!';
	var stiker = false;
	try {
		var [packname, ...author] = text.split('|');
		author = (author || []).join('|');
		var mime = m.quoted.mimetype || '';
		if (!/webp/.test(mime)) return m.reply('Balas sticker!');
		var img = await m.quoted.download();
		if (!img) return m.reply('Balas sticker!');
		var img2 = new Image();
		await img2.load(await m.quoted.download());
		stiker = await addExif(img, packname || '', author || 'ig: @dannalwaysalone');
	} catch (e) {
		console.error(e);
		if (Buffer.isBuffer(e)) stiker = e;
	} finally {
		if (stiker) conn.sendMessage(m.chat, { sticker: stiker }, { quoted: m });
		else return m.reply('Conversion Failed');
	}
};

danz.help = danz.dym = ["smeta"];
danz.tags = ["sticker"];
danz.command = /^(smeta)$/i;

module.exports = danz;

async function addExif(buffer, packname, author, categories = [''], extra = {}) {
	var img = new Image();
	var json = { 'sticker-pack-id': 'DannTeam', 'sticker-pack-name': packname, 'sticker-pack-publisher': author, 'emojis': categories, 'is-avatar-sticker': 1, ...extra };
	var exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
	var jsonBuffer = Buffer.from(JSON.stringify(json), 'utf8');
	var exif = Buffer.concat([exifAttr, jsonBuffer]);
	exif.writeUIntLE(jsonBuffer.length, 14, 4);
	await img.load(buffer);
	img.exif = exif;
	return await img.save(null);
}