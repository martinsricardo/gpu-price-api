const express = require("express");
const routes = express.Router();

const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const schedule = require("node-schedule");

const fs = require("fs");
const { serialize } = require("v8");

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

routes.get("/", (req, res) => {
  res.send("Welcome");
});

routes.get("/api", (req, res) => {
  (async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    const selectorGpuName =
      "#__next > div.z-1.flex.flex-col.justify-between.min-h-screen > div.z-1.base-container.py-5.bg-background.pb-28.flex-grow > main > div > div.grid.content-start.lg\\:grid-flow-col.lg\\:grid-cols-catalog.xl\\:grid-cols-catalog-md.\\32 xl\\:grid-cols-catalog-lg.gap-2.md\\:gap-4 > div:nth-child(2) > div:nth-child(2) > div > div > div > a";
    const selectorGpuPrice =
      "#__next > div.z-1.flex.flex-col.justify-between.min-h-screen > div.z-1.base-container.py-5.bg-background.pb-28.flex-grow > main > div > div.grid.content-start.lg\\:grid-flow-col.lg\\:grid-cols-catalog.xl\\:grid-cols-catalog-md.\\32 xl\\:grid-cols-catalog-lg.gap-2.md\\:gap-4 > div:nth-child(2) > div:nth-child(2) > div > div > div> div.mt-2.flex.justify-between.flex-wrap.items-center.gap-x-2 > div > div.font-extrabold.text-lg.md\\:text-2xl.text-primary";
    const selectorGpuId =
      "#__next > div.z-1.flex.flex-col.justify-between.min-h-screen > div.z-1.base-container.py-5.bg-background.pb-28.flex-grow > main > div > div.grid.content-start.lg\\:grid-flow-col.lg\\:grid-cols-catalog.xl\\:grid-cols-catalog-md.\\32 xl\\:grid-cols-catalog-lg.gap-2.md\\:gap-4 > div:nth-child(2) > div:nth-child(2) > div > div > div > div.mt-2.mb-1\\.5.h-4.lg\\:h-4.text-xxs.md\\:text-xs";
    let pages = 3;
    var test = [];
    for (let i = 1; pages >= i; i++) {
      await page.goto(
        //https://www.pcdiga.com/mobilidade/smartphones-e-telemoveis/smartphones-android
        //https://www.pcdiga.com/componentes/placas-graficas/placas-graficas-nvidia?produtos_por_pagina=36&pagina=${i}
        `https://www.pcdiga.com/componentes/placas-graficas/placas-graficas-nvidia?produtos_por_pagina=36&pagina=${i}`
      );
      await page.waitForSelector(
        "#__next > div.z-1.flex.flex-col.justify-between.min-h-screen > div.z-1.base-container.py-5.bg-background.pb-28.flex-grow > main > div > div.grid.content-start.lg\\:grid-flow-col.lg\\:grid-cols-catalog.xl\\:grid-cols-catalog-md.\\32 xl\\:grid-cols-catalog-lg.gap-2.md\\:gap-4 > div:nth-child(2) > div:nth-child(2) > div > div > div > a"
      );
      const gpuId = await page.$$eval(selectorGpuId, (options) =>
        options.map((option) => option.textContent)
      );
      const gpuName = await page.$$eval(selectorGpuName, (options) =>
        options.map((option) => option.textContent)
      );
      const gpuPrice = await page.$$eval(selectorGpuPrice, (options) =>
        options.map((option) => option.textContent)
      );

      for (let i = 0; gpuName.length > i; i++) {
        let arrObj = {
          id: gpuId[i],
          name: gpuName[i],
          price: gpuPrice[i],
          priceHistory:[]
        };
        test.push(arrObj);
      }


      //test.push(result);
      //console.log(result);
      //test.push(result);

      //test.push(result);
      //console.log(result);
    }


    if (!fs.existsSync("sample.json")) { //Se o ficheiro não existir cria um ficheiro novo e insere o array de produtos nesse ficheiro novo
      let data = JSON.stringify(test);
      fs.writeFile("sample.json", data, function (err) {
        if (err) throw err;
        console.log("File is created successfully");
      });
    } else { //Se o ficheiro existir
      const fileData = JSON.parse(fs.readFileSync("sample.json")); //transforma o sample.json em um array em vez de string

      for (let i2 = 0; test.length > i2; i2++) { //Para cada objeto do array test
        if (userExists(test[i2].id) == true) { //Se a o produto já existir
          console.log("existe");
          if (priceSame(test[i2].price, test[i2].id) == true) { //verifica se o preço é mesmo
            console.log("Preço igual " + test[i2].price + " - " + test[i2].name);      //se for retorna true
          } else {                                           //Em caso de preço diferente
            console.log("Preço diferentes " + test[i2].price + " - " + test[i2].name); //Se o preço for diferente insere preço no historico
            //console.log(fileData)
            fileData[i2].price = test[i2].price; //Muda o campo currentPrice para o preço novo

            let price = {
              price: test[i2].price,
              date: date,
            };

            fileData[i2].priceHistory.push(price);  //insere o preço novo no historico

            console.log(fileData[i2].price);
            fs.writeFileSync("sample.json", JSON.stringify(fileData)); 
          }
        } else {  //Insere o novo produto no sample.json
          console.log("Produto não existe");

          let arr = {
            id: test[i2].id,
            name: test[i2].name,
            price: test[i2].price,
            priceHistory: [],
          };
          let price = {
            price: test[i2].price,
            date: date,
          };

          arr.priceHistory.push(price);

          fileData.push(arr);
          fs.writeFileSync("sample.json", JSON.stringify(fileData));
        }
      }
      console.log(test.length);
      console.log(fileData.length);
    }

    function userExists(username) { // Verifica se já existe um produto com este id part
      const fileData = JSON.parse(fs.readFileSync("sample.json"));
      return fileData.some(function (el) {
        return el.id === username;
      });
    }

    function priceSame(price, id) {
      const fileData = JSON.parse(fs.readFileSync("sample.json"));
      return fileData.some(function (el) {
        //console.log(el.price+" equals "+price)
        return el.price === price && el.id === id;
      });
    }

    console.log(test);
    await browser.close();
    return res.json(test);
  })();
});

