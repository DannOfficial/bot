var nodemailer = require('nodemailer');
var { createHash } = require('crypto');
var { fnctions } = require("../lib/fnctions");

async function sendVerificationEmail(email, verificationCode) {
  try {
    if (!await fnctions()) return;
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'danigtps@gmail.com',
        pass: 'ecimoyaxlhpbksgq',
      },
    });

var mailOptions = {
  from: 'danigtps@gmail.com',
  to: email,
  subject: 'Dann-MD Verification',
  html: `
    <div style="font-family: Arial, sans-serif; background-color: #f2f2f2; padding: 20px;">
      <div style="background-image: url('https://telegra.ph/file/2d987fea6d007aea943f0.jpg'); background-size: cover; background-position: center; padding: 20px; border-radius: 10px; text-align: center;">
        <div style="background-color: rgba(255, 255, 255, 0.7); padding: 20px; border-radius: 10px;">
          <h2 style="color: #4CAF50;">Dann-MD Verification</h2>
          <p>Dear ${email},</p>
          <p>Thank you for registering with Dann-MD. Please use the verification code below to complete your registration:</p>
          <div style="background-color: #e5e5e5; padding: 10px; text-align: center; font-size: 18px; font-weight: bold;">
            ${verificationCode}
          </div>
          <p style="color: #888888;">This verification code will expire in 5 minutes.</p>
          <p>If you did not request this verification, please ignore this email.</p>
          <p><a href="https://wa.me/+6283137550315" style="color: #4CAF50;">2023 © DannTeam.</a></p>
        </div>
      </div>
    </div>
  `,
};

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    return false;
  }
}

function generateVerificationCode() {
  var length = 6;
  var characters = '0123456789';
  let verificationCode = '';
  for (let i = 0; i < length; i++) {
    verificationCode += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  var expirationTime = Date.now() + 5 * 60 * 1000;
  return { code: verificationCode, expiresAt: expirationTime };
}

var emailVerificationCodes = {};

var danzy = async (m, { conn, text, usedPrefix, command }) => {
  var user = global.db.data.users[m.sender];
  var name = await conn.getName(m.sender);
  var danz = 'Selamat kamu mendapatkan:\n+100 Limit\n+10.000 Balance\n+10.000 XP\n+10.000 Money';
  var sn = createHash('md5').update(m.sender).digest('hex');
  switch (command) {
    case 'regmail':
      if (!user.registered) {
        if (!text) {
          return conn.reply(m.chat, `Masukkan Alamat Email!\n\nContoh: *${usedPrefix + command} xxx@gmail.com*`, m);
        }
        var email = text.trim();
        var verificationCodeData = generateVerificationCode();
        emailVerificationCodes[m.sender] = verificationCodeData;
        var emailSent = await sendVerificationEmail(email, verificationCodeData.code);
        if (emailSent) {
          conn.reply(m.chat, `Email verifikasi telah dikirim ke ${email}. Silahkan cek kotak masuk anda dan ketik *${usedPrefix}vercode <kode>* untuk memverifikasi pendaftaran anda.`, m);
        } else {
          conn.reply(m.chat, `Tidak dapat mengirim email.`, m);
        }
      } else {
        conn.reply(m.chat, `Kamu telah terdaftar sebelumnya.`, m);
      }
      break;
    case 'vercode':
      if (!text) {
        return conn.reply(m.chat, `Masukkan kode verifikasi yang telah dikirimkan ke email anda.`, m);
      }
      var verificationCode = text.trim();
      var verificationCodeData = emailVerificationCodes[m.sender];
      if (!verificationCodeData) {
        return conn.reply(m.chat, `Anda belum meminta kode verifikasi. Silahkan lakukan pendaftaran terlebih dahulu dengan perintah ${usedPrefix}regmail.`, m);
      }
      if (verificationCodeData.code === verificationCode) {
        if (Date.now() > verificationCodeData.expiresAt) {
          delete emailVerificationCodes[m.sender];
          return conn.reply(m.chat, `Kode verifikasi telah kedaluwarsa. Silahkan kirim ulang kode verifikasi dengan perintah ${usedPrefix}regmail.`, m);
        }

        delete emailVerificationCodes[m.sender];
        user.registered = true;
        user.balance += 10000;
        user.money += 10000;
        user.limit += 100;
        conn.reply(m.chat, `Daftar berhasil!

╭─「 Info User 」
│ Nama: ${name}
│ Code: ${verificationCode}
│ SN: ${sn}
╰────

*Jika SN kamu lupa ketik ${usedPrefix}ceksn*

${danz}`, m);
      } else {
        conn.reply(m.chat, `Kode verifikasi salah. Silahkan periksa kembali atau kirim ulang kode verifikasi dengan perintah ${usedPrefix}regmail.`, m);
      }
      break;
  }
};

danzy.command = danzy.help = ['regmail', 'vercode'];
danzy.tags = ['main'];
danzy.limit = 1;

module.exports = danzy;

/**
  * DannTeam
  * ig: @dannalwaysalone
*/