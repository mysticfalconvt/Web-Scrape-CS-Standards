const axios = require("axios");
const cheerio = require("cheerio")
const url = 'https://k12cs.org/framework-statements-by-grade-band/'
const fs = require('fs')

// save to JSON file
const storeData = (data, path) => {
    try {
        fs.writeFileSync(path, JSON.stringify(data, null, 4))
    } catch (err) {
        console.error(err)
    }
}

// get data from website
const fetchData = async () => {
    const result = await axios.get(url);
    // console.log(result)
    return cheerio.load(result.data);
};

//get the practices from the accordions on teh website
const getPracticeStatements = (data) => {
    const arrayOfPracticeStatements = data('.accordions').toArray()
    const practiceStatements = arrayOfPracticeStatements.map((singlePracticeStatement, i) => {
        const data = cheerio.load(singlePracticeStatement)
        const statement = data('.accordions-head-title').text()
        const progression = data('.accordion-content').children().text()
        return ({
            practiceStatementNumber: i + 1,
            practiceStatement: statement,
            progression: progression
        })
    })
    return practiceStatements
}

// main app
const app = async () => {
    const siteData = await fetchData()
    const practices = cheerio.load(siteData('#practices').html())
    const array = practices('.wpsm_panel').toArray()
    //loop over each of the *7* practices
    const allData = array.map((singlePractice, i) => {
        const practiceData = cheerio.load(singlePractice)
        const title = practiceData('.wpsm_panel-title').text()
        const overview = practiceData('.wpsm_panel-body:first').children().first().text().substring(1)
        const practiceStatements = getPracticeStatements(practiceData)
        return {
            practiceNumber: i + 1,
            corePractice: title.substring(8),
            overview: overview.split('\n\n\n')[0],
            practiceStatements: practiceStatements,
        }
    })


    storeData(allData, "data.json")
}

app();