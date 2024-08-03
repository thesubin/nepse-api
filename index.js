const moment = require("moment");
const fs = require("fs");
const {
  scrapeCompaniesData,
  scrapeMarketData,
  fetchData,
  groupMarketDataByCompany,
  generateSummary,
  stockHunt,
  stockHuntMeanDivergence,
} = require("./scrapper_v2");
const { lastMarketDay } = require("./helpers");

// FIX: 'UNABLE_TO_VERIFY_LEAF_SIGNATURE' issue with API call
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

async function runScript() {
  try {
    //  fetch last 7 market-days data

    // generateSummary();

    const date = new moment();

    for (let i = 0; i <= 95; i++) {
      try {
        let dateStr = lastMarketDay(
          date.subtract(1, "days").format("YYYY-MM-DD")
        );

        if (fs.existsSync(`./data/date/${dateStr}.json`)) continue;

        const data = await fetchData(dateStr);
        scrapeCompaniesData(data);
        scrapeMarketData(data, dateStr);
        groupMarketDataByCompany(data, dateStr);
        console.log("scraped data for", dateStr);
      } catch (e) {
        console.log(e);
        continue;
      }
    }

    const newdate = new moment();

    for (let i = 0; i <= 360; i++) {
      try {
        let dateStr = lastMarketDay(
          newdate.subtract(1, "days").format("YYYY-MM-DD")
        );

        if (fs.existsSync(`./mean/date/${dateStr}.json`)) continue;

        const data = await fetchData(dateStr);
        scrapeCompaniesData(data, "mean");
        scrapeMarketData(data, dateStr, "mean");
        groupMarketDataByCompany(data, dateStr, "mean");
        console.log("scraped data for", dateStr, "mean");
      } catch (e) {
        console.log(e);
        continue;
      }
    }
    try {
      generateSummary();
      stockHunt();
      stockHuntMeanDivergence();
    } catch (e) {
      console.log("ERROR", e);
    }
    // update info.json
    fs.writeFileSync(
      "./data/info.json",
      JSON.stringify({
        name: "Nepse API",
        source: "https://nepalstock.com/",
        lastUpdatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
      })
    );
    console.log("SUCCESS");
  } catch (e) {
    console.log(e);
    console.log("FAIL");
  }
}

runScript();
