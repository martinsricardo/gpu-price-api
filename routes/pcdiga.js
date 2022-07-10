const express = require("express");
const routes = express.Router();

const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

const schedule = require('node-schedule');


function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

routes.get("/", (req, res) => {
  res.send("Welcome");
});

routes.get("/api", (req, res) => {
  (async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    let pages = 3;
    let test = [];
    for (let i = 1; pages >= i; i++) {
      await page.goto(
        //https://www.pcdiga.com/mobilidade/smartphones-e-telemoveis/smartphones-android
        //https://www.pcdiga.com/componentes/placas-graficas/placas-graficas-nvidia?produtos_por_pagina=36&pagina=${i}
        `https://www.pcdiga.com/componentes/placas-graficas/placas-graficas-nvidia?produtos_por_pagina=36&pagina=${i}`
      );

const { solved ,error } = await page.solveRecaptchas();
if(solved){
  console.log("captcha solved")
}else{
  console.log(error);
}
      //GPU NAME
      await page
        .waitForXPath(
          "//*[@id='__next']/div[2]/div/main/div/div/div/div/div/div/div/a"
        )
        .then(() => console.log("got it"));
      let element = await page.$x(
        "//*[@id='__next']/div[2]/div/main/div/div/div/div/div/div/div/a"
      );
      let gpuName = await page.evaluate((...element) => {
        return element.map((e) => e.textContent);
      }, ...element);

      //GPU ID
      await page
        .waitForXPath(
          "//*[@id='__next']/div[2]/div[1]/main/div/div[5]/div[2]/div[2]/div/div/div/div[3]"
        )
        .then(() => console.log("got it"));
      let gpuIdxPath = await page.$x(
        "//*[@id='__next']/div[2]/div[1]/main/div/div[5]/div[2]/div[2]/div/div/div/div[3]"
      );
      let gpuId = await page.evaluate((...gpuIdxPath) => {
        return gpuIdxPath.map((e) => e.textContent);
      }, ...gpuIdxPath);

      //GPU PRICE
      await page
        .waitForXPath(
          "//*[@id='__next']/div[2]/div[1]/main/div/div[5]/div[2]/div[2]/div/div/div/div[5]/div/div[1]"
        )
        .then(() => console.log("got it Price"));
      let gpuPriceXpath = await page.$x(
        "//*[@id='__next']/div[2]/div[1]/main/div/div[5]/div[2]/div[2]/div/div/div/div[5]/div/div[1]"
      );

      let gpuPrice = await page.evaluate((...gpuPriceXpath) => {
        return gpuPriceXpath.map((e) => e.textContent);
      }, ...gpuPriceXpath);

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
    //console.log(test);
    await browser.close();
    return res.json(test);
  })();
});

module.exports = routes;

//Price selector #__next > div.z-1.flex.flex-col.justify-between.min-h-screen > div.z-1.base-container.py-5.bg-background.pb-28.flex-grow > main > div > div.grid.content-start.lg\:grid-flow-col.lg\:grid-cols-catalog.xl\:grid-cols-catalog-md.\32 xl\:grid-cols-catalog-lg.gap-2.md\:gap-4 > div > div > div > div > div > div.mt-2.flex.justify-between.flex-wrap.items-center.gap-x-2 > div > div.font-extrabold.text-lg.md\:text-2xl.text-primary
//xpath //*[@id="__next"]/div[2]/div[1]/main/div/div[5]/div[2]/div[2]/div/div/div/div[5]/div/div[1]
