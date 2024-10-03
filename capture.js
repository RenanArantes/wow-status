import puppeteer from 'puppeteer';
import fs from 'fs';
import * as cheerio from 'cheerio';

import {errorVerifier} from "./utils.js";

await captureStatusData('https://worldofwarcraft.blizzard.com/pt-br/game/status/us');
await captureStatusData('https://worldofwarcraft.blizzard.com/pt-br/game/status/tw');
await captureStatusData('https://worldofwarcraft.blizzard.com/pt-br/game/status/eu');
await captureStatusData('https://worldofwarcraft.blizzard.com/pt-br/game/status/kr');

// Launch the browser and open a new blank page
async function captureStatusData(pageURL) {
  try {
    const rawHTML = await getRawHTMLStatusPage(pageURL, { height: 800, width: 1280 });
    
    if(errorVerifier(rawHTML)) {
      throw rawHTML;
    }

    const data = await extractStatusData(rawHTML);

    if(errorVerifier(data)) {
      throw data;
    }

    const statusData = createStatusDataObject(data);

    if(errorVerifier(statusData)) {
      throw statusData;
    }

    // Dois ultimos caracteres da URL formam a localização
    const location = pageURL[pageURL.length - 2]+pageURL[pageURL.length - 1];

    // salvar server data num arquivo json
    fs.writeFileSync('statusData-' + location +'.json', JSON.stringify(statusData, null, 2));

    console.log('Finalizada a captura de dados de status para a região ' + location +'.');
  } catch (error) {
    console.log('Erro ao fazer a requisição');
    console.log(error);
    console.log('- - - - - - - - - -');
  }
}

/**
 * Captura todo o HTML de uma página.
 */
async function getRawHTMLStatusPage(url, options) {
  try {
    const height = options.height || 800;
    const width = options.width || 1280;

    // Cria o navegador e abre uma nova página em branco
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Define o tamanho do navegador(wxh)
    await page.setViewport({ width, height });

    // Acessa a página
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Pega o conteúdo da página
    const content = await page.content();

    // Fecha o navegador
    await browser.close();

    return content;
  } catch(error) {
    return {
      message: 'Erro ao tentar receber o HTML da página',
      error: error
    }
  }
}

/**
 * Extrai os dados da tabela de status da página.
 */
async function extractStatusData(rawHTML) {
  try {
    const $ = cheerio.load(rawHTML);

    const rows = $('.SortTable-row');

    const data = rows.map((i, row) => {
      const values = $(row).find('.SortTable-col.SortTable-data.align-center').map((j, col) => {
        const children = $(col).children();
   
        if(String($(col).html()).includes('<span class="Icon Icon--')) {
          const status = $(col).find('span').attr('class');

          if(status.includes("checkCircleGreen")) {
            return 'Online';
          } else if(children.find('span').hasClass('Icon--lockedFilled')) {
            return 'Locked';
          } else {
            return 'Offline';
          }
        }

        return $(col).text().trim();
      }).get();
      return values;
    }).get();

    return data;
  } catch(error) {
    return {
      message: 'Erro ao tentar extrair os dados de status da página',
      error: error
    }
  }
}

/**
 * Cria um objeto de dados de status com a seguinte estrutura,
 * ```javascript
 * {
 *    status: 'Online' | 'Offline',
 *    name: 'Nome do servidor',
 *    type: 'Tipo do servidor',
 *    population: 'População do servidor',
 *    dateTime: 'Data e hora do status',
 *    local: 'Localização do servidor'
 * }
 * ```
 */
function createStatusDataObject(data) {
  try {
    const serverData = [];
  
    for(let i = 0; i < data.length; i+=6) {
      const server = {
        status: String(data[i]),
        name: String(data[i+1]),
        type: String(data[i+2]),
        population: String(data[i+3]),
        dateTime: String(data[i+4]),
        local:String( data[i+5])
      };

      serverData.push(server);
    }

    return serverData;
  } catch(error) {
    return {
      message: 'Erro ao tentar criar o objeto de dados de status',
      error: error
    }
  }
}

