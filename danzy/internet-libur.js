const moment = require('moment');

function getHoliday(year) {
  const holidays = [
    '01-01', // Tahun Baru
    '03-22', // Hari Isra' Mi'raj
    '05-01', // Hari Buruh Internasional
    '05-07', // Hari Raya Waisak
    '06-01', // Hari Pancasila
    '07-20', // Hari Raya Idul Fitri
    '07-21', // Hari Raya Idul Fitri
    '08-17', // Hari Kemerdekaan
    '12-24', // Hari Raya Natal
    '12-25', // Hari Raya Natal
    '12-31'  // Malam Tahun Baru
  ];

  const startDate = moment(year + '-01-01');
  const endDate = moment(year + '-12-31');

  let holidaysArray = [];
  let currentDate = startDate.clone();

  while (currentDate.isSameOrBefore(endDate)) {
    if (holidays.includes(currentDate.format('MM-DD'))) {
      holidaysArray.push(currentDate.clone());
    }
    currentDate.add(1, 'day');
  }
  
  return holidaysArray;
}

let danz = async (m, { conn }) => {
  const year = new Date().getFullYear();
  const holidays = getHoliday(year);

  let calendar = '';
  for (let i = 0; i < holidays.length; i++) {
    const holiday = holidays[i];
    calendar += `${holiday.format('DD MMMM')}: ${holiday.format('dddd')}\n`;
  }

  conn.reply(m.chat, `Kalender Hari Libur Indonesia Tahun ${year}\n
${calendar}`, m);
};

danz.command = danz.help = ["libur"];
danz.tags = ["tools"];

module.exports = danz;

/**
  * DannTeam
  * Instagram: @dannalwaysalone
*/