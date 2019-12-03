const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://exrx.net/Lists/Directory');

  const finalData = {
      bodyparts: []
  }  

  const bodyPartsAndMuscles = await page.evaluate(() => {
    const bodyPartsElements = document.querySelectorAll('.col-sm-6 > ul > li > a');

    // const musclesElements = document.querySelectorAll('.col-sm-6 > ul > li > ul');
    
    const data = [];
    for(let i = 0; i < bodyPartsElements.length; i++) {
        data.push({"name": bodyPartsElements[i].innerText});
    }
    return data;
  });

  finalData.bodyparts.push(bodyPartsAndMuscles);





//   console.log(JSON.stringify(finalData));
  await browser.close();
})();