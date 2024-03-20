/**
 * DannTeam
 * Danz & Pangeran
 * ig: @dannalwaysalone
*/

const {
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    PHONENUMBER_MCC
} = require("@whiskeysockets/baileys");
const { makeWASocket, protoType, serialize } = require('../lib/simple.js');
const path = require('path');
const { platform } = require('process');
const { fileURLToPath, pathToFileURL } = require('url');
const { createRequire } = require('module');
global.__filename = function filename(pathURL = require('process').argv[1], rmPrefix = require('process').platform !== 'win32') { return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString() };
global.__dirname = function dirname(pathURL) { return path.dirname(global.__filename(pathURL, true)) };
global.__require = function require(dir = require('process').argv[1]) { return createRequire(dir) };
const fs = require("fs");
const pino = require("pino");
const NodeCache = require("node-cache");
const yargs = require('yargs');

let danz = async (m, {
    conn,
    text,
    args,
    usedPrefix,
    command
}) => {
    if (!text) {
        return m.reply(`Masukkan Nomor!\n\nContoh: *${usedPrefix + command} ${m.sender.split("@")[0]}*`);
    }

    if (!conn.user.jid) {
        return m.reply(`Tidak dapat membuat *Jadibot* pada *${namebot}*`);
    }

    const __dirname = global.__dirname(require('process').argv[1]);

    global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse());
    global.prefix = new RegExp('^[' + (opts['prefix'] || '‎xzXZ/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.\\-').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']');

    const session = "danzy/danzbot/" + text
    let isInit = !fs.existsSync(session);

    const { state, saveCreds } = await useMultiFileAuthState(session);
    const { version } = await fetchLatestBaileysVersion();
    const msgRetryCounterCache = new NodeCache();

    const config = {
        printQRInTerminal: false,
        mobile: false,
        version: version,
        browser: ["Ubuntu", "Chrome", "20.0.04"],
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
        msgRetryCounterCache,
        defaultQueryTimeoutMs: undefined,
        logger: pino({ level: 'fatal' }),
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino().child({
                level: 'silent',
                stream: 'store'
            })),
        },
    };

    global.connection = makeWASocket(config);

    connection.ev.on('connection.update', connectionUpdate);

    async function connectionUpdate(update) {
        const { connection, lastDisconnect } = update;
        if (connection === 'connecting') {
            conn.reply(m.chat, `Menghubungkan dengan Jadibot...\n*${wait}*`, m)
        }
        
        if (connection === 'open') {
            conn.reply(m.chat, `Terhubung dengan *Jadibot*\n\n• Peserta: *@${m.sender.split("@")[0]}*`, m);
        } else if (connection === 'close') {
            conn.reply(m.chat, `Tidak terhubung dengan *Jadibot*\n\n${wait} menghubungkan ulang...`, m);
       }

        if (lastDisconnect && lastDisconnect.error && lastDisconnect.error.output && lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
            console.log(await reloadHandler(true));
        }
    }

    async function reloadHandler(restartConn) {
        let Handler = await require('../handler');
        let handler = await require('../handler');
        if (Object.keys(Handler || {}).length) handler = Handler;
        if (restartConn) {
            try { connection.ws.close() } catch {}
            global.connection = {
                ...connection,
                ...makeWASocket(config)
            };
            if (!isInit) {
                connection.ev.off('messages.upsert', connection.handler)
                connection.ev.off('group-participants.update', connection.participantsUpdate)
                //conn.ev.off('groups.update', conn.groupsUpdate)
                connection.ev.off('message.delete', connection.onDelete)
                connection.ev.off('connection.update', connection.connectionUpdate)
                connection.ev.off('creds.update', connection.credsUpdate)
            }

            connection.welcome = 'Selamat datang @user👋'
            connection.bye = 'Selamat tinggal @user👋'
            connection.spromote = '@user sekarang admin!'
            connection.sdemote = '@user sekarang bukan admin!'
            connection.sDesc = '@desc telah diubah!'
            connection.sSubject = '@subject telah diubah!'
            connection.sIcon = 'Icon grup telah diubah!'
            connection.sRevoke = 'Link grup telah diubah!\n@revoke'
            connection.sAnnounceOn = 'Group telah di tutup!\nsekarang hanya admin yang dapat mengirim pesan.'
            connection.sAnnounceOff = 'Group telah di buka!\nsekarang semua peserta dapat mengirim pesan.'
            connection.sRestrictOn = 'Edit info grup di ubah ke hanya admin!'
            connection.sRestrictOff = 'Edit info grup di ubah ke semua peserta!'

            connection.handler = handler.handler.bind(global.connection)
            connection.participantsUpdate = handler.participantsUpdate.bind(global.connection)
            connection.groupsUpdate = handler.groupsUpdate.bind(global.connection)
            connection.onDelete = handler.deleteUpdate.bind(global.connection)
            connection.connectionUpdate = connectionUpdate.bind(global.connection)
            connection.credsUpdate = saveCreds.bind(global.connection)

            connection.ev.on('messages.upsert', connection.handler)
            connection.ev.on('group-participants.update', connection.participantsUpdate)
            //conn.ev.on('groups.update', conn.groupsUpdate)
            connection.ev.on('message.delete', connection.onDelete)
            connection.ev.on('connection.update', connection.connectionUpdate)
            connection.ev.on('creds.update', connection.credsUpdate)
            isInit = false
            return true

        }
    }

    if (!connection.authState.creds.registered) {
        setTimeout(async () => {
            const phoneNumber = text;
            try {
                const code = await connection.requestPairingCode(phoneNumber);
                const spillCode = code?.match(/.{1,4}/g)?.join("-") || code;
                const danzy = await conn.reply(m.chat, '```Masukkan kode dibawah ini untuk jadi bot sementara\n\n1. Klik titik tiga di pojok kanan atas\n2. Ketuk perangkat tertaut\n3. Ketuk tautkan perangkat\n4. Ketuk tautkan dengan nomer telepon saja\n5. Masukkan kode di bawah ini\n\nNote: kode dapat expired kapan saja!```', m);
                await conn.reply(m.chat, spillCode, danzy);
            } catch (error) {
                console.error('Error requesting pairing code:', error);
                conn.reply(m.chat, 'Gagal membuat bot sementara, coba lagi nanti.', m);
            }
        }, 3000);
    }
    reloadHandler();
};

danz.command = danz.help = ["jadibot"];
danz.tags = ["tools"];
danz.premium = false;

module.exports = danz;