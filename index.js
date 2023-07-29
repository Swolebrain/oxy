const puppeteer = require('puppeteer-core');

const validUserAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/114.0",
];

const brightDataHost = 'brd.superproxy.io:9222';
const brightDataUserName = 'xxx_sbrowser';
const brightDataPassword = 'xxx';
const countrySuffix = '-country-us';
const auth = `${brightDataUserName}:${brightDataPassword}`;

(async () => {
    const browser = await puppeteer.connect({
        browserWSEndpoint: `wss://${auth}@${brightDataHost}`,
    });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(2*60*1000);

    console.log('navigating...');
    await page.goto('https://www.google.com');
    await page.screenshot({path: 'afterNav.png'});
    console.log('waiting for textarea');
    await page.waitForSelector('textarea');
    console.log('typing');
    await page.type('textarea', 'coding tshirts', { delay: 50 });
    await page.screenshot({path: 'afterTyping.png'});
    console.log('issuing search');
    await Promise.all([
        page.keyboard.press('Enter'),
        page.waitForNavigation(),
    ]);
    await page.screenshot({path: 'afterEnter.png'});

    console.log('looking for result');
    let found = false;
    for (let i = 0; !found && i < 4; i++) {
        const [serpLink] = await page.$x("//span[contains(., 'Millionaire Coders Club')]");
        if (serpLink) {
            console.log('Found link, clicking it');
            found = true;
            await Promise.all([
                await serpLink.click(),
                page.waitForNavigation(),
            ]);
            break;
        } else {
            console.log('Trying next page...');
            await autoScroll(page);
        }
    }
    if (!found) {
        throw new Error("Never found mcc result, exiting");
    }
    console.log('waiting 20-30s');
    await new Promise((resolve) => setTimeout(resolve, 20000 * Math.random()*10000));
    await browser.close();
})();

async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight - window.innerHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

