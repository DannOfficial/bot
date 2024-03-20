const axios = require("axios");
const cheerio = require("cheerio");

var danz = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`Masukkan URL!\n\nContoh: *${usedPrefix + command} https://tiktok.com/xxx*`);
    }

    await m.reply(wait);

    var result = await tiktok(text);
    
    if (result.media.length > 0) {
        const videoUrl = result.media[0];
        conn.sendFile(m.chat, videoUrl, '', result.title, m);
    }
}

danz.command = danz.help = ['tt3', 'tiktok3']
danz.tags = ['downloader']

module.exports = danz

async function tiktok(url) {
    return new Promise(async (resolve, reject) => {
        try {
            const tokenn = await axios.get("https://downvideo.quora-wiki.com/tiktok-video-downloader#url=" + url);
            let a = cheerio.load(tokenn.data);
            let token = a("#token").attr("value");
            const param = {
                url: url,
                token: token,
            };
            const { data } = await axios.request("https://downvideo.quora-wiki.com/system/action.php", {
                method: "post",
                data: new URLSearchParams(Object.entries(param)),
                headers: {
                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36",
                    "referer": "https://downvideo.quora-wiki.com/tiktok-video-downloader",
                },
            });
            let res = {
                status: 200,
                title: data.title,
                thumbnail: "https:" + data.thumbnail,
                duration: data.duration,
                media: data.medias,
            };
            resolve(res);
        } catch (e) {
            reject(e);
        }
    });
}