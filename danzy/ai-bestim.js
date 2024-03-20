var axios = require('axios');

var danz = async (m, {
    command,
    usedPrefix,
    conn,
    text,
    args
}) => {
    var input_data = ["chat", "image"];

    var [urutan, tema] = text.split("|");
    if (!tema) return m.reply(`Masukkan Prompt!\nContoh: *${usedPrefix + command} <nomor|prompt>*\nPenggunaan: ${usedPrefix + command} 1 | Siapa itu danz?`);

    await m.reply(wait);
    try {
        var data = input_data.map((item, index) => ({
            title: item.toUpperCase(),
            id: item
        }));
        if (!urutan) return m.reply(`Masukkan Prompt!\nContoh: *.bestim <nomor|prompt>*\nList:\n${data.map((item, index) => `*${index + 1}.* ${item.title}`).join("\n")}`);
        if (isNaN(urutan)) return m.reply(`Masukkan Prompt!\nContoh: *.bestim <nomor|prompt>*\nList:\n${data.map((item, index) => `*${index + 1}.* ${item.title}`).join("\n")}`);
        if (urutan > data.length) return m.reply(`Masukkan Prompt!\nContoh: *.bestim <nomor|prompt>*\nList:\n${data.map((item, index) => `*${index + 1}.* ${item.title}`).join("\n")}`);
        var out = data[urutan - 1].id;

        var bestimResponse = await bestimChat(out, tema);

        if (bestimResponse) {
            if (out == "image") {
                var result = bestimResponse;

                await conn.sendMessage(m.chat, {
                    image: {
                        url: result.data[0].url
                    },
                    caption: wm
                }, {
                    quoted: m
                });
            } else if (out == "chat") {
                var result = bestimResponse;
                var str = "";
                var anu = result.split('data: ').slice(1).map(x => (str += x.replace(/\\n/g, '')));
                await conn.sendMessage(m.chat, {
                    text: str.replace(/\\n/g, '\n')
                }, {
                    quoted: m
                });
            }
        } else {
            console.log("Tidak ada respons dari OpenAI atau terjadi kesalahan.");
        }
    } catch (e) {
        await m.reply(eror);
    }
}

danz.command = danz.help = ["bestim"];
danz.tags = ["ai"];

module.exports = danz;

function generateUA() {
    var androidVersions = ['4.0.3', '4.1.1', '4.2.2', '4.3', '4.4', '5.0.2', '5.1', '6.0', '7.0', '8.0', '9.0', '10.0', '11.0'];
    var deviceModels = ['M2004J19C', 'S2020X3', 'Xiaomi4S', 'RedmiNote9', 'SamsungS21', 'GooglePixel5'];
    var buildVersions = ['RP1A.200720.011', 'RP1A.210505.003', 'RP1A.210812.016', 'QKQ1.200114.002', 'RQ2A.210505.003'];
    var selectedModel = deviceModels[Math.floor(Math.random() * deviceModels.length)];
    var selectedBuild = buildVersions[Math.floor(Math.random() * buildVersions.length)];
    var chromeVersion = 'Chrome/' + (Math.floor(Math.random() * 80) + 1) + '.' + (Math.floor(Math.random() * 999) + 1) + '.' + (Math.floor(Math.random() * 9999) + 1);
    var userAgent = `Mozilla/5.0 (Linux; Android ${androidVersions[Math.floor(Math.random() * androidVersions.length)]}; ${selectedModel} Build/${selectedBuild}) AppleWebKit/537.36 (KHTML, like Gecko) ${chromeVersion} Mobile Safari/537.36 WhatsApp/1.${Math.floor(Math.random() * 9) + 1}.${Math.floor(Math.random() * 9) + 1}`;
    return userAgent;
}

function randomIP() {
    var octet = () => Math.floor(Math.random() * 256);
    return `${octet()}.${octet()}.${octet()}.${octet()}`;
}

async function bestimChat(type, message) {
    try {
        var headers = {
            'User-Agent': generateUA(),
            'Referer': 'https://chatgpt.bestim.org/chat/',
            'X-Forwarded-For': randomIP(),
        };

        var data = {
            temperature: 1,
            frequency_penalty: 0,
            type: type,
            messagesHistory: [{
                    from: 'BestimChat',
                    content: 'Danz adalah Programmer yang berasal dari Kalimantan.'
                },
                {
                    from: 'you',
                    content: message
                },
            ],
            message: message,
        };

        var response = await axios.post('https://chatgpt.bestim.org/chat/send2/', data, {
            headers
        });

        return response.data;
    } catch (error) {
        console.error('Terjadi kesalahan:', error);
    }
}