module.exports = routes;

//Price selector #__next > div.z-1.flex.flex-col.justify-between.min-h-screen > div.z-1.base-container.py-5.bg-background.pb-28.flex-grow > main > div > div.grid.content-start.lg\:grid-flow-col.lg\:grid-cols-catalog.xl\:grid-cols-catalog-md.\32 xl\:grid-cols-catalog-lg.gap-2.md\:gap-4 > div > div > div > div > div > div.mt-2.flex.justify-between.flex-wrap.items-center.gap-x-2 > div > div.font-extrabold.text-lg.md\:text-2xl.text-primary
//xpath //*[@id="__next"]/div[2]/div[1]/main/div/div[5]/div[2]/div[2]/div/div/div/div[5]/div/div[1]

/* const result = await page.$$eval("#__next > div.z-1.flex.flex-col.justify-between.min-h-screen > div.z-1.base-container.py-5.bg-background.pb-28.flex-grow > main > div > div.grid.content-start.lg\\:grid-flow-col.lg\\:grid-cols-catalog.xl\\:grid-cols-catalog-md.\\32 xl\\:grid-cols-catalog-lg.gap-2.md\\:gap-4 > div:nth-child(2) > div:nth-child(2) > div > div > div", (msgs) =>
        msgs.map((msg) => {
          return {
            id: msg.querySelector('div.mt-2.mb-1\\.5.h-4.lg\\:h-4.text-xxs.md\\:text-xs').textContent,
            name: msg.querySelector('a.mt-2.h-8.md\\:h-12.with-tab.rounded-md.font-bold.text-xs.md\\:text-base-sm.md\\:leading-6.line-clamp-2.hover\\:text-primary.duration-150.cursor-pointer').textContent,
            price: msg.querySelector('div.mt-2.flex.justify-between.flex-wrap.items-center.gap-x-2 > div > div.font-extrabold.text-lg.md\\:text-2xl.text-primary').textContent.slice(0,-2),
            priceHistory:[]
          };
        })
      );
      test.push(result)
      console.log(result)
    }*/
