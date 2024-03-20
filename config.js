const fs = require("fs");
const chalk = require("chalk");

// Owner
global.owner = [
  ['6283137550315'],
  ['6283137550315'],
  ['6283137550315', 'DannLonely', 'danigtps@gmail.com', true]
] // Put your number here
global.mods = ['6283137550315'] // Moderator
global.prems = ['6283137550315'] // Premium
global.APIs = { // API Prefix
  // name: 'https://website'
  dannteam: 'https://api.dannteam.com'
}
global.APIKeys = { // APIKey Here
  // 'https://website': 'apikey'
  'https://api.dannteam.com': 'DannTeam'
}

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

const spack = fs.readFileSync("lib/exif.json")
const stickerpack = JSON.parse(spack)
if (stickerpack.spackname == '') {
  var sticker_name = 'Dann-MD\n\nOwner: +62 831-3755-0315'
  var sticker_author = 'DannTeam'
} else {
  var sticker_name = stickerpack.spackname
  var sticker_author = stickerpack.sauthor
}

const file_exif = "lib/exif.json"
fs.watchFile(file_exif, () => {
  fs.unwatchFile(file_exif)
  console.log(chalk.redBright("Update 'exif.json'"))
  delete require.cache[file_exif]
  require('./lib/exif.json')
})

// Informasi
global.version = 'BETA-Legacy'
global.gcbot = 'https://chat.whatsapp.com/LueZQYfVGWa6Lb1fIAPyHG'
global.namebot = 'Dann-MD Rpg PlayGround\'s'
global.thumb = 'https://telegra.ph/file/96d00335b194ad6bf97c2.jpg'
global.nomorown = '6283137550315'
global.sig = 'https://instagram.com/dannalwaysalone'

// Fake Size
global.fsizedoc = '99999999999999' // default 10TB
global.fpagedoc = '999'

// Watermark
global.packname = sticker_name
global.author = sticker_author
global.wm = '2024 © Dann-Legacy'
global.wm2 = 'Dann\'s'
global.danied = '✘ 𝗘𝗥𝗥𝗢𝗥 𝟰𝟬𝟰'
global.packname = sticker_name
global.author = sticker_author
global.wait = 'Tunggu Sebentar...'

// Tampilan
global.htki =  '⬣───「' // Hiasan kiri
global.htka = '」───⬣' // Hiasan kanan
global.htjava = '•' // Hiasan
global.sa = '╭─'
global.gx = '│✇'
global.gy = '│•'
global.gz = '│'
global.sb = '╰────࿐'
global.kki = '「'
global.kka = '」'
global.zt = '*'
global.zc = ''

global.multiplier = 1000 // The higher, The harder levelup

global.rpg = {
  emoticon(string) {
    string = string.toLowerCase();
    let emot = {
      exp: '✉️',
      money: '💵',
      potion: '🥤',
      diamond: '💎',
      common: '📦',
      uncommon: '🎁',
      mythic: '🗳️',
      legendary: '🗃️',
      pet: '🎁',
      trash: '🗑',
      armor: '🥼',
      sword: '⚔️',
      wood: '🪵',
      rock: '🪨',
      string: '🕸️',
      horse: '🐎',
      cat: '🐈',
      dog: '🐕',
      fox: '🦊',
      petFood: '🍖',
      iron: '⛓️',
      gold: '👑',
      emerald: '💚'
    };
    let results = Object.keys(emot).filter(v => new RegExp(v, 'gi').test(string));
    if (!results.length) return '';
    else return emot[results[0]];
  }
}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  delete require.cache[file]
  require(file)
})