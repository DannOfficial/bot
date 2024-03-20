var fetch = require("node-fetch");

var danz = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    var text
    if (args.length >= 1) {
        text = args.slice(0).join(" ")
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text
    } else return m.reply(`Masukkan Teks!\n\nContoh: *${usedPrefix + command} halo*`)
    await m.reply(wait)
    try {
        var result = await ToolbotAI(text)
        await m.reply(result.result)
    } catch (e) {
        console.error(e);
    }
};

danz.command = danz.help = ["toolbot"];
danz.tags = ["ai"];

module.exports = danz;

async function body(url, body) {
    try {
        var response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body),
        });
        return await response.json();
    } catch (error) {
        console.error("Terjadi kesalahan:", error);
    }
}

async function ToolbotAI(desire) {
    try {
        var data = await body("https://www.toolbot.ai/api/generate", {
            desire
        });
        var {
            description,
            prompt
        } = data.result[0];
        var data2 = await body("https://www.toolbot.ai/api/query", {
            toolDescription: description,
            query: prompt,
        });
        return data2;
    } catch (error) {
        console.error("Terjadi kesalahan: ", error);
    }
}