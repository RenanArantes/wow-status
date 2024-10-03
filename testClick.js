import puppeteer from 'puppeteer';
import fs from 'fs';
import * as cheerio from 'cheerio';


// Arquivo de teste para clicar no botão de inscrição e ver se a página muda
async function run() {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Set the viewport size
  await page.setViewport({ width: 1280, height: 800 });

  await page.goto('https://worldofwarcraft.blizzard.com/pt-br/game/status/us', { waitUntil: 'networkidle2' });

  await page.click('#blz-nav-wow-subscribe');

  const content = await page.content();
  console.log(typeof content);

  const rawHTML = content;
  console.log('rawHTML: ', rawHTML);
  const $ = cheerio.load(rawHTML);
}

run();