const puppeteer = require('puppeteer');

const validUserAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/114.0',
];


(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--proxy-server=pr.oxylabs.io:7777'],
    ignoreDefaultArgs: ['--disable-extensions'],
});
  const page = await browser.newPage();
  page.setUserAgent(validUserAgents[Math.floor(Math.random(validUserAgents.length))]);  
  await page.authenticate({
     	username: 'seneca-cc-US',
        password: 'c4tegoricalImpertative'
  });
  await page.goto('https://www.google.com');
  await page.waitForSelector('textarea');
  await page.type('textarea', 'online cigar shop', { delay: 50 });
  await Promise.all([
    page.keyboard.press('Enter'),
    page.waitForNavigation(),
  ]);
  await page.screenshot({path: 'example.png'});
  await browser.close();
})();

