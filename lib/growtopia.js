var axios = require("axios");
var cheerio = require("cheerio");

async function growtopiaItems(nameItem) {
    try {
        const itemListResponse = await axios.get("https://growtopia.fandom.com/api/v1/SearchSuggestions/List?query=" + nameItem);
        const itemList = itemListResponse.data.items;

        if (itemList.length === 0) {
            return null;
        }

        const itemName = itemList[0].title;
        const link = `https://growtopia.wikia.com/wiki/${itemName}`;
        
        const getDataResponse = await axios.get(link);
        const $ = cheerio.load(getDataResponse.data);

        const Description = $(".card-text").first().text();
        const Properties = $("#mw-content-text > div > div.gtw-card.item-card > div:nth-child(4)")
            .text()
            .trim()
            .split(/[\.+\!]/)
            .filter((d) => d !== "");

        const Sprite = $("div.card-header .growsprite > img").attr("src");
        const Color = $(".seedColor > div").text().trim().split(" ");
        const Rarity = $(".card-header b > small").text().match(/(\d+)/);
        const Recipe = $(".recipebox table.content")
            .last()
            .text()
            .trim()
            .split(/[\r\n\x0B\x0C\u0085\u2028\u2029]+/)
            .map((el) => el.trim());
        const Splice = $(".bg-splice").text();
        const Info = $("#mw-content-text > div > p:nth-child(3)").text().trim();
        const Type = $("table.card-field tr:nth-child(1) > td")
            .text()
            .split(" ")
            .pop();

        const dataList = {
            Name: itemName,
            URL: link.replace(/ /g, "_"),
            Description,
            Properties: Properties.length > 0 ? Properties : undefined,
            Sprite,
            Color,
            Rarity: Rarity !== null ? parseInt(Rarity[0]) : undefined,
            Recipe: Recipe.length > 0
                ? {
                    type: Recipe.shift() || "",
                    recipe: Recipe,
                }
                : undefined,
            Splice: Splice.length > 0 ? Splice : undefined,
            Info,
            Type,
        };

        if (itemList.length > 1 && nameItem.toLowerCase() !== itemName.toLowerCase()) {
            const matches = itemList.map((i) => i.title);
            dataList.matches = matches;
        }

        return dataList;
    } catch (e) {
        console.error(e);
        return null;
    }
}

module.exports = growtopiaItems