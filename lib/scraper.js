const axios = require("axios")
const cheerio = require('cheerio')

function ttStalk(username) {
  return new Promise((resolve, reject) => {
    if (!username) return reject(new Error("Masukkan Username!"));
    axios.get("https://tiktod.eu.org" + "/stalk", { params: { username } })
      .then((stalker) => resolve(stalker.data))
      .catch(reject);
  });
}

function ttPorn() {
  return new Promise((resolve, reject) => {
    axios.get("https://tiktod.eu.org" + "/porn")
      .then((porner) => resolve(porner.data))
      .catch(reject);
  });
}

function ttDownload(url) {
  return new Promise((resolve, reject) => {
    if (!url) return reject(new Error("Masukkan URL!"));
    axios.get("https://tiktod.eu.org" + "/download", { params: { url } })
      .then((dl) => resolve(dl.data))
      .catch(reject);
  });
}

function PlayStore(search) {
  return new Promise(async (resolve, reject) => {
    try {
      const { data, status } = await axios.get(`https://play.google.com/store/search?q=${search}&c=apps`)
      const hasil = []
      const $ = cheerio.load(data)
      $('.ULeU3b > .VfPpkd-WsjYwc.VfPpkd-WsjYwc-OWXEXe-INsAgc.KC1dQ.Usd1Ac.AaN0Dd.Y8RQXd > .VfPpkd-aGsRMb > .VfPpkd-EScbFb-JIbuQc.TAQqTe > a').each((i, u) => {
        const linkk = $(u).attr('href')
        const nama = $(u).find('.j2FCNc > .cXFu1 > .ubGTjb > .DdYX5').text()
        const developer = $(u).find('.j2FCNc > .cXFu1 > .ubGTjb > .wMUdtb').text()
        const img = $(u).find('.j2FCNc > img').attr('src')
        const rate = $(u).find('.j2FCNc > .cXFu1 > .ubGTjb > div').attr('aria-label')
        const rate2 = $(u).find('.j2FCNc > .cXFu1 > .ubGTjb > div > span.w2kbF').text()
        const link = `https://play.google.com${linkk}`

        hasil.push({
          link: link,
          nama: nama ? nama : 'No name',
          developer: developer ? developer : 'No Developer',
          img: img ? img : 'https://i.ibb.co/G7CrCwN/404.png',
          rate: rate ? rate : 'No Rate',
          rate2: rate2 ? rate2 : 'No Rate',
          link_dev: `https://play.google.com/store/apps/developer?id=${developer.split(" ").join('+')}`
        })
      })
      if (hasil.every(x => x === undefined)) return resolve({ message: 'Tidak ada result!' })
      resolve(hasil)
    } catch (err) {
      console.error(err)
    }
  })
}

async function cerpen(category) {
	return new Promise(async (resolve, reject) => {
		let title = category.toLowerCase().replace(/[()*]/g, "")
		let length, judul = title.replace(/\s/g, "-")
		try {
			let res = await axios.get('http://cerpenmu.com/category/cerpen-'+judul)
			let $ = await cheerio.load(res.data)
			length = $('html body div#wrap div#content article.post div.wp-pagenavi a')
			length = length['4'].attribs.href.split('/').pop()
		} catch { length = 0 }
		let page = Math.floor(Math.random() * parseInt(length))
		axios.get('http://cerpenmu.com/category/cerpen-'+judul+'/page/'+page)
		.then((get) => {
			let $ = cheerio.load(get.data)
			let link = []
			$('article.post').each(function (a, b) {
				link.push($(b).find('a').attr('href'))
			})
			let random = link[Math.floor(Math.random() * link.length)]
			axios.get(random)
			.then((res) => {
				let $$ = cheerio.load(res.data)
				let hasil = {
					title: $$('#content > article > h1').text(),
					author: $$('#content > article').text().split('Cerpen Karangan: ')[1].split('Kategori: ')[0],
					kategori: $$('#content > article').text().split('Kategori: ')[1].split('\n')[0],
					lolos: $$('#content > article').text().split('Lolos moderasi pada: ')[1].split('\n')[0],
					cerita: $$('#content > article > p').text()
				}
				resolve(hasil)
			})
		})
	})
}

