const cheerio = require('cheerio');
fetch('https://devpost.com/hackathons')
  .then(res => res.text())
  .then(html => {
    const $ = cheerio.load(html);
    const results = [];
    $('.hackathon-tile').each((i, el) => {
      if(i > 3) return;
      const title = $(el).find('h3').text().trim();
      const organizer = $(el).find('.host-label').text().trim() || 'Devpost Community';
      const deadlineText = $(el).find('.submission-period').text().trim();
      const link = $(el).find('a').attr('href');
      results.push({ title, organizer, deadlineText, link });
    });
    console.log(results);
  });
