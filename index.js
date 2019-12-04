const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://exrx.net/Lists/Directory', {waitUntil: 'domcontentloaded'});

  const finalData = {
      
  }  

  const bodyPartsAndMuscles = await page.evaluate(() => {
    const groupMuscles = (muscle) => {
      let name = '';
      switch (muscle) {
        case 'Anterior':
          name = 'Deltoid - Anterior'
        break;
        case 'Lateral':
          name = 'Deltoid - Lateral'
        break;
        case 'Posterior':
          name = 'Deltoid - Posterior'
        break;
        case 'Flexors':
          name = 'Wrist - Flexors'
        break;
        case 'Extensors':
            name = 'Wrist - Extensors'
        break;
        case 'Upper':
            name = 'Trapezius - Upper'
        break;
        case 'Middle':
            name = 'Trapezius - Middle'
        break;
        case 'Lower':
            name = 'Trapezius - Lower'
        break;
        case 'Sternal':
            name = 'Pectoralis Major - Sternal'
        break;
        case 'Clavicular':
            name = 'Pectoralis Major - Clavicular'
        break;
        default:
          name = muscle;
        break;
      }
      return name;
    }
    const bodyPartsElements = document.querySelectorAll('.col-sm-6 > ul > li > a');

    const musclesElements = document.querySelectorAll('.col-sm-6 > ul > li');
    
    const data = [];
    for(let i = 0; i < bodyPartsElements.length; i++) {
      // muscles
      let muscleArray = musclesElements[i].innerText.split('\n');
      // remove first entry as it repeats the name itself
      muscleArray.shift();
      let muscleObjects = [];
      muscleArray.forEach(element => {
        // non-clickable areas
        if (element !== 'Deltoid' || 'Wrist' || 'Trapezius' || 'Pectoralis Major') {
          muscleObjects.push({"name": groupMuscles(element)});
        }
      });

      // output
      data.push(
        {
          "name": bodyPartsElements[i].innerText,
          "href": bodyPartsElements[i].href,
          "muscles": muscleObjects
        });
    }
    return data;
  });

  finalData.bodyparts = bodyPartsAndMuscles;

  const getExercises = async(bodyparts) => {
    let exercises = [];
    console.log(bodyparts);
    for (let i = 0; i < bodyparts.length; i++) {

      console.log(bodyparts[i].href);
      await page.goto(bodyparts[i].href, {waitUntil: 'domcontentloaded'});

      const exercisePage = await page.evaluate(() => {
        let exercisesContent = document.querySelectorAll('article > .container');
        for(let i = 0; i < exercisesContent.length; i++) {
          console.log('title', exercisesContent[i].innerText)
          // console.log('content', exercisesContent[i+1].innerText)
        }
        
        return [{title: document.title}];
      });
      exercises.push(exercisePage);
    }
    return exercises;
  }
  
  
  

  // console.log(JSON.stringify(finalData));
  await getExercises(finalData.bodyparts);
  await browser.close();
})();