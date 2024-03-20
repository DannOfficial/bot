var thumb = global.thumb
const premiumOptions = [
  { days: 1, price: 3000 },
  { days: 3, price: 7000 },
  { days: 7, price: 15000 },
  { days: 30, price: 30000 },
  { days: -1, price: 50000 }
];

function buyPremium(user, optionIndex) {
  const selectedOption = premiumOptions[optionIndex];
  if (!selectedOption) return 'Opsi premium tidak valid.';

  if (user.balance < selectedOption.price) {
    return 'Saldo anda tidak cukup untuk membeli premium.';
  }

  if (selectedOption.days === -1) {
    user.premium = true;
  } else {
    user.premiumUntil = Date.now() + selectedOption.days * 24 * 60 * 60 * 1000;
  }

  user.balance -= selectedOption.price;

  return `Anda telah membeli premium ${
    selectedOption.days === -1 ? 'Permanen' : `selama ${selectedOption.days} hari`
  } dengan harga ${selectedOption.price} balance.`;
}

async function danz(m, { conn }) {
  var user = global.db.data.users[m.sender];
  var premiumList = premiumOptions
    .map((option, index) => `${index + 1}. ${option.days === -1 ? 'Permanen' : option.days + ' hari'} - ${option.price} balance`)
    .join('\n');

  const args = m.text.split(' ');
  if (args.length !== 2 || isNaN(args[1])) {
    conn.sendFile(m.chat, thumb, '', `${htki} *List Premium* ${htka}\n\n${premiumList}`, m)
    return;
  }

  const optionIndex = parseInt(args[1]) - 1;
  const replyText = buyPremium(user, optionIndex);
  conn.reply(m.chat, replyText, m);
}

danz.command = danz.help = ['buyprem'];
danz.tags = ['main'];

module.exports = danz;