/**
* DannTeam
* Instagram: @damnalwaysalone
*/

const simple = require('./lib/simple')
const util = require('util')
const {
  color
} = require('./lib/color')
const moment = require("moment-timezone")
const fetch = require("node-fetch")

const isNumber = x => typeof x === 'number' && !isNaN(x)
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(resolve, ms))

module.exports = {
  async handler(chatUpdate) {
    if (global.db.data == null) await loadDatabase()
    this.msgqueque = this.msgqueque || []
    if (!chatUpdate) return
    this.pushMessage(chatUpdate.messages).catch(console.error)
    if (!(chatUpdate.type === 'notify' || chatUpdate.type === 'append')) return
    let m = chatUpdate.messages[chatUpdate.messages.length - 1]
    if (!m) return
    try {
      m = simple.smsg(this, m) || m
      if (!m) return
      m.exp = 0
      m.limit = false
      try {
        let user = global.db.data.users[m.sender]
        if (typeof user !== 'object') global.db.data.users[m.sender] = {}
        if (user) {
          if (!isNumber(user.exp)) user.exp = 0
          if (!isNumber(user.limit)) user.limit = 1000
          if (!isNumber(user.joinlimit)) user.joinlimit = 1
          if (!isNumber(user.money)) user.money = 100000
          if (!isNumber(user.bank)) user.bank = 100000
          if (!isNumber(user.lastclaim)) user.lastclaim = 0
          if (!('registered' in user)) user.registered = false
          if (!user.registered) {
            if (!('name' in user)) user.name = m.name
            if (!isNumber(user.age)) user.age = -1
            if (!isNumber(user.regTime)) user.regTime = -1
          }
          if (!isNumber(user.afk)) user.afk = -1
          if (!('afkReason' in user)) user.afkReason = ''
          if (!('pasangan' in user)) user.pasangan = ''
          if (!('sahabat' in user)) user.sahabat = ''
          if (!('banned' in user)) user.banned = false
          if (!('premium' in user)) user.premium = false
          if (!isNumber(user.premiumDate)) user.premiumDate = 0
          if (!isNumber(user.bannedDate)) user.bannedDate = 0
          if (!isNumber(user.warn)) user.warn = 0
          if (!isNumber(user.count)) user.count = 0
          if (!isNumber(user.level)) user.level = 0
          if (!('role' in user)) user.role = 'Beginner'
          if (!('autolevelup' in user)) user.autolevelup = true

          if (!isNumber(user.health)) user.health = 100
        } else global.db.data.users[m.sender] = {
          exp: 0,
          limit: 1000,
          joinlimit: 1,
          spammer: 0,
          money: 10000,
          bank: 10000,
          health: 100,
          tiketcoin: 0,
          healtmonster: 100,
          armormonster: 0,
          lastclaim: 0,
          registered: false,
          name: m.name,
          age: -1,
          regTime: -1,
          afk: -1,
          afkReason: '',
          pasangan: '',
          sahabat: '',
          banned: false,
          premium: false,
          warn: 0,
          count: 0,
          pc: 0,
          expg: 0,
          level: 0,
          role: 'Beginner',
          autolevelup: true,
        }
        let chat = global.db.data.chats[m.chat]
        if (typeof chat !== 'object') global.db.data.chats[m.chat] = {}
        if (chat) {
          if (!('isBanned' in chat)) chat.isBanned = false
          if (!('welcome' in chat)) chat.welcome = false
          if (!('autoread' in chat)) chat.autoread = true
          if (!('detect' in chat)) chat.detect = false
          if (!('sWelcome' in chat)) chat.sWelcome = 'Selamat datang @user!'
          if (!('sBye' in chat)) chat.sBye = ''
          if (!('sPromote' in chat)) chat.sPromote = '@user telah di promote'
          if (!('sDemote' in chat)) chat.sDemote = '@user telah di demote'
          if (!('delete' in chat)) chat.delete = false
          if (!('antiLink' in chat)) chat.antiLink = false
          if (!('badword' in chat)) chat.badword = false
          if (!('freply' in chat)) chat.freply = false
          if (!('stiker' in chat)) chat.stiker = false
          if (!('viewonce' in chat)) chat.viewonce = false
          if (!('useDocument' in chat)) chat.useDocument = false
          if (!isNumber(chat.expired)) chat.expired = 0
        } else global.db.data.chats[m.chat] = {
          isBanned: false,
          welcome: false,
          autoread: true,
          detect: false,
          sWelcome: '',
          sBye: '',
          sPromote: '@user telah di promote!',
          sDemote: '@user telah di demote',
          delete: false,
          antiLink: false,
          stiker: false,
          freply: false,
          viewonce: false,
          useDocument: false,
          expired: 0,
        }
        let settings = global.db.data.settings[this.user.jid]
        if (typeof settings !== 'object') global.db.data.settings[this.user.jid] = {}
        if (settings) {
          if (!('self' in settings)) settings.self = false
          if (!('autoread' in settings)) settings.autoread = true
          if (!('restrict' in settings)) settings.restrict = true
          if (!('autorestart' in settings)) settings.autorestart = true
          if (!('restartDB' in settings)) settings.restartDB = 0
          if (!isNumber(settings.status)) settings.status = 0
          if (!('anticall' in settings)) settings.anticall = true
          if (!('clear' in settings)) settings.clear = true
          if (!isNumber(settings.clearTime)) settings.clearTime = 0
          if (!('freply' in settings)) settings.freply = true
        } else global.db.data.settings[this.user.jid] = {
          self: false,
          autoread: true,
          restrict: true,
          autorestart: true,
          restartDB: 0,
          status: 0,
          anticall: false,
          clear: false,
          clearTime: 0,
          freply: true
        }
      } catch (e) {
        console.error(e)
      }
      if (opts['autoread']) await this.readMessages([m.key])
      if (opts['nyimak']) return
      if (!m.fromMe && opts['self']) return
      if (opts['pconly'] && m.chat.endsWith('g.us')) return
      if (opts['gconly'] && !m.chat.endsWith('g.us')) return
      if (opts['swonly'] && m.chat !== 'status@broadcast') return
      if (typeof m.text !== 'string') m.text = ''

      const isROwner = [conn.decodeJid(global.conn.user.id),
        ...global.owner.map(([number, isCreator, isDeveloper]) => number)].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
      const isOwner = isROwner || m.fromMe
      const isMods = isOwner || global.mods.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
      const isPrems = global.db.data.users[m.sender].premium
      const isBans = global.db.data.users[m.sender].banned

      if (opts['queque'] && m.text && !(isMods || isPrems)) {
        let queque = this.msgqueque,
        time = 1000 * 5
        const previousID = queque[queque.length - 1]
        queque.push(m.id || m.key.id)
        setInterval(async function () {
          if (queque.indexOf(previousID) === -1) clearInterval(this)
          else await delay(time)
        },
          time)
      }

      if (m.isBaileys) return
      m.exp += Math.ceil(Math.random() * 10)

      let usedPrefix
      let _user = global.db.data && global.db.data.users && global.db.data.users[m.sender]

      const groupMetadata = (m.isGroup ? (conn.chats[m.chat] || {}).metadata: {}) || {}
      const participants = (m.isGroup ? groupMetadata.participants: []) || []
      const user = (m.isGroup ? participants.find(u => conn.decodeJid(u.id) === m.sender): {}) || {} // User Data
      const bot = (m.isGroup ? participants.find(u => conn.decodeJid(u.id) == this.user.jid): {}) || {} // Your Data
      const isRAdmin = user && user.admin == 'superadmin' || false
      const isAdmin = isRAdmin || user && user.admin == 'admin' || false // Is User Admin?
      const isBotAdmin = bot && bot.admin || false // Are you Admin?
      for (let name in global.danzy) {
        let danzy = global.danzy[name]
        if (!danzy) continue
        if (danzy.disabled) continue
        if (typeof danzy.all === 'function') {
          try {
            await danzy.all.call(this, m, chatUpdate)
          } catch (e) {
            // if (typeof e === 'string') continue
            console.error(e)
          }
        }
        if (!opts['restrict']) if (danzy.tags && danzy.tags.includes('admin')) {
          global.dfail('restrict', m, this)
          continue
        }
        const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
        let _prefix = danzy.customPrefix ? danzy.customPrefix: conn.prefix ? conn.prefix: global.prefix
        let match = (_prefix instanceof RegExp ? // RegExp Mode?
          [[_prefix.exec(m.text), _prefix]]:
          Array.isArray(_prefix) ? // Array?
          _prefix.map(p => {
            let re = p instanceof RegExp ? // RegExp in Array?
            p:
            new RegExp(str2Regex(p))
            return [re.exec(m.text), re]
          }):
          typeof _prefix === 'string' ? // String?
          [[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]]:
          [[[], new RegExp]]
        ).find(p => p[1])
        if (typeof danzy.before === 'function') if (await danzy.before.call(this, m, {
          match,
          conn: this,
          participants,
          groupMetadata,
          user,
          bot,
          isROwner,
          isOwner,
          isRAdmin,
          isAdmin,
          isBotAdmin,
          isPrems,
          isBans,
          chatUpdate,
        })) continue
        if (typeof danzy !== 'function') continue
        if ((usedPrefix = (match[0] || '')[0])) {
          let noPrefix = m.text.replace(usedPrefix, '')
          let [command,
            ...args] = noPrefix.trim().split` `.filter(v => v)
          args = args || []
          let _args = noPrefix.trim().split` `.slice(1)
          let text = _args.join` `
          command = (command || '').toLowerCase()
          let fail = danzy.fail || global.dfail // When failed
          let isAccept = danzy.command instanceof RegExp ? // RegExp Mode?
          danzy.command.test(command):
          Array.isArray(danzy.command) ? // Array?
          danzy.command.some(cmd => cmd instanceof RegExp ? // RegExp in Array?
            cmd.test(command):
            cmd === command
          ):
          typeof danzy.command === 'string' ? // String?
          danzy.command === command:
          false

          if (!isAccept) continue
          m.danzy = name
          if (m.chat in global.db.data.chats || m.sender in global.db.data.users) {
            let chat = global.db.data.chats[m.chat]
            let user = global.db.data.users[m.sender]
            if (name != 'unbanchat.js' && chat && chat.isBanned) return
            if (name != 'unbanuser.js' && user && user.banned) return
          }
          if (danzy.rowner && danzy.owner && !(isROwner || isOwner)) {
            // Owner
            fail('owner', m, this)
            continue
          }
          if (danzy.rowner && !isROwner) {
            // Real Owner
            fail('rowner', m, this)
            continue
          }
          if (danzy.owner && !isOwner) {
            // Number Owner
            fail('owner', m, this)
            continue
          }
          if (danzy.mods && !isMods) {
            // Moderator
            fail('mods', m, this)
            continue
          }
          if (danzy.premium && !isPrems) {
            // Premium
            fail('premium', m, this)
            continue
          }
          if (danzy.banned && !isBans) {
            // Banned
            fail('banned', m, this)
            continue
          }
          if (danzy.group && !m.isGroup) {
            // Group
            fail('group', m, this)
            continue
          } else if (danzy.botAdmin && !isBotAdmin) {
            // Bot Admin
            fail('botAdmin', m, this)
            continue
          } else if (danzy.admin && !isAdmin) {
            // Admin
            fail('admin', m, this)
            continue
          }
          if (danzy.private && m.isGroup) {
            // Private Chat
            fail('private', m, this)
            continue
          }
          if (danzy.register == true && _user.registered == false) {
            // Register
            fail('unreg', m, this)
            continue
          }
          m.isCommand = true
          let xp = 'exp' in danzy ? parseInt(danzy.exp): 17
          if (xp > 9999999999999999999999) m.reply('Dilarang menggunakan *Cheat*!')
          else m.exp += xp
          if (!isPrems && danzy.limit && global.db.data.users[m.sender].limit < danzy.limit * 1) {
            this.reply(m.chat, `Limit anda habis, silahkan beli melalui *${usedPrefix}buyall* atau *${usedPrefix}hadiah*`, m)
            continue
          }
          if (danzy.level > _user.level) {
            this.reply(m.chat, `Diperlukan level ${danzy.level} untuk menggunakan perintah ini. Level kamu ${_user.level}`, m)
            continue
          }
          let extra = {
            match,
            usedPrefix,
            noPrefix,
            _args,
            args,
            command,
            text,
            conn: this,
            participants,
            groupMetadata,
            user,
            bot,
            isROwner,
            isOwner,
            isRAdmin,
            isAdmin,
            isBotAdmin,
            isPrems,
            isBans,
            chatUpdate,
          }
          try {
            await danzy.call(this, m, extra)
            if (!isPrems) m.limit = m.limit || danzy.limit || true
          } catch (e) {
            m.error = e
            console.error(e)
            if (e) {
              let text = util.format(e)
              for (let key of Object.values(global.APIKeys))
                text = text.replace(new RegExp(key, 'g'), '#HIDDEN#')
              if (e.name) for (let [jid] of global.owner.filter(([number, isCreator, isDeveloper]) => isDeveloper && number)) {
                let data = (await conn.onWhatsApp(jid))[0] || {}
                if (data.exists) m.reply(`*File:* ${m.danzy}\n*Sender:* ${m.sender}\n*Chat:* ${m.chat}\n*Command:* ${usedPrefix}${command} ${args.join(' ')}\n\n\`\`\`${text}\`\`\``.trim(), data.jid)
              }
              m.reply(text)
            }
          } finally {
            if (typeof danzy.after === 'function') {
              try {
                await danzy.after.call(this, m, extra)
              } catch (e) {
                console.error(e)
              }
            }
          }
          break
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      if (opts['queque'] && m.text) {
        const quequeIndex = this.msgqueque.indexOf(m.id || m.key.id)
        if (quequeIndex !== -1) this.msgqueque.splice(quequeIndex, 1)
      }

      let user,
      stats = global.db.data.stats
      if (m) {
        if (m.sender && (user = global.db.data.users[m.sender])) {
          user.exp += m.exp
          user.limit -= m.limit * 1
        }

        let stat
        if (m.danzy) {
          let now = + new Date
          if (m.danzy in stats) {
            stat = stats[m.danzy]
            if (!isNumber(stat.total)) stat.total = 1
            if (!isNumber(stat.success)) stat.success = m.error != null ? 0: 1
            if (!isNumber(stat.last)) stat.last = now
            if (!isNumber(stat.lastSuccess)) stat.lastSuccess = m.error != null ? 0: now
          } else stat = stats[m.danzy] = {
            total: 1,
            success: m.error != null ? 0: 1,
            last: now,
            lastSuccess: m.error != null ? 0: now
          }
          stat.total += 1
          stat.last = now
          if (m.error == null) {
            stat.success += 1
            stat.lastSuccess = now
          }
        }
      }

      try {
        require('./lib/print')(m, this)
      } catch (e) {
        console.log(m, m.quoted, e)
      }
      if (opts['autoread']) await this.chatRead(m.chat, m.isGroup ? m.sender: undefined, m.id || m.key.id).catch(() => {})
    }
  },
  async participantsUpdate({
    id, participants, action
  }) {
    if (opts['self']) return
    if (global.isInit) return
    let chat = global.db.data.chats[id] || {}
    let text = ''
    switch (action) {
      case 'add':
      case 'remove':
        if (chat.welcome) {
          let groupMetadata = await this.groupMetadata(id) || (conn.chats[id] || {}).metadata
          for (let user of participants) {
            let pp = './src/avatar_contact.png'
            pp: pp
            try {
              pp = await this.profilePictureUrl(user, 'image')
            } catch (e) {} finally {
              text = (action === 'add' ? (chat.sWelcome || this.welcome || conn.welcome || 'Welcome, @user!').replace('@subject', await this.getName(id)).replace('@desc', groupMetadata.desc ? String.fromCharCode(8206).repeat(4001) + groupMetadata.desc: ''):
                (chat.sBye || this.bye || conn.bye || 'Bye, @user!')).replace('@user', await this.getName(user))
              this.sendFile(id, action === 'add' ? 'Selamat datang @user 👋' : 'Selamat tinggal @user 👋', 'pp.jpg', text, null, false, {
                mentions: [user]
              })
            }
          }
        }
        break
      case 'promote':
        text = (chat.sPromote || this.spromote || conn.spromote || '@user sekarang admin!')
      case 'demote':
        if (!text)
          text = (chat.sDemote || this.sdemote || conn.sdemote || '@user sekarang bukan admin!')
        text = text.replace('@user', '@' + participants[0].split('@')[0])
        if (chat.detect)
          this.sendMessage(id, {
          text, mentions: this.parseMention(text)
        })
        break
    }
  },
  async delete(message) {
    try {
      const {
        fromMe,
        id,
        participant
    } = message
    if (fromMe)
      return
    let msg = this.serializeM(this.loadMessage(id))
    if (!msg)
      return
    let chat = global.db.data.chats[msg.chat] || {}
    if (chat.delete)
      return
    await this.reply(msg.chat, `
      Terdeteksi @${participant.split`@`[0]} telah menghapus pesan
      Untuk mematikan fitur ini, ketik
      *.disable delete*
      `.trim(), msg, {
        mentions: [participant]
    })
  this.copyNForward(msg.chat, msg).catch(e => console.log(e, msg))
} catch (e) {
  console.error(e)
}
},

global.dfail = (type, m, conn) => {
let tdan = 'https://telegra.ph/file/e7e06f759a0549bff9a64.jpg'
let msg = {
rowner: `${global.danied}\n\nPerintah ini hanya dapat digunakan oleh *Real Owner*!`,
owner: `${global.danied}\n\nPerintah ini hanya dapat digunakan oleh *Owner*!`,
mods: `${global.danied}\n\nPerintah ini hanya dapat digunakan oleh *Moderator*!`,
banned: `${global.danied}\n\nPerintah ini hanya untuk pengguna yang terbanned..`,
group: `${global.danied}\n\nPerintah ini hanya dapat digunakan di grup!`,
private: `${global.danied}\n\nPerintah ini hanya dapat digunakan di Chat Pribadi!`,
admin: `${global.danied}\n\nPerintah ini hanya untuk *Admin* grup!`,
botAdmin: `${global.danied}\n\nJadikan bot sebagai *Admin* untuk menggunakan perintah ini!`,
restrict: `${global.danied}\n\nFitur ini di *disable*!`
}[type]
if (msg) return conn.sendMessage(m.chat, {
text: msg,
contextInfo: {
externalAdReply: {
title: namebot,
body: wm,
thumbnailUrl: tdan,
sourceUrl: sig,
mediaType: 1,
renderLargerThumbnail: true
}}})
let dann = `@${m.sender.split("@")[0]}`;
let msgg = {
unreg: `Hai *${dann}*\n\nAnda belum terdaftar!\n\nContoh: *#daftar Manusia.16* atau *#regmail xxx@gmail.com*`
}[type];

if (msgg) {
return conn.sendMessage(m.chat, {
text: msgg,
contextInfo: {
mentionedJid: [m.sender],
externalAdReply: {
title: namebot,
body: wm,
thumbnailUrl: tdan,
sourceUrl: sig,
mediaType: 1,
renderLargerThumbnail: true
}
}
});
}

let msg2 = {
premium: `${global.danied}\n\nPerintah ini hanya dapat digunakan oleh *Premium*!`
}[type]
if (msg2) return conn.sendMessage(m.chat, {
text: msg2,
contextInfo: {
externalAdReply: {
title: namebot,
body: wm,
thumbnailUrl: tdan,
sourceUrl: sig,
mediaType: 1,
renderLargerThumbnail: true
}}})
}

let fs = require('fs')
let chalk = require('chalk')
let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(chalk.redBright("Update 'handler.js'"))
delete require.cache[file]
if (global.reloadHandler) console.log(global.reloadHandler())
})