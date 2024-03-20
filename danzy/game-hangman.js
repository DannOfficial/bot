var fetch = require("node-fetch");

async function tebakkata() {
   var danzy = await fetch("https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakkata.json")
   return danzy
}

class HangmanGame {
  constructor(id) {
    this.sessionId = id;
    this.guesses = [];
    this.correctGuesses = [];
    this.maxAttempts = 0;
    this.currentStage = 0;
  }

  getRandomQuest = async () => {
    try {
      var { jawaban, soal } = await tebakkata();
      return { clue: soal, quest: jawaban.toLowerCase() };
    } catch (error) {
      console.error('Error fetching random quest:', error);
      throw new Error('Failed to fetch a random quest.');
    }
  };

  initializeGame = async () => {
    try {
      this.quest = await this.getRandomQuest();
      this.maxAttempts = this.quest.quest.length + 2;
    } catch (error) {
      console.error('Error initializing game:', error);
      throw new Error('Failed to initialize the game.');
    }
  };

  displayBoard = () => {
    var stages = [
      "```\n==========\n|    |\n|      \n|      \n|      \n|      \n|      \n==========",
      "```\n==========\n|    |\n|   💀\n|      \n|      \n|      \n|      \n==========",
      "```\n==========\n|    |\n|   💀\n|   |\n|      \n|      \n|      \n==========",
      "```\n==========\n|    |\n|   💀\n|  /|\n|      \n|      \n|      \n==========",
      "```\n==========\n|    |\n|   💀\n|  /|\\ \n|      \n|      \n|      \n==========",
      "```\n==========\n|    |\n|   💀\n|  /|\\ \n|  /   \n|      \n|      \n==========",
      "```\n==========\n|    |\n|   💀\n|  /|\\ \n|  / \\ \n|      \n|      \n=========="
    ];

    var board = stages[this.currentStage];

    return `${board}\n\`\`\`\n*Clue:* ${this.quest.clue}`.trimStart();
  };

  displayWord = () => this.quest.quest.split("").map(char => this.guesses.includes(char) ? `${char}` : "__").join(" ");

  makeGuess = letter => {
    if (!this.isAlphabet(letter)) return 'invalid';
    letter = letter.toLowerCase();
    if (this.guesses.includes(letter)) return 'repeat';

    this.guesses.push(letter);

    if (this.quest.quest.includes(letter)) {
      this.correctGuesses.push(letter);
      this.currentStage = Math.max(0, this.currentStage - 1);
    } else {
      this.currentStage = Math.min(this.quest.quest.length, this.currentStage + 1);
    }

    return this.checkGameOver() ? 'over' : this.checkGameWin() ? 'win' : 'continue';
  };

  isAlphabet = letter => /^[a-zA-Z]$/.test(letter);

  checkGameOver = () => this.currentStage >= this.maxAttempts;

  checkGameWin = () => {
    var lowerCaseQuest = this.quest.quest;
    return [...new Set(lowerCaseQuest)].every(char => this.guesses.includes(char));
  };

  getHint = () => `*Hint:* ${this.quest.quest}`;
}

var danz = async (m, { conn, usedPrefix, command, args }) => {
  conn.hangman = conn.hangman || {};
  var [action, inputs] = args;

  try {
    switch (action) {
      case 'end':
        if (conn.hangman[m.chat]) {
          delete conn.hangman[m.chat];
          await m.reply('Berhasil keluar dari sesi Hangman. 👋');
        } else {
          await m.reply('Tidak ada sesi Hangman yang sedang berlangsung.');
        }
        break;

      case 'start':
        if (conn.hangman[m.chat]) {
          await m.reply(`Sesi Hangman sudah berlangsung. Gunakan ${usedPrefix + command} *end* untuk mengakhiri sesi.`);
        } else {
          conn.hangman[m.chat] = new HangmanGame(m.sender);
          var gameSession = conn.hangman[m.chat];
          await gameSession.initializeGame();
          await m.reply(`Sesi Hangman dimulai. 🎉\n\n*Session ID:* ${gameSession.sessionId}\n${gameSession.displayBoard()}\n\n*Tebakan Kata:*\n${gameSession.displayWord()}\n\nKirim huruf untuk menebak, contoh: *${usedPrefix + command} guess a*`);
        }
        break;

      case 'guess':
        if (conn.hangman[m.chat]) {
          if (!inputs) {
            await m.reply(`Masukkan huruf yang ingin ditebak setelah *guess*. Contoh: *${usedPrefix + command} guess a*`);
            return;
          }

          var gameSession = conn.hangman[m.chat];
          var userGuess = inputs.toLowerCase();
          var result = gameSession.makeGuess(userGuess);

          var messages = {
            'invalid': 'Masukkan huruf yang valid.',
            'repeat': 'Anda sudah menebak huruf ini sebelumnya. Coba huruf lain.',
            'continue': `*Huruf yang Sudah Ditebak:*\n${gameSession.guesses.join(", ")}\n${gameSession.displayBoard()}\n\n*Tebakan Kata:*\n${gameSession.displayWord()}\n\n*Attempts Left:* ${gameSession.maxAttempts - gameSession.currentStage}`,
            'over': `Game Over! Kamu kalah. Kata yang benar adalah *${gameSession.quest.quest}*. 💀`,
            'win': 'Selamat! Kamu menang dalam permainan Hangman. 🎉'
          };

          await m.reply(messages[result]);

          if (result === 'over' || result === 'win') {
            delete conn.hangman[m.chat];
          }
        } else {
          await m.reply('Tidak ada sesi Hangman yang sedang berlangsung. Gunakan *start* untuk memulai sesi.');
        }
        break;

      case 'hint':
        if (conn.hangman[m.chat]) {
          var gameSession = conn.hangman[m.chat];
          await m.reply(gameSession.getHint());
        } else {
          await m.reply('Tidak ada sesi Hangman yang sedang berlangsung. Gunakan *start* untuk memulai sesi.');
        }
        break;

      case 'help':
        await m.reply(`🎮 *Hangman Game* 🎮\n\n*Commands:*\n- *${usedPrefix + command} start :* Memulai permainan Hangman.\n- *${usedPrefix + command} end :* Keluar dari sesi permainan.\n- *${usedPrefix + command} guess [huruf] :* Menebak huruf dalam kata.\n- *${usedPrefix + command} hint :* Mendapatkan petunjuk kata.`);
        break;

      default:
        await m.reply(`Aksi tidak valid. Gunakan ${usedPrefix + command} *help* untuk melihat cara menggunakan perintah.`);
    }
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
  }
};

danz.command = danz.help = ['hangman'];
danz.tags = ['game'];
danz.group = true;
danz.limit = true;

module.exports = danz;