const axios = require("axios");
const cheerio = require("cheerio");

async function search(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(`http://139.99.33.205/?s=${encodeURIComponent(query)}`);
      const $ = cheerio.load(response.data);
      let result = [];
      $("div.bs-pagination-wrapper:nth-child(2) > div > article").each(function (a, b) {
        result.push($(this).find("div > h2.title > a").attr("href"));
      });
      const random = result[Math.floor(Math.random() * result.length)];
      const { data } = await axios.get(random);
      if (data.length === 0) return;
      const _ = cheerio.load(data);
      let script = _("script[type='application/ld+json']").eq(3).get();
      let parse;
      for (let anu of script) {
        if (anu.children !== undefined) {
          parse = JSON.parse(anu.children[0].data);
        }
      }
      let resultObj = {
        title: parse.headline,
        author: parse.author.name,
        thumbnail: parse.image.url,
        published: parse.datePublished,
        url: parse.mainEntityOfPage,
        description: parse.description,
        story: _("div.post_text_inner").text().trim(),
      };
      resolve(resultObj);
    } catch (error) {
      reject(error);
    }
  });
}

async function random() {
  return new Promise(async (resolve, reject) => {
    try {
      const randPage = Math.floor(Math.random() * 4) + 1;
      const response = await axios.get(`https://www.lensa69.com/cerita-sex/page/${randPage}`);
      const $ = cheerio.load(response.data);
      let hasil = [];
      $(".items > .item").each(function (aa, bb) {
        hasil.push($(this).find("a").attr("href"));
      });
      let filterHasil = hasil.filter((F) => F != undefined);
      const randHasil = filterHasil[Math.floor(Math.random() * filterHasil.length)];
      let final = await axios.get(randHasil);
      if (final instanceof Error) return reject(final.message);
      const cc = cheerio.load(final.data);
      const title = cc("div.sbox > div.entry-content > div > h1").text().trim();
      const thumb = cc("div.sbox > div.entry-content > p > img").attr("src");
      const tanggal = cc("div.sbox > div.entry-content > div > p.fr > span").text().trim();
      const cerita = cc("div.sbox > div.entry-content").find("p").text().replace(tanggal, "").trim();
      const result = {
        title: title,
        thumb: thumb,
        tanggal: tanggal,
        cerita: cerita,
      };
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

async function bokep() {
  return new Promise(async (resolve, reject) => {
    try {
      const randPage = Math.floor(Math.random() * 4) + 1;
      const getData = await axios.get(`https://www.lensa69.com/category/video-bokep/page/${randPage}`);
      const $ = cheerio.load(getData.data);
      let resultt = [];
      $(".item").each(function (aa, bb) {
        resultt[aa] = {
          title: $(this).find("a > .image > img").attr("alt"),
          thumb: $(this).find("a > .image > img").attr("src"),
          url: $(this).find("a").attr("href"),
          views: $(this).find(".total-views").text().trim(),
        };
      });
      const filResult = resultt.filter((F) => F != undefined);
      const randResult = filResult[Math.floor(Math.random() * filResult.length)];
      let final = await axios.get(randResult.url);
      const $$ = cheerio.load(final.data);
      const urlLoad = $$(".movieplay > iframe").attr("src");
      const result = {
        title: randResult.title,
        thumb: randResult.thumb,
        views: `${randResult.views} views`,
        url: urlLoad,
      };
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  search,
  random,
  bokep
};