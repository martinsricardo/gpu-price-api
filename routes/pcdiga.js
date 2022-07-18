const express = require("express");
const routes = express.Router();

const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const schedule = require("node-schedule");

const fs = require("fs");

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

    let pages = 3;
    let test = [];
    for (let i = 1; pages >= i; i++) {
      await page.goto(
        //https://www.pcdiga.com/mobilidade/smartphones-e-telemoveis/smartphones-android
        //https://www.pcdiga.com/componentes/placas-graficas/placas-graficas-nvidia?produtos_por_pagina=36&pagina=${i}
        `https://www.pcdiga.com/componentes/placas-graficas/placas-graficas-nvidia?produtos_por_pagina=36&pagina=${i}`
      );

      //GPU NAME
      await page
        .$(
          "#__next > div.z-1.flex.flex-col.justify-between.min-h-screen > div.z-1.base-container.py-5.bg-background.pb-28.flex-grow > main > div > div.grid.content-start.lg\\:grid-flow-col.lg\\:grid-cols-catalog.xl\\:grid-cols-catalog-md.\\32 xl\\:grid-cols-catalog-lg.gap-2.md\\:gap-4 > div:nth-child(2) > div:nth-child(2) > div > div > div > a"
        )
        .then(() => console.log("Gpu name -> check"));

      const services = await page.evaluate(() =>
        Array.from(
          document.querySelectorAll(
            "#__next > div.z-1.flex.flex-col.justify-between.min-h-screen > div.z-1.base-container.py-5.bg-background.pb-28.flex-grow > main > div > div.grid.content-start.lg\\:grid-flow-col.lg\\:grid-cols-catalog.xl\\:grid-cols-catalog-md.\\32 xl\\:grid-cols-catalog-lg.gap-2.md\\:gap-4 > div:nth-child(2) > div:nth-child(2) > div > div > div > a"
          ),
          (element) => element.textContent
        )
      );
      console.log(services);

      //GPU ID
      // #__next > div.z-1.flex.flex-col.justify-between.min-h-screen > div.z-1.base-container.py-5.bg-background.pb-28.flex-grow > main > div > div.grid.content-start.lg\:grid-flow-col.lg\:grid-cols-catalog.xl\:grid-cols-catalog-md.\32 xl\:grid-cols-catalog-lg.gap-2.md\:gap-4 > div:nth-child(2) > div:nth-child(2) > div > div > div > div.mt-2.mb-1\.5.h-4.lg\:h-4.text-xxs.md\:text-xs
      await page
        .$(
          "#__next > div.z-1.flex.flex-col.justify-between.min-h-screen > div.z-1.base-container.py-5.bg-background.pb-28.flex-grow > main > div > div.grid.content-start.lg\\:grid-flow-col.lg\\:grid-cols-catalog.xl\\:grid-cols-catalog-md.\\32 xl\\:grid-cols-catalog-lg.gap-2.md\\:gap-4 > div:nth-child(2) > div:nth-child(2) > div > div > div > div.mt-2.mb-1\\.5.h-4.lg\\:h-4.text-xxs.md\\:text-xs"
        )
        .then(() => console.log("gpu Id -> check"));

      const gpuId = await page.evaluate(() =>
        Array.from(
          document.querySelectorAll(
            "#__next > div.z-1.flex.flex-col.justify-between.min-h-screen > div.z-1.base-container.py-5.bg-background.pb-28.flex-grow > main > div > div.grid.content-start.lg\\:grid-flow-col.lg\\:grid-cols-catalog.xl\\:grid-cols-catalog-md.\\32 xl\\:grid-cols-catalog-lg.gap-2.md\\:gap-4 > div:nth-child(2) > div:nth-child(2) > div > div > div > div.mt-2.mb-1\\.5.h-4.lg\\:h-4.text-xxs.md\\:text-xs"
          ),
          (element) => element.textContent
        )
      );
      console.log(gpuId);

      //GPU PRICE
      // #__next > div.z-1.flex.flex-col.justify-between.min-h-screen > div.z-1.base-container.py-5.bg-background.pb-28.flex-grow > main > div > div.grid.content-start.lg\:grid-flow-col.lg\:grid-cols-catalog.xl\:grid-cols-catalog-md.\32 xl\:grid-cols-catalog-lg.gap-2.md\:gap-4 > div:nth-child(2) > div:nth-child(2) > div > div > div> div.mt-2.flex.justify-between.flex-wrap.items-center.gap-x-2 > div > div.font-extrabold.text-lg.md\:text-2xl.text-primary
      await page
        .$(
          "#__next > div.z-1.flex.flex-col.justify-between.min-h-screen > div.z-1.base-container.py-5.bg-background.pb-28.flex-grow > main > div > div.grid.content-start.lg\\:grid-flow-col.lg\\:grid-cols-catalog.xl\\:grid-cols-catalog-md.\\32 xl\\:grid-cols-catalog-lg.gap-2.md\\:gap-4 > div:nth-child(2) > div:nth-child(2) > div > div > div> div.mt-2.flex.justify-between.flex-wrap.items-center.gap-x-2 > div > div.font-extrabold.text-lg.md\\:text-2xl.text-primary"
        )
        .then(() => console.log("got it Price"));

        const gpuPrice = await page.evaluate(() =>
        Array.from(
          document.querySelectorAll(
            "#__next > div.z-1.flex.flex-col.justify-between.min-h-screen > div.z-1.base-container.py-5.bg-background.pb-28.flex-grow > main > div > div.grid.content-start.lg\\:grid-flow-col.lg\\:grid-cols-catalog.xl\\:grid-cols-catalog-md.\\32 xl\\:grid-cols-catalog-lg.gap-2.md\\:gap-4 > div:nth-child(2) > div:nth-child(2) > div > div > div> div.mt-2.flex.justify-between.flex-wrap.items-center.gap-x-2 > div > div.font-extrabold.text-lg.md\\:text-2xl.text-primary"
          ),
          (element) => element.textContent
        )
      );
      console.log(gpuPrice);

      for (let i2 = 0; element.length > i2; i2++) {
        let arr = {
          id: gpuId[i2],
          name: gpuName[i2],
          price: gpuPrice[i2],
          priceHistory: [],
        };

        test.push(arr);
      }
    }
    var today = new Date();

    var date =
      today.getDate() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getFullYear();

    let arr2 = test.priceHistory;
    for (let i2 = 0; test.length > i2; i2++) {
      let price = {
        price: test[i2].price,
        date: date,
      };
      arr2 = test[i2].priceHistory;
      arr2.push(price);
    }
    await browser.close();
    //----------------------------------------------------------

    if (!fs.existsSync("sample.json")) {
      let data = JSON.stringify(test);
      //console.log(data);
      fs.writeFile("sample.json", data, function (err) {
        if (err) throw err;
        console.log("File is created successfully.");
      });
    } else {
      const fileData = JSON.parse(fs.readFileSync("sample.json"));

      for (let i2 = 0; test.length > i2; i2++) {
        if (userExists(test[i2].id) == true) {
          console.log("existe");
          if (priceSame(test[i2].price, test[i2].id) == true) {
            console.log("Preço igual " + test[i2].price);
          } else {
            console.log("Preço diferentes " + test[i2].price);
            //Mudar agora no ficheiro JSON
            fileData[i2].price = test[i2].price;

            let price = {
              price: test[i2].price,
              date: date,
            };
            fileData[i2].priceHistory.push(price);

            console.log(fileData[i2].price);
            fs.writeFileSync("sample.json", JSON.stringify(fileData));
          }
        } else {
          console.log("não existe");

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

    function userExists(username) {
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

    return res.json(test);
  })();
});

module.exports = routes;

//Price selector #__next > div.z-1.flex.flex-col.justify-between.min-h-screen > div.z-1.base-container.py-5.bg-background.pb-28.flex-grow > main > div > div.grid.content-start.lg\:grid-flow-col.lg\:grid-cols-catalog.xl\:grid-cols-catalog-md.\32 xl\:grid-cols-catalog-lg.gap-2.md\:gap-4 > div > div > div > div > div > div.mt-2.flex.justify-between.flex-wrap.items-center.gap-x-2 > div > div.font-extrabold.text-lg.md\:text-2xl.text-primary
//xpath //*[@id="__next"]/div[2]/div[1]/main/div/div[5]/div[2]/div[2]/div/div/div/div[5]/div/div[1]
