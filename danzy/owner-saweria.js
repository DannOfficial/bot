var PhoneNumber = require('awesome-phonenumber')
var { Saweria } = require('../lib/saweria.js')

function formatter(value) {
  return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function calculatePPN(value) {
  return value * 0.1;
}

function removeItem(array, item) {
  return array.filter(elem => !(elem.jid === item.jid && elem.state === item.state));
}

var danz = async (m, { conn, isOwner, usedPrefix, command, args }) => {
  conn.saweria = conn.saweria || '';
  conn.gateway = conn.gateway || [];

  var Pay = new Saweria(conn.saweria);

  if (args[0] === 'payment' || args[0] === 'unban' || args[0] === 'unblock') {
    var itemName = args[0].toUpperCase();
    var price = 5000; // You can change this to 10000 if necessary
    var pending = conn.gateway.find(v => v.jid === m.sender && v.state === 'PENDING');
    var process = conn.gateway.find(v => v.jid === m.sender && v.state === 'PROCESS');

    if (pending || process) {
      return m.reply(`Selesaikan terlebih dahulu proses sebelumnya atau kirim *${usedPrefix}saweria n* untuk membatalkan.`);
    }

    var formattedPrice = formatter(price);
    var formattedPPN = formatter(calculatePPN(price));

    var teks = `Anda akan melakukan pembelian ${itemName} dengan rincian sebagai berikut:\n\n`;
    teks += `• Nomor: ${PhoneNumber('+' + m.sender.split('@')[0]).getNumber('international')}\n`;
    teks += `• Harga: Rp. ${formattedPrice},-\n`;
    teks += `• PPN: Rp. ${formattedPPN},-\n\n`;
    teks += `Kirim *${usedPrefix}saweria y* untuk melanjutkan proses pembayaran atau kirim *${usedPrefix}saweria n* untuk membatalkan.`;

    m.reply(teks).then(() => {
      conn.gateway.push({
        state: 'PENDING',
        jid: m.sender,
        amount: price,
        admin: calculatePPN(price),
        package: itemName,
        created_at: Date.now(),
        receipt: ''
      });
    });
  } else if (args[0] === 'y') {
    var gateway = conn.gateway.find(v => v.jid === m.sender && v.state === 'PENDING');
    if (!gateway) return;

    m.reply('Menghasilkan QR Code pembayaran...');
    var total = parseInt(gateway.amount) + parseInt(gateway.admin);
    var json = await Pay.createPayment(total, gateway.package);

    if (!json.status) return m.reply(`Terjadi kesalahan saat menghasilkan pembayaran:\n${json.msg}`);

    var teks = `Info Pembayaran\n\n`;
    teks += `Pembayaran sebelum ${json.data.expired_at} WIB\n\n`;
    teks += `• ID Pembayaran: ${json.data.id}\n`;
    teks += `• Total Pembayaran: Rp. ${formatter(json.data.amount_raw)},-\n\n`;
    teks += `Catatan:\n`;
    teks += `- Kode QR hanya valid untuk 1 kali transfer.\n`;
    teks += `- Setelah pembayaran, tunggu sebentar lalu kirim *${usedPrefix}saweria check* untuk cek status pembayaran.\n`;
    teks += `- Jika pembayaran berhasil, status akan diperbarui otomatis\n`;
    teks += `- Untuk bantuan lebih lanjut, hubungi *${usedPrefix}owner*`;

    conn.sendFile(m.chat, Buffer.from(json.data.qr_image.split(',')[1], 'base64'), 'qr.png', teks, m).then(() => {
      gateway.state = 'PROCESS';
      gateway.receipt = json.data.id;
    });
  } else if (args[0] === 'n') {
    var pending = conn.gateway.find(v => v.jid === m.sender && v.state === 'PENDING');
    var process = conn.gateway.find(v => v.jid === m.sender && v.state === 'PROCESS');

    if (!pending && !process) {
      return m.reply(`Pembelian berhasil dibatalkan.`);
    }

    m.reply(`Pembelian berhasil dibatalkan.`);
    if (pending) {
      conn.gateway = removeItem(conn.gateway, pending);
    }
    if (process) {
      conn.gateway = removeItem(conn.gateway, process);
    }
  } else if (args[0] === 'check') {
    var gateway = conn.gateway.find(v => v.jid === m.sender && v.state === 'PROCESS');
    if (!gateway) return;

    m.reply('Memeriksa status pembayaran...');
    var json = await Pay.checkPayment(gateway.receipt);

    if (!json.status) return m.reply(`Terjadi kesalahan saat memeriksa status pembayaran:\n${json.msg}`);

    m.reply(`Status Pembayaran: ${json.msg}`).then(() => {
      var data = global.db.users.find(v => v.jid === gateway.jid);

      if (gateway.package === 'PREMIUM') {
        data.limit += 5000;
        data.expired += data.premium ? (86400000 * 30) : (Date.now() + (86400000 * 30));
        data.premium = true;
      } else if (gateway.package === 'UNBAN') {
        data.banned = false;
        data.banTemp = 0;
        data.banTimes = 0;
      } else if (gateway.package === 'UNBLOCK') {
        conn.updateBlockStatus(gateway.jid, 'unblock');
      } else if (gateway.package === 'DEPOSITO') {
        data.balance += gateway.amount;
      }

      conn.gateway = removeItem(conn.gateway, gateway);
    });
  } else if (args[0] === 'login') {
    if (!isOwner) return m.reply('Hanya owner yang dapat menggunakan perintah ini.');
    if (!args[1] || !args[2]) return m.reply('Penggunaan: *' + usedPrefix + 'login email@mail.com password*');

    var email = args[1];
    var password = args[2];

    m.reply('Sedang login...');
    var json = await Pay.login(email, password);

    if (!json.status) return m.reply(`Terjadi kesalahan saat login:\n${json.msg}`);

    m.reply(`Login Sukses : ${json.data.user_id}`).then(() => {
      conn.saweria = json.data.user_id;
    });
  } else {
    m.reply(`Penggunaan:\n• *${usedPrefix}saweria payment* - Memulai pembelian\n• *${usedPrefix}saweria unban* - Membuka banned\n• *${usedPrefix}saweria unblock* - Membuka block\n• *${usedPrefix}saweria y* - Melanjutkan pembayaran\n• *${usedPrefix}saweria n* - Membatalkan pembelian\n• *${usedPrefix}saweria check* - Memeriksa status pembayaran\n• *${usedPrefix}saweria login email@mail.com password* - Login ke akun Saweria`);
  }
}

danz.command = danz.help = ['saweria'];
danz.tags = ['tools'];
danz.owner = true;

module.exports = danz;