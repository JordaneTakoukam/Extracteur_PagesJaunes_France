const puppeteer = require("puppeteer");
const fs = require('fs');
const path = require('path');

let browser;

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function scraperPageJaune(dataList) {

    // date d'execution .
    const now = new Date();

    try {
        // contiendra les msg d'erreur
        var errorMessage = "";

        // Lien de la page
        const linkPage = "https://www.pagesjaunes.fr/";
        // const linkPage = "https://www.pagesjaunes.fr/annuaire/centre-commercial-beaugrenelle-paris-75/boulangerie";
        // Listes des status de la déjà vérifier
        const results = [];

        browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.setViewport({ width: 1200, height: 800 });


        // Naviguer vers la page ...
        try {
            await page.goto(linkPage);
            await page.waitForTimeout(2500);
        } catch (errorNavigation) {

            await browser.close();
            errorMessage = "La page " + linkPage + " n'as pas réuissi à être charger !";
            console.error(errorMessage);
            return [];
        }

        try {

            // Attendre que la boîte de dialogue apparaisse
            await page.waitForSelector('#didomi-notice-agree-button', { visible: true });

            // Cliquer sur le bouton Accepter
            const acceptButton = await page.$('#didomi-notice-agree-button');
            await acceptButton.click();
            await page.waitForTimeout(randomInt(100, 300));

        }
        catch (e) {
            errorMessage = "La boite de dialogue n'as pas reuissi à être fermer!";
            console.error(errorMessage);
        }

        for (const [index, valueList] of dataList.entries()) {
            var quantiteMax = Number(valueList.quantite);

            await page.type("#quoiqui", valueList.besoin, { delay: randomInt(200, 400) });
            await page.waitForTimeout(randomInt(80, 150));
            await page.type("#ou", valueList.destination, { delay: randomInt(300, 500) });

            await Promise.all([await page.waitForTimeout(300), page.click('div.actions')]);
            await page.waitForTimeout(randomInt(2000, 3000));


            await page.waitForSelector('.bi-list', { visible: true });
            const elements = await page.$$eval('li[id^="epj-"]', liElements => {
                return liElements.map(li => {
                    const entreprise = li.querySelector('.bi-denomination h3')?.textContent.trim() || null;
                    const activiter = li.querySelector('.bi-activity')?.textContent.trim() || null;
                    const horaires = li.querySelector('.bi-hours')?.textContent.trim() || null;
                    const adresse = li.querySelector('.bi-address')?.textContent.trim() || null;
                    const contact = li.querySelector('.number-contact')?.textContent.trim() || null;
                    return { entreprise, activiter, horaires, adresse, contact };
                }).slice(0, quantiteMax);
            });
            console.log(elements);




            // if (index != numbers.length - 1) {
            //     await page.click('div.pj_search_qui_quoi div.input-container div.pjinputerase i.icon-fermer');
            //     await page.waitForTimeout(randomInt(200, 300));
            //     await page.click('div.pj_search_ou div.input-container div.pjinputerase i.icon-fermer');
            //     await page.waitForTimeout(randomInt(500, 1000));
            // }
        }


        // // const elements = await page.$$eval('.bi-link-mobile', elements => {
        // //     // récupère les données de chaque élément
        // //     return elements.map(element => {
        // //       const data = {ialermr
        // //         entreprise: element.querySelector('h3').textContent,
        // //         link: element.querySelector('a').href,
        // //         description: element.querySelector('p').textContent
        // //       };
        // //       return data;
        // //     });
        // //   });
        // // Créer un tableau pour stocker les données extraites
        // // Récupère tous les éléments de la liste ul.bi-list
        // const elements = await page.$$('ul.bi-list li');

        // // Récupère les 50 pdremiers éléments de la liste
        // const first50Elements = elements.slice(0, 50);

        // // Fait quelque chose avec les éléments récupérés
        // console.log(first50Elements);


        // await Promise.all([
        //     await page.waitForTimeout(300),
        //     page.click('#submit'),ogjfo
        // ]);
        // for (const [index, number] of numbers.entries()) {
        //     try {
        //         // date a laquel chaque numero est verifier
        //         const time = new Date();

        // await page.type("#search", number, { delay: 150 });

        // await Promise.all([
        //     await page.waitForTimeout(300),
        //     page.click('#submit'),
        // ]);

        //         await page.waitForSelector("#progress-bar-inner-text");
        //         await page.waitForTimeout(1500);

        //         const result = await page.evaluate(() => {
        //             const dataResult = document.querySelector("#progress-bar-inner-text").textContent;
        //             return parseInt(dataResult, 10);
        //         });
        //         results.push({ number, result, time });
        //         console.log(number + ' : ' + result + "/100");

        //         // si on est pas au dernier numero de la liste
        //         // ceci pour éviter qui ne revienne en arriere, puis effacer l'input avant de quitter
        //         // Il devra plutot sortir directement une fois le dernier numéro vérifier!
        // if (index != numbers.length - 1) {
        //             await page.goBack();

        //             // on efface l'input 
        //             const searchInput = await page.$("#search");
        //             await searchInput.click({ clickCount: 3 });
        //             await searchInput.press("Backspace");

        //             await page.waitForTimeout(200);
        //         }
        //     } catch (error) {
        //         await browser.close();
        //         errorMessage = "==== Une erreur est survenue ====";
        //         console.error(errorMessage);
        //         if (results.length > 0) {
        //             return results;
        //         }
        //         else {
        //             return [];
        //         }
        //     };
        // }

        await browser.close();

        // const dbPath = path.join(__dirname, './../db/db_results_check.json');
        // const db = fs.existsSync(dbPath) ? JSON.parse(fs.readFileSync(dbPath)) : [];
        // const updatedDb = [...db, { date: now, results }];
        // fs.writeFileSync(dbPath, JSON.stringify(updatedDb, null, 2));

        // return { date: now, results };
    }
    catch (error) {
        await browser.close();
        errorMessage = "==== Une erreur est survenue ====";
        console.error(errorMessage);
        return [];
    }
}


module.exports = { scraperPageJaune };


//test
// const numbers = ["123456789", "0422616668"];

// scrapeNumbers(numbers)
//     .then(results => console.log("Résultat : " + results.result));