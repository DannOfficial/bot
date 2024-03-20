var fs = require('fs');
var archiver = require('archiver');
var path = require('path');

var danz = async (m, { conn }) => {
  m.reply('Sedang mempersiapkan backup...')
  var backupName = `backup_${new Date().toISOString().replace(/:/g, '-')}.zip`
  var output = fs.createWriteStream(backupName);
  var archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', function () {
    var caption = `Berikut adalah file backup kode bot:\nNama file: ${backupName}\nUkuran file: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`
    conn.sendFile(m.chat, backupName, backupName, caption, m)
  });

  archive.on('warning', function (err) {
    if (err.code === 'ENOENT') {
      console.warn(err);
    } else {
      throw err;
    }
  });

  archive.on('error', function (err) {
    throw err;
  });

  archive.pipe(output);
  archive.glob('**/*', {
    cwd: path.resolve(__dirname, '../'),
    ignore: ['node_modules/**', 'Dann/', 'tmp/**', '.npm/**', backupName]
  });
  archive.finalize();
}

danz.command = danz.help = ['backup']
danz.tags = ['owner']

danz.owner = true

module.exports = danz