const os = require('os');
const platform = require('platform');
const { performance } = require('perf_hooks');
const speedTest = require('speedtest-net');

let danz = async (m) => {
  let old = performance.now();
  let result = await speedTest({ acceptLicense: true });
  let news = performance.now();
  let speed = `${news - old} milliseconds`;
  let platformName = os.platform();
  let architecture = os.arch();
  let memory = `${(os.freemem() / (1024 ** 3)).toFixed(2)} - ${(os.totalmem() / (1024 ** 3)).toFixed(2)} GB`;
  let model = `${os.cpus()[0].model} - ${os.cpus().length}`;
  let parsedPlatform = platform.parse();
  let ipAddress = getIPAddress();
  let deviceType;
  if (platformName === 'Win32') {
    deviceType = 'Windows';
  } else if (platformName === 'Darwin') {
    deviceType = 'iPhone';
  } else {
    deviceType = 'Phone';
  }
  const dann = `⚡ BETA: {
    "status": true,
    "version": "${version}",
    "speed": "${speed}",
    "model": "${model}",
    "memory": "${memory}",
    "ip-address": "${ipAddress}",
    "uptime": "${clockString(process.uptime() * 1000)}",
    "platform": {
      "build": "${parsedPlatform.name} ${parsedPlatform.version}",
      "os": "${platformName}",
      "device": "${deviceType}",
      "architecture": "${architecture}"
    },
    "speed_test": {
      "download": "${result.download.bandwidth} Mbps",
      "upload": "${result.upload.bandwidth} Mbps",
      "ping": "${result.ping.latency} ms"
    },
    "info": {
      "author": "${author}"
    }
  }`;
  m.reply(dann);
};

danz.customPrefix = /^(beta)$/i;
danz.command = new RegExp();

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000);
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
  return [h, m, s].map((v) => v.toString().padStart(2, '0')).join(':');
}

function getIPAddress() {
  const interfaces = os.networkInterfaces();
  for (const iface of Object.values(interfaces)) {
    for (const conn of iface) {
      if (conn.family === 'IPv4' && !conn.internal) {
        return conn.address;
      }
    }
  }
  return 'N/A';
}

module.exports = danz;