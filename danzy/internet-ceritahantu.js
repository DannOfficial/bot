const cheerio = require('cheerio');
const axios = require('axios');

let danz = async (m, {
  conn
}) => {
  await m.reply(wait)
  let res = await ceritahantu()
  let hasil = res.map(v => {
    return `• Title: ${v.title}
• Snippet: ${v.snippet}
• Image: ${v.image}
• URL: ${v.url}
    `
  })
  conn.reply(m.chat, hasil.join('\n'))
}

danz.command = danz.help = ["ceritahantu", "ceritahoror"]
danz.tags = ["internet"]
danz.limit = true

module.exports = danz

/**
 * DannTeam
 * Danz & Yanz
 * ig: @dannalwaysalone
*/

async function ceritahantu() {
  const response = await axios.get("https://cerita-hantu-nyata.blogspot.com/search?q=Kentang&m=1");
  const $ = cheerio.load(response.data);

  const popularPosts = [];

  $('.item-content').each((index, element) => {
    const post = {};
    post.title = $(element).find('.item-title a').text();
    post.snippet = $(element).find('.item-snippet').text().trim();
    popularPosts.push(post);
    post.image = $(element).find('.item-thumbnail img').attr('src');
    post.url = $(element).find('.item-title a').attr('href');
  });

  return popularPosts;
}