function BukaLapak(search) {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await axios.get(`https://www.bukalapak.com/products?from=omnisearch&from_keyword_history=false&search[keywords]=${search}&search_source=omnisearch_keyword&source=navbar`, {
        headers: {
          "user-agent": 'Mozilla/ 5.0(Windows NT 10.0; Win64; x64; rv: 108.0) Gecko / 20100101 Firefox / 108.0'
        }
      })
      const $ = cheerio.load(data);
      const dat = [];
      const b = $('a.slide > img').attr('src');
      $('div.bl-flex-item.mb-8').each((i, u) => {
        const a = $(u).find('observer-tracker > div > div');
        const img = $(a).find('div > a > img').attr('src');
        if (typeof img === 'undefined') return

        const link = $(a).find('.bl-thumbnail--slider > div > a').attr('href');
        const title = $(a).find('.bl-product-card__description-name > p > a').text().trim();
        const harga = $(a).find('div.bl-product-card__description-price > p').text().trim();
        const rating = $(a).find('div.bl-product-card__description-rating > p').text().trim();
        const terjual = $(a).find('div.bl-product-card__description-rating-and-sold > p').text().trim();

        const dari = $(a).find('div.bl-product-card__description-store > span:nth-child(1)').text().trim();
        const seller = $(a).find('div.bl-product-card__description-store > span > a').text().trim();
        const link_sel = $(a).find('div.bl-product-card__description-store > span > a').attr('href');

        const res_ = {
          title: title,
          rating: rating ? rating : 'No rating yet',
          terjual: terjual ? terjual : 'Not yet bought',
          harga: harga,
          image: img,
          link: link,
          store: {
            lokasi: dari,
            nama: seller,
            link: link_sel
          }
        };

        dat.push(res_);
      })
      if (dat.every(x => x === undefined)) return resolve({ message: 'Tidak ada result!' })
      resolve(dat)
    } catch (err) {
      console.error(err)
    }
  })
}

function SepakBola() {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await axios.get('https://www.jadwaltv.net/jadwal-sepakbola');
      const $ = cheerio.load(data)
      let tv = []
      $('table.table.table-bordered > tbody > tr.jklIv').each((u, i) => {
        let an = $(i).html().replace(/<td>/g, '').replace(/<\/td>/g, ' - ')
        tv.push(`${an.substring(0, an.length - 3)}`)
      })
      if (tv.every(x => x === undefined)) return resolve({ message: 'Tidak ada result!' })
      resolve(tv)
    } catch (err) {
      console.error(err)
    }
  })
}

async function artinama(query) {
	return new Promise((resolve, reject) => {
		queryy = query.replace(/ /g, '+')
		axios.get('https://www.primbon.com/arti_nama.php?nama1=' + query + '&proses=+Submit%21+')
			.then(({
				data
			}) => {
				const $ = cheerio.load(data)
				const result = $('#body').text();
				const result2 = result.split('\n      \n        \n        \n')[0]
				const result4 = result2.split('ARTI NAMA')[1]
				const result5 = result4.split('.\n\n')
				const result6 = result5[0] + '\n\n' + result5[1]
				resolve(result6)
			})
			.catch(reject)
	})
}

