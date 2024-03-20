const axios = require("axios");
const cheerio = require("cheerio");

async function chord(query) {
  const search = await axios.get(
    `https://www.gitagram.com/?s=${encodeURIComponent(query).replace(
      /%20/g,
      "+"
    )}`
  );
  const $ = await cheerio.load(search.data);
  const $url = $("table.table > tbody > tr")
    .eq(0)
    .find("td")
    .eq(0)
    .find("a")
    .eq(0);
  const url = $url.attr("href");
  const song = await axios.get(url);
  const $song = await cheerio.load(song.data);
  const $hcontent = $song("div.hcontent");
  const artist = $hcontent.find("div > a > span.subtitle").text().trim();
  const artistUrl = $hcontent.find("div > a").attr("href");
  const title = $hcontent.find("h1.title").text().trim();
  const chord = $song("div.content > pre").text().trim();
  const res = {
    url: url,
    artist,
    artistUrl,
    title,
    chord,
  };
  return res;
}

module.exports = { chord };
