const ytdl = require("ytdl-core");
const yts = require("yt-search");

let danz = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text) {
      return m.reply(`Masukkan URL!\n\nContoh: *${usedPrefix + command} https://youtube.com/xxx*`)
    }

    if (!text.includes('youtube.com') && !text.includes('youtu.be')) {
      return m.reply(`Masukkan URL YouTube!\n\nContoh: *${usedPrefix + command} https://youtube.com/xxx*`)
    }

    let videoUrl = text.trim();
    let validUrl = ytdl.validateURL(videoUrl);

    if (!validUrl) {
      let searchResults = await yts(videoUrl);
      if (searchResults.videos.length === 0) {
        return m.reply("Tidak ada media yang ditemukan!");
      }
      videoUrl = searchResults.videos[0].url;
    }

    try {
      conn.chatRead(m.chat);
      conn.sendMessage(m.chat, {
        react: {
          text: "🗿",
          key: m.key,
        },
      });

      let info = await ytdl.getInfo(videoUrl);
      let videoFormat = ytdl.chooseFormat(info.formats, { quality: "highest" });

      if (!videoFormat) {
        return m.reply("Tidak dapat menemukan Video Format.");
      }

      await conn.sendFile(
        m.chat,
        videoFormat.url,
        `${info.videoDetails.title}.mp4`,
        `◦ *Title:* ${info.videoDetails.title}\n◦ *Duration:* ${info.videoDetails.lengthSeconds} seconds\n\n${wm}`,
        m
      );
    } catch (e) {
      console.log(e);
      return m.reply("Terjadi kesalahan.");
    }

  } catch (e) {
    conn.reply(m.chat, `Terjadi kesalahan: ${e}`, m);
  }
};

danz.command = danz.help = ["ytv", "ytmp4"]
danz.tags = ["downloader"];
danz.limit = true;

module.exports = danz;