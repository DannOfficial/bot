var { createHash } = require("crypto");
var { fnctions } = require("../lib/fnctions");

var otps = {};

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000);
}

var danzy = async (m, { conn, text, usedPrefix, command }) => {
  if (!await fnctions()) return;
  var name = await conn.getName(m.sender)
  var danz = 'Selamat kamu mendapatkan:\n+100 Limit\n+10.000 Balance\n+10.000 XP\n+10.000 Money';
  var sn = createHash('md5').update(m.sender).digest('hex');
  var user = global.db.data.users[m.sender]
  var phone = text.trim();
  var otpCode = generateOtp();
  var potp = `Terimakasih telah mendaftar kepada *${namebot}*
Berikut ini adalah kode otp anda untuk verifikasi

[ *${otpCode}* ]

Kode otp hanya dapat digunakan 1 kali dan waktu pendaftaran hanya 5 menit.
`;
  switch (command) {
    case 'regnom':
      if (!user.registered) {
      if (!text) {
      return m.reply(`Masukkan Nomor!\n\nContoh: *${usedPrefix + command} 628xxx*`);
      }

      otps[m.sender] = {
        code: otpCode,
        expiresAt: Date.now() + 300000,
      };

      conn.reply(phone + '@s.whatsapp.net', potp, m);
      m.reply(`Kode OTP telah dikirim kepada *@${m.sender.split("@")[0]}*`);
      } else {
      return m.reply('Kamu sudah terdaftar!');
      };
      break;
     case 'verotp':
      var userOtp = otps[m.sender];

      if (!userOtp) {
        throw 'Anda belum terdaftar, silakan gunakan perintah *' + usedPrefix + 'regnom* untuk mendaftar.';
      }

      if (userOtp.expiresAt < Date.now()) {
        delete otps[m.sender];
        throw 'Kode OTP telah kadaluarsa, silakan daftar kembali dengan perintah *' + usedPrefix + 'regnom*';
      }

      if (userOtp.code !== parseInt(text)) {
        throw 'Kode OTP salah, silakan coba lagi.';
      }

      delete otps[m.sender];
      user.registered = true
      user.balance += 10000
      user.exp += 10000
      user.money += 10000
      user.limit += 100
      m.reply(`Daftar berhasil!

╭─「 Info User 」
│ Nama: *${name}* (@${m.sender.split("@")[0]})
│ OTP: *${userOtp.code}*
│ SN: *${sn}*
╰────

*Jika SN kamu lupa ketik ${usedPrefix}ceksn*

${danz}`)
      break;
  }
};

danzy.command = danzy.help = ['regnom', 'verotp'];
danzy.tags = ['main'];
danzy.group = true;

module.exports = danzy;