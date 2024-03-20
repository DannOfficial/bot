var danz = async (m, { conn, args }) => {
  conn.snakesAndLadders = conn.snakesAndLadders || {};

  const chatId = m.chat;
  const gameData = conn.snakesAndLadders[chatId] || {
    players: {},
    board: Array(100).fill(0),
    currentPlayer: null,
  };

  conn.snakesAndLadders[chatId] = gameData;

  const rollDice = () => Math.floor(Math.random() * 6) + 1;

  const movePlayer = (player, steps) => {
    const newPosition = player.position + steps;
    if (newPosition >= 100) {
      player.position = 100;
      conn.reply(m.chat, `🎉 *${player.name}* memenangkan permainan! Selamat! 🎉`, m);
      delete conn.snakesAndLadders[chatId];
      return;
    }

    // Adjust the probability of landing on a snake or ladder
    const probability = Math.random(); // Random value between 0 and 1
    if (probability < 0.2) { // Adjust the probability as needed
      const newCell = gameData.board[newPosition];
      if (newCell > 0) {
        // Subtract the steps to go down the snake
        player.position = newCell - (newPosition - newCell);
        conn.reply(m.chat, `🐍 *${player.name}* mendarat pada ular dan turun ke kotak ${player.position} 🎢`, m);
      } else {
        player.position = newPosition;
        conn.reply(m.chat, `🪜 *${player.name}* mendarat pada tangga dan naik ke kotak ${newPosition} 🎢`, m);
      }
    } else {
      player.position = newPosition;
      conn.reply(m.chat, `*${player.name}* maju ke kotak ${player.position} 🎲`, m);
    }
  };

  const generateGameBoard = () => {
    // Add code to generate the game board and display snake/ladder positions
    const boardSize = 10;
    let boardText = '📋 Papan Permainan Ular Tangga:\n\n';
    let cell = 100;
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        if (cell < 10) boardText += ' ';
        if (gameData.players[cell - 1]) {
          const playerEmoji = `👤(${gameData.players[cell - 1].name}) `;
          boardText += playerEmoji;
        } else {
          const cellText = gameData.board[cell - 1] === 0 ? `[${cell}] ` : `🐍[${cell}] `;
          boardText += cellText;
        }
        cell--;
      }
      boardText += '\n';
    }
    boardText += '\nPosisi Ular 🐍 dan Tangga 🪜:\n';
    boardText += 'Posisi Ular:';
    const snakePositions = [16, 47, 49, 56, 62, 64, 87, 93, 95, 98];
    const ladderPositions = [2, 4, 8, 20, 28, 40, 45, 61, 71, 79];
    for (let i = 1; i <= 100; i++) {
      if (snakePositions.includes(i)) {
        boardText += ` 🐍(${i})`;
      } else if (ladderPositions.includes(i)) {
        boardText += ` 🪜(${i})`;
      }
    }
    boardText += '\n';

    return boardText;
  };

  if (args[0] === 'join') {
    if (!gameData.players[m.sender]) {
      gameData.players[m.sender] = {
        name: m.sender,
        position: 0,
      };
      conn.reply(m.chat, `🎲 Selamat bergabung, *@${m.sender.split('@')[0]}*! 🎲`, m);
    } else {
      conn.reply(m.chat, `*@${m.sender.split('@')[0]}*, kamu sudah bergabung sebelumnya.`, m);
    }
  } else if (args[0] === 'start') {
    if (Object.keys(gameData.players).length < 2) {
      conn.reply(m.chat, '👥 Permainan membutuhkan setidaknya 2 pemain. 👥', m);
    } else if (gameData.currentPlayer) {
      conn.reply(m.chat, 'Permainan sudah dimulai. 🚀', m);
    } else {
      gameData.currentPlayer = Object.keys(gameData.players)[0];
      conn.reply(m.chat, `Permainan dimulai. 🚀 Giliran pertama: *${gameData.currentPlayer}*`, m);
      conn.reply(m.chat, '🎯 *Cara Bermain*:\n1. Gunakan perintah *roll* untuk menggulir dadu. 🎲\n2. Ikuti petunjuk selama permainan. 🔀\n3. Tujuan utama adalah mencapai kotak ke-100 terlebih dahulu. 🏁', m);
      conn.reply(m.chat, generateGameBoard(), m);
    }
  } else if (args[0] === 'roll') {
    const player = gameData.players[m.sender];
    if (!player) {
      conn.reply(m.chat, `*@${m.sender.split('@')[0]}*, kamu belum bergabung dalam permainan ini. Ketik *ulartangga join* untuk bergabung.`, m);
    } else if (gameData.currentPlayer !== m.sender) {
      conn.reply(m.chat, 'Sekarang bukan giliranmu. ⏳', m);
    } else {
      const steps = rollDice();
      movePlayer(player, steps);
      const players = Object.keys(gameData.players);
      const currentPlayerIndex = players.indexOf(gameData.currentPlayer);
      const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
      gameData.currentPlayer = players[nextPlayerIndex];
      const boardText = generateGameBoard();
      conn.reply(m.chat, `🎲 *${player.name}* menggulir dadu dan mendapatkan ${steps}! 🎲\ngiliran selanjutnya adalah *${gameData.currentPlayer}*`, m);
      conn.reply(m.chat, boardText, m);
    }
  } else if (args[0] === 'list') {
    const playerList = Object.keys(gameData.players).map(playerId => gameData.players[playerId].name).join(', ');
    conn.reply(m.chat, `👥 List Pemain:\n${playerList}`, m);
  } else if (args[0] === 'delete') {
    delete conn.snakesAndLadders[chatId];
    conn.reply(m.chat, '👀 Permainan ular tangga dihentikan', m);
  } else if (args[0] === 'help') {
    const canvafy = require('canvafy');
    const p = await new canvafy.Captcha()
      .setBackground("image", "https://telegra.ph/file/a898f3a4c64333a0c231d.png")
      .setCaptchaKey("ULAR TANGGA")
      .setBorder("#fff")
      .setOverlayOpacity(0.8)
      .build();
    let text = `
      *🎮 GAME ULAR TANGGA*
  ___________________________________

*ulartangga join* - Bergabung dalam permainan ulartangga
*ulartangga start* - Memulai permainan ulartangga jika sudah ada dua pemain yang sudah bergabung
*ulartangga roll* - Menggulir dadu untuk bergerak
*ulartangga list* - Melihat daftar pemain yang telah bergabung
*ulartangga help* - Melihat instruksi cara bermain ulartangga

*Contoh:*
Ketik *ulartangga join* untuk bergabung dalam permainan ulartangga.
Ketik *ulartangga start* untuk memulai permainan jika sudah ada dua pemain.
Ketik *ulartangga roll* untuk menggulir dadu dan bergerak.
Ketik *ulartangga list* untuk melihat daftar pemain yang telah bergabung.
    `;
    conn.sendFile(m.chat, p, '', text, m);
  } else {
    conn.reply(m.chat, '🐍 [Selamat Datang di Game ular tangga] 🎢\n\nKetik *.ulartangga help* untuk bantuan ‼️', m);
  }
};

danz.command = danz.help = ["ulartangga"]
danz.tags = ["game"]
danz.group = true;
danz.register = true;

module.exports = danz;