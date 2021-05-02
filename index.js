const axios = require("axios");
const cheerio = require("cheerio")
const url = 'https://k12cs.org/framework-statements-by-grade-band/'
const fs = require('fs')

const storeData = (data, path) => {
    try {
        fs.writeFileSync(path, JSON.stringify(data))
    } catch (err) {
        console.error(err)
    }
}
const fetchData = async () => {
    const result = await axios.get(url);
    // console.log(result)
    return cheerio.load(result.data);
};

const getPracticeStatements = (data) => {
    const arrayOfPracticeStatements = data('.accordions').toArray()
    const practiceStatements = arrayOfPracticeStatements.map((singlePracticeStatement, i) => {
        const data = cheerio.load(singlePracticeStatement)
        return ({
            practiceStatementNumber: i + 1,
            practiceStatement: "asdfasf"
        })
    })
    // console.log(practiceData)
    return practiceStatements
}

const app = async () => {
    const $ = await fetchData()
    const practices = cheerio.load($('#practices').html())
    const titles = practices('.wpsm_panel-title').text()
    // console.log(titles)

    const array = practices('.wpsm_panel').toArray()
    const test = array.map((singlePractice, i) => {
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


    // console.log(test)
    storeData(test, "data.json")
}

app();