()=> {
    'use strict';
    let fs = require('fs');
    let request = require('request');
    let cheerio = require('cheerio');
    let q = require('q');

    const scrapeUrl = 'http://www.exrx.net/Lists/Directory.html/';

    let getData = (callback) => {
        request(scrapeUrl, (error, response, html) => {
            if (!error) {
                let muscles = [];
                let $ = cheerio.load(html);

                let muscleData = {
                    muscles: $('table[border="1"] > tr > td:nth-child(1) > ul > li').map(function(i, elem) {
                        return {
                            area: {name: $(this).find('a').first().text(), url: $(this).find('a').first().attr('href')},
                            subareas:
                                $(this).find('a').map(function(i, elem) {
                                    if(i!==0){
                                        return {name: $(this).text(), url: $(this).attr('href'), 'exercises': exerciseData($(this).attr('href'))};
                                    }
                            }).get()
                        }
                    }).get()
                }
                let exerciseData = (url) => {
                    return 'todo';
                }
                return callback(muscleData);
            }
            else {
                console.warn(`Error message: ${error}`);
                return null;
            }
        });
    };
    let writeToJsonFile = (dataToWrite) => {
        fs.writeFile('data.json', JSON.stringify(dataToWrite), (err) => {
            if (err) throw err;
            console.log('Saved.');
        });
    };
    getData(function(data) {
        writeToJsonFile(data);
    });
}()
