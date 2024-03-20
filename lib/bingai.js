const crypto = require("crypto");
const fetch = require("node-fetch");
const WebSocket = require("ws");

class BingAI {
    constructor(cookies) {
        this.cookies = cookies;
    }

    async suggest(query) {
        const response = await fetch(
            "https://www.bingapis.com/api/v7/suggestions?appid=B1513F135D0D1D1FC36E8C31C30A31BB25E804D0&setmkt=fr-FR&q=" +
                encodeURIComponent(query),
            {
                method: "GET",
            }
        );
        const json = await response.json();
        return json.suggestionGroups[0].searchSuggestions.map(
            (suggestion) => suggestion.displayText
        );
    }

    async createConversation() {
        const response = await fetch("https://www.bing.com/turing/conversation/create", {
            method: "GET",
            headers: {
                cookie: this.cookies,
            },
        });
        const json = await response.json();
        return new Conversation(
            json.clientId,
            json.conversationId,
            json.conversationSignature
        );
    }
}

class Conversation {
    EOL = "";
    json = {
        arguments: [
            {
                source: "cib",
                optionsSets: [
                    "nlu_direct_response_filter",
                    "deepleo",
                    "disable_emoji_spoken_text",
                    "responsible_ai_policy_235",
                    "enablemm",
                    "galileo",
                    "dlwebtrunc",
                    "glpromptv3plus",
                    "serploc",
                    "jbf101",
                    "dv3sugg",
                ],
                allowedMessageTypes: [
                    "Chat",
                    "InternalSearchQuery",
                    "InternalSearchResult",
                    "Disengaged",
                    "InternalLoaderMessage",
                    "RenderCardRequest",
                    "AdsQuery",
                    "SemanticSerp",
                    "GenerateContentQuery",
                    "SearchQuery",
                ],
                sliceIds: [
                    "ssoverlap25",
                    "sspltop5",
                    "sswebtop2",
                    "chk1cln",
                    "fstldsydaoltt",
                    "nofbkcf",
                    "sugdivdis",
                    "sydpayajax",
                    "fixsacodecf",
                    "185fdbk",
                    "321sloc",
                    "324hlthmons0",
                    "403jbf101",
                    "notigersccf",
                    "udsdserlc",
                    "udstrclm10cmp",
                    "udstrclm10",
                    "329v3pwebtrunc",
                ],
                verbosity: "verbose",
                traceId: crypto.randomBytes(16).toString("hex"),
                isStartOfSession: true,
                message: {
                    locationHints: [],
                    author: "user",
                    inputMethod: "Keyboard",
                    text: null,
                    messageType: "Chat",
                },
                conversationSignature: null,
                participant: {
                    id: null,
                },
                conversationId: null,
            },
        ],
        invocationId: "0",
        target: "chat",
        type: 4,
    };

    constructor(clientId, conversationId, conversationSignature) {
        this.json.arguments[0].conversationSignature = conversationSignature;
        this.json.arguments[0].participant.id = clientId;
        this.json.arguments[0].conversationId = conversationId;
    }

    async sendMessage(msg) {
        return await new Promise((resolve, reject) => {
            this.json.arguments[0].message.text = msg;
            const chat = new WebSocket("wss://sydney.bing.com/sydney/ChatHub");
            chat.onopen = () => {
                chat.send('{"protocol":"json","version":1}' + this.EOL);
            };
            chat.onmessage = (event) => {
                const data = event.data;
                const message = data.toString().split(this.EOL)[0];
                const json = JSON.parse(message);
                if (message == "{}") {
                    chat.send('{"type":6}' + this.EOL);
                    chat.send(JSON.stringify(this.json) + this.EOL);
                    this.json.invocationId = (
                        parseInt(this.json.invocationId) + 1
                    ).toString();
                    this.json.arguments[0].isStartOfSession = false;
                }
                if (json.type == 2) {
                    const response =
                        json.item.messages.filter(
                            (e) => e.messageType == "Chat"
                        ).reverse()[0] ||
                        json.item.messages.filter(
                            (e) =>
                                e.author == "bot" &&
                                e.adaptiveCards[0].body[0].type == "TextBlock"
                        ).reverse()[0];
                    chat.close();
                    resolve({
                        text: response.text.replace(/\[\^[0-9]\^\]/g, ""),
                        suggestions: (
                            response.suggestedResponses || { map: (cb) => undefined }
                        ).map((e) => e.text),
                        card:
                            (
                                json.item.messages.filter(
                                    (e) => e.messageType == "InternalSearchResult"
                                ).reverse()[0] || {}
                            ).groundingInfo,
                        spokenText:
                            (
                                json.item.messages.filter(
                                    (e) => e.spokenText != undefined
                                ).reverse()[0] || {}
                            ).spokenText,
                    });
                }
            };
        });
    }
}

module.exports = { BingAI, Conversation };