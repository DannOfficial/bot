var axios = require("axios");

var danz = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) {
    return m.reply(`Masukkan URL!\n\nContoh: *${usedPrefix + command} https://dannteam.com*`)
  }

  try {
    var screenshot = await ssweb(text, 'desktop');
    if (screenshot.status === 200) {
      await conn.sendFile(m.chat, screenshot.result, '', wm, m);
    } else {
      return m.reply('Gagal mengambil screenshot.');
    }
  } catch (error) {
    console.error(error);
    return m.reply('Terjadi kesalahan dalam pengambilan screenshot.');
  }
}

danz.help = ['ssweb'];
danz.tags = ['internet', 'tools'];
danz.command = /^ss(web)?f?$/i;

danz.limit = true;
danz.fail = null;

module.exports = danz;

async function ssweb(url, device = 'desktop') {
  return new Promise((resolve, reject) => {
    var base = 'https://www.screenshotmachine.com';
    var param = {
      url: url,
      device: device,
      cacheLimit: 0
    };
    axios({
      url: base + '/capture.php',
      method: 'POST',
      data: new URLSearchParams(Object.entries(param)),
      headers: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).then((data) => {
      var cookies = data.headers['set-cookie'];
      if (data.data.status == 'success') {
        axios.get(base + '/' + data.data.link, {
          headers: {
            'cookie': cookies.join('')
          },
          responseType: 'arraybuffer'
        }).then(({ data }) => {
          result = {
            status: 200,
            result: data
          };
          resolve(result);
        });
      } else {
        reject({ status: 404, statuses: 'Terjadi kesalahan!', message: data.data });
      }
    }).catch(reject);
  });
}