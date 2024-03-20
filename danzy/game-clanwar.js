var danz = async (m, { conn, participants }) => {
  conn.level = global.db.data.users[m.sender]
  conn.fight = conn.fight || {}
  var delay = (time) => new Promise(res => setTimeout(res, time));
  var thumb = 'https://telegra.ph/file/22384cfe132439a632d9e.jpg';

  if (new Date() - global.db.data.users[m.sender].lastmulung < 1800000) throw `Clan kamu sudah kecapekan berperang\n\nTunggu ${msToTime(time - new Date())} lagi`;

  var users = participants.map(u => u.id);
  var lawan = users[Math.floor(users.length * Math.random())];

  while (typeof global.db.data.users[lawan] === "undefined" || lawan === m.sender) {
    lawan = users[Math.floor(users.length * Math.random())];
  }

  var lamaPertarungan = getRandom(1, 1);

  m.reply(`Kamu dan ${conn.getName(lawan)} sedang dalam pertarungan sengit.\n\nTunggu ${lamaPertarungan} menit lagi dan lihat siapa yang menang.`);

  conn.fight[m.sender] = true;

  await delay(1 * 1 * lamaPertarungan);

  var kesempatan = [];
  for (var i = 0; i < global.db.data.users[m.sender].money; i++) kesempatan.push(m.sender);
  for (var i = 0; i < global.db.data.users[lawan].money; i++) kesempatan.push(lawan);

  var pointPemain = 0;
  var pointLawan = 0;
  for (var i = 0; i < 10; i++) {
    var unggul = getRandom(0, kesempatan.length - 1);
    if (kesempatan[unggul] == m.sender) pointPemain += 1;
    else pointLawan += 1;
  }

  if (pointPemain > pointLawan) {
    var hadiah = (pointPemain - pointLawan) * 10000;
    global.db.data.users[m.sender].money += hadiah;
    global.db.data.users[m.sender].tiketcoin += 1;
    var menang = `*${conn.getName(m.sender)}* [${pointPemain * 10}] - [${pointLawan * 10}] *${conn.getName(lawan)}*\n\nKamu *Menang* melawan level [${pointLawan * 10}] \n\nHadiah Rp. ${hadiah.toLocaleString()}\n+1 Tiketcoin`;
    conn.sendFile(m.chat, thumb, 'war.jpg', menang, m);
  } else if (pointPemain < pointLawan) {
    var denda = (pointLawan - pointPemain) * 100000;
    global.db.data.users[m.sender].money -= denda;
    global.db.data.users[m.sender].tiketcoin += 1;
    var kalah = `*${conn.getName(m.sender)}* [${pointPemain * 10}] - [${pointLawan * 10}] *${conn.getName(lawan)}*\n\nKamu *Kalah* melawan level [${pointLawan * 10}]\n\nUang kamu berkurang Rp. ${denda.toLocaleString()}\n+1 Tiketcoin`;
    conn.sendFile(m.chat, thumb, 'war.jpg', kalah, m);
  } else {
    m.reply(`*${conn.getName(m.sender)}* [${pointPemain * 10}] - [${pointLawan * 10}] *${conn.getName(lawan)}*\n\nHasil imbang, ga dapet apa apa 😂`);
  }

  delete conn.fight[m.sender];
}

danz.command = danz.help = ['clanwar'];
danz.tags = ['game'];
danz.limit = true;
danz.group = true;

module.exports = danz;

function getRandom(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}