async function randomCerpen() {
  try {
    const n = await axios.get("http://cerpenmu.com/"),
      a = cheerio.load(n.data);
    let r = [];
    a("#sidebar > div").each(function (t, e) {
      a(e)
        .find("ul > li")
        .each(function (t, e) {
          let n = a(e).find("a").attr("href");
          r.push(n);
        });
    });
    var t = r[Math.floor(Math.random() * r.length)];
    let o = await axios.get(`${t}`);
    const i = cheerio.load(o.data);
    let c = [];
    i("#content > article > article").each(function (t, e) {
      let n = i(e).find("h2 > a").attr("href");
      c.push(n);
    });
    var e = c[Math.floor(Math.random() * c.length)];
    let s = await axios.get(`${e}`),
      u = cheerio.load(s.data),
      l = u("#content").find("article > h1").text().trim(),
      h = u("#content").find("article > a:nth-child(2)").text().trim(),
      f = [];
    u("#content > article > p").each(function (t, e) {
      let n = u(e).text().trim();
      f.push(n);
    });
    let w = [];
    for (let t of f) w += t;
    return { status: !0, judul: l, penulis: h, sumber: e, cerita: w };
  } catch (t) {
    return { status: !1 };
  }
}

async function ceritaHoror() {
  return new Promise((t, e) => {
    axios
      .get("https://cerita-hantu.com/list-cerita-hantu-a-z/")
      .then(({ data: e }) => {
        const n = cheerio.load(e),
          a = [];
        n("div > div > ul:nth-child(7) > li > a").each(function (t, e) {
          a.push(n(e).attr("href"));
        }),
          n("div > div > ul:nth-child(9) > li > a").each(function (t, e) {
            null != n(e).attr("href") && a.push(n(e).attr("href"));
          }),
          n("div > div > ol > li > a").each(function (t, e) {
            null != n(e).attr("href") && a.push(n(e).attr("href"));
          }),
          axios
            .get(a[Math.floor(Math.random() * a.length)])
            .then(({ data: e }) => {
              const n = cheerio.load(e),
                a = [];
              n("div > div > a").each(function (t, e) {
                n(e).attr("href").startsWith("https:") &&
                  a.push(n(e).attr("href"));
              }),
                (rand = a[Math.floor(Math.random() * a.length)]),
                axios.get(rand).then(({ data: e }) => {
                  const n = cheerio.load(e);
                  t({
                    judul: n("div > header > div > h1 > a").text(),
                    author: n(
                      "div > header > div > div > span.simple-grid-entry-meta-single-author > span > a"
                    ).text(),
                    author_link: n(
                      "div > header > div > div > span.simple-grid-entry-meta-single-author > span > a"
                    ).attr("href"),
                    upload_date: n(
                      "div > header > div > div > span.simple-grid-entry-meta-single-date"
                    ).text(),
                    kategori: n(
                      "div > header > div > div > span.simple-grid-entry-meta-single-cats > a"
                    ).text(),
                    source: rand,
                    cerita: n("div > div > p")
                      .text()
                      .split("Cerita Hantu")[1]
                      .split("Copyright")[0],
                  });
                });
            });
      });
  });
}

async function tiktokdl(url) {
  return new Promise(async (resolve, reject) => {
  try {
    const response = await axios.get(`https://ssstiktok.ws/mates/en/analyze/ajax?url=${url}`)
    const $ = cheerio.load(response.data)
    const results = []
    const imageSrc = $('.snaptik-left img').attr('src')
    const videoTitle = $('#video-name').attr('title')
    const videoDescription = $('.snaptik-middle p span').last().text().trim()
    const videoDuration = $('.video-time span').text().trim()
    const mp4DownloadLink = $('#download-mp4-id').attr('hrefs')
    const mp3DownloadLink = $('#download-mp3-id').attr('hrefs')
    results.push({
      title: videoTitle,
      description: videoDescription,
      duration: videoDuration,
      thumbnail: imageSrc,
      mp4: mp4DownloadLink,
      mp3: mp3DownloadLink
    })
    resolve(results)
  } catch (error) {
    throw new Error(`There was an error fetching the information: ${error.message}`)
  }
 })
}

module.exports = {
  ttStalk,
  ttPorn,
  ttDownload,
  PlayStore,
  cerpen,
  BukaLapak,
  SepakBola,
  artinama,
  randomCerpen,
  ceritaHoror,
  tiktokdl
}