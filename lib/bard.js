const axios = require('axios');

const BASE_URL = 'https://bard.google.com';

class bard {
    constructor(token) {
        this.token = token;
        this.proxy = null,
        this.timeout = 6,
        this.headers = {
            'Host': 'bard.google.com',
            'X-Same-Domain': '1',
            'User-Agent': "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'Origin': BASE_URL,
            'Referer': BASE_URL + '/',
        };
        this.session = axios.create({
            headers: this.headers,
            withCredentials: true,
        });
        this.session.defaults.headers.common['Cookie'] = '__Secure-1PSID=' + token;
        this._reqid = parseInt(this.generateRandomInteger(4));
        this.SNlM0e = this.getSNlM0e();
        this.conversation_id = '';
        this.response_id = '';
        this.choice_id = '';
    }
    
    generateRandomInteger(length) {
        const min = Math.pow(10, length - 1); // Minimum value based on length
        const max = Math.pow(10, length) - 1; // Maximum value based on length
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    async getSNlM0e() {
        const resp = await this.session.get(BASE_URL, { timeout: 10000 });
        if (resp.status !== 200) {
            throw new Error('Could not connect to Google Bard');
        }
        const match = resp.data.match(/"SNlM0e":"(.*?)"/);
        const SNlM0e = match ? match[1] : null;
        return SNlM0e;
    }

    async getAnswer(input_text) {
        var params = {
            "bl": "boq_assistant-bard-web-server_20230419.00_p1",
            "_reqid": this._reqid.toString(),
            "rt": "c",
        }
        var input_text_struct = [
            [input_text],
            null,
            [this.conversation_id, this.response_id, this.choice_id],
        ]
        const SNlM0e = await this.getSNlM0e();
        var data = {
            "f.req": JSON.stringify([null, JSON.stringify(input_text_struct)]),
            "at": SNlM0e,
        }

        const resp = await this.session.post(
            BASE_URL + '/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate',
            new URLSearchParams(data).toString(),
            { params, timeout: 120000 },
        );
        const chatData = JSON.parse(resp.data.split('\n')[3])[0][2];
        if (!chatData) {
            return { content: `Google Bard encountered an error: ${resp.data}.` };
        }

        const jsonChatData = JSON.parse(chatData);
        // check if properties exist
        if (!jsonChatData[0] || !jsonChatData[1] || !jsonChatData[2] || !jsonChatData[3] || !jsonChatData[4]) {
            if (jsonChatData[0] && jsonChatData[0][0]) {
                return { content: jsonChatData[0][0] };
            } else {
                return { content: `Google Bard encountered an error: ${resp.data}.` };
            }
        }
        const results = {
            content: jsonChatData[0][0],
            conversationId: jsonChatData[1][0],
            responseId: jsonChatData[1][1],
            factualityQueries: jsonChatData[3],
            textQuery: jsonChatData[2][0] || '',
            choices: jsonChatData[4].map(i => ({ id: i[0], content: i[1] })),
        };
        this.conversationId = results.conversationId;
        this.responseId = results.responseId;

        this.choiceId = results.choices[0]?.id || "Google Bard couldn't answer this question.";
        this._reqid += 100000;
        return results.content;
    }
}

module.exports = bard;