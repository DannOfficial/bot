let danz = async (m, {
  conn,
  text,
  usedPrefix,
  command
}) => {
  // Fungsi untuk mengocok pengaturan awal
  const shuffle = (arr) => {
    let currentIndex = arr.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = arr[currentIndex];
      arr[currentIndex] = arr[randomIndex];
      arr[randomIndex] = temporaryValue;
    }

    return arr;
  };

  // Membuat array kartu domino
  const createDeck = () => {
    let deck = [];
    for (let i = 0; i <= 6; i++) {
      for (let j = i; j <=6; j++) {
        deck.push([i, j]);
      }
    }
    return shuffle(deck);
  };

  // Draw Domino
  const drawDomino = (player, deck) => {
    if (deck.length === 0) return `${player} tidak bisa mengambil kartu domino, karena kartu sudah habis.`;

    let domino = deck.pop();
    return `${player} mengambil kartu domino (${domino[0]}:${domino[1]}). Sisa kartu: ${deck.length}`;
  };

  if (!text.includes('start')) {
    return conn.reply(m.chat, 'Silakan ketik .*domino start* untuk memulai permainan.', m);
  }

  let deck = createDeck();
  let player1 = "@" + m.sender.split("@")[0];
  let player2 = "Bot";
  let hand1 = [], hand2 = [];

  for (let i = 0; i < 7; i++) {
    hand1.push(deck.pop());
    hand2.push(deck.pop());
  }

  let message = `*Tangan Pemain*\n${player1}:`;
  hand1.forEach(domino => {
    message += `\n(${domino[0]}:${domino[1]})`;
  });

  message += `\n
*@${conn.user.jid.split("@")[0]}*:`;
  hand2.forEach(domino => {
    message += `\n(${domino[0]}:${domino[1]})`;
  });

  message += `\n
*Papan Permainan*\n`;

  hand1.forEach(domino => {
    message += `[${domino[0]}:${domino[1]}] `;
  });

  message += `[{DOMINO}] `;

  hand2.forEach(domino => {
    message += `[${domino[0]}:${domino[1]}] `;
  });

  conn.reply(m.chat, message, m);
};

danz.command = danz.help = ["domino"]
danz.tags = ["game"]

module.exports = danz

/**
 * DannTeam
 * ig: @dannalwaysalone
*/