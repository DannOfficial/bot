var ytdl = require('ytdl-core');
var fs = require('fs');
var ffmpeg = require('fluent-ffmpeg');
var search = require('yt-search');

var danz = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text) return m.reply(`Masukkan Judul!\n\nContoh: *${usedPrefix + command} rewrite the stars*`);

    conn.chatRead(m.chat);
    conn.sendMessage(m.chat, {
      react: {
        text: '🗿',
        key: m.key,
      }
    });

    try {
      var results = await search(text);
      var videoId = results.videos[0].videoId;
      var info = await ytdl.getInfo(videoId);
      var title = info.videoDetails.title.replace(/[^\w\s]/gi, '');
      var thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
      var url = info.videoDetails.video_url;
      var duration = parseInt(info.videoDetails.lengthSeconds);
      var uploadDate = new Date(info.videoDetails.publishDate).toLocaleDateString();
      var views = info.videoDetails.viewCount;
      var minutes = Math.floor(duration / 60);
      var description = results.videos[0].description;
      var seconds = duration % 60;
      var durationText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    
      function formatViews(views) {
        if (views >= 1000000) {
          return (views / 1000000).toFixed(1) + 'M';
        } else if (views >= 1000) {
          return (views / 1000).toFixed(1) + 'K';
        } else {
          return views.toString();
        }
      }

      var audio = ytdl(videoId, { quality: 'highestaudio' });
      var inputFilePath = 'tmp/' + title + '.webm';
      var outputFilePath = 'tmp/' + title + '.mp3';

      var fileSize = 0;
      audio.on('data', (chunk) => {
        fileSize += chunk.length;
        if (fileSize > 50 * 1024 * 1024) {
          audio.destroy();
          fs.unlinkSync(inputFilePath);
          return m.reply('Audio telah mencapai lebih 50MB');
        }
      });
    
      var viewsFormatted = formatViews(views);
      var infoText = `
*${title.toUpperCase()}*
    
╭─ •  「 *YOUTUBE PLAY* 」
│  ◦  *Duration*: ${durationText}
│  ◦  *Upload Date*: ${uploadDate}
│  ◦  *Views*: ${viewsFormatted}
╰──── •
${wm}`;

      conn.sendMessage(m.chat, {
        text: infoText,
        contextInfo: {
          externalAdReply: {
            showAdAttribution: true,
            title: `${title}`,
            body: description,
            thumbnailUrl: thumbnailUrl,
            mediaUrl: url,
            sourceUrl: url,
            mediaType: 2,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: m });

      audio.pipe(fs.createWriteStream(inputFilePath)).on('finish', async () => {
        ffmpeg(inputFilePath)
          .toFormat('mp3')
          .on('end', async () => {
            var thumbnailData = await conn.getFile(thumbnailUrl);
            var buffer = fs.readFileSync(outputFilePath);
            conn.sendMessage(m.chat, { audio: buffer, mimetype: 'audio/mpeg', fileName: 'test' }, { quoted: m });
            fs.unlinkSync(inputFilePath);
            fs.unlinkSync(outputFilePath);
          })
          .on('error', (err) => {
            console.log(err);
            m.reply(`Terjadi kesalahan: ${err.message}`);
            fs.unlinkSync(inputFilePath);
            fs.unlinkSync(outputFilePath);
          })
          .save(outputFilePath);
      });

    } catch (e) {
      console.log(e);
      m.reply(`Terjadi kesalahan saat mencari lagu: ${e.message}`);
    }

  } catch (e) {
    conn.reply(m.chat, `Terjadi kesalahan: ${e}`, m);
  }
};

danz.command = danz.help = ['play'];
danz.tags = ['downloader'];
danz.limit = true;
danz.register = false;

module.exports = danz;