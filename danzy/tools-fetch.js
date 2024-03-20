let fetch = require('node-fetch')
let util = require('util')
let danz = async (m, { text }) => {
  if (!/^https?:\/\//.test(text)) throw 'Awali *URL* dengan http:// atau https://'
  let _url = new URL(text)
  let url = global.API(_url.origin, _url.pathname, Object.fromEntries(_url.searchParams.entries()), 'APIKEY')
  let res = await fetch(url)
  if (res.headers.get('content-length') > 100 * 1024 * 1024 * 1024) {
    delete res
    throw `Content-Length: ${res.headers.get('content-length')}`
  }
  if (!/text|json/.test(res.headers.get('content-type'))) return conn.sendFile(m.chat, url, 'file', `*Link:* ${await shortlink(text)}\n\n${wm}`, m)
  let txt = await res.buffer()
  try {
    txt = util.format(JSON.parse(txt+''))
  } catch (e) {
    txt = txt + ''
  } finally {
    m.reply(txt.slice(0, 65536) + '')
  }
}

danz.help = ['get'].map(v => v + ' <url>')
danz.tags = ['internet']
danz.command = /^(fetch|get)$/i
danz.premium = false
danz.limit = true

module.exports = danz

async function shortlink(url) {
isurl = /https?:\/\//.test(url)
return isurl ? (await require('axios').get('https://tinyurl.com/api-create.php?url='+encodeURIComponent(url))).data : ''
}