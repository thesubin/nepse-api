const axios = require("axios");
const fs = require("fs");
const csvtojson = require("csvtojson/v2");
const { findClosestDate, formatDate } = require("./helper");
const moment = require("moment");

const transformCsvRow = (row) => {
  return {
    company: {
      code: row.SYMBOL,
      name: row.SECURITY_NAME,
    },
    price: {
      open: parseFloat(row.OPEN_PRICE),
      max: parseFloat(row.HIGH_PRICE),
      min: parseFloat(row.LOW_PRICE),
      close: parseFloat(row.CLOSE_PRICE),
      prevClose: parseFloat(row.PREVIOUS_DAY_CLOSE_PRICE),
      diff: parseFloat(row.CLOSE_PRICE - row.PREVIOUS_DAY_CLOSE_PRICE),
    },
    numTrans: parseFloat(row.TOTAL_TRADES),
    tradedShares: parseFloat(row.TOTAL_TRADED_QUANTITY),
    amount: parseFloat(row.TOTAL_TRADED_VALUE),
  };
};

const fetchData = async (date) => {
  return new Promise((resolve, reject) => {
    if (!date) reject();
    // simulate browser API call
    axios({
      method: "GET",
      url: `https://www.nepalstock.com.np/api/nots/market/export/todays-price/${date}`,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36",
      },
    })
      .then(function (resp) {
        csvtojson({ output: "json" })
          .fromString(resp.data)
          .then((json) => resolve(json));
      })
      .catch((e) => reject(e));
  });
};

const scrapeCompaniesData = (data, route = "data") => {
  let obj = {};
  data.forEach((d) => {
    obj[d.SYMBOL] = {
      id: d.SECURITY_ID,
      name: d.SECURITY_NAME,
    };
  });
  fs.writeFileSync(`./${route}/companies.json`, JSON.stringify(obj));
};

const scrapeMarketData = (csvRows, date, route = "data") => {
  let meta = {
    totalAmt: 0,
    totalQty: 0,
    totalTrans: 0,
  };

  let stocksData = csvRows.map((row) => {
    meta.totalAmt += parseFloat(row.TOTAL_TRADED_VALUE);
    meta.totalQty += parseFloat(row.TOTAL_TRADED_QUANTITY);
    meta.totalTrans += parseFloat(row.TOTAL_TRADES);
    return transformCsvRow(row);
  });

  const merged = JSON.stringify({ metadata: meta, data: stocksData });

  fs.writeFileSync(`./${route}/date/${date}.json`, merged);
  fs.writeFileSync(`./${route}/date/today.json`, merged);
  fs.writeFileSync(`./${route}/date/latest.json`, merged);
};

const groupMarketDataByCompany = (csvRow, date, route = "data") => {
  for (let row of csvRow) {
    let stockData = transformCsvRow(row);

    if (stockData && stockData.company && stockData.company.code) {
      let existingData = {};
      if (fs.existsSync(`./${route}/company/${stockData.company.code}.json`)) {
        try {
          existingData = JSON.parse(
            fs.readFileSync(
              `./${route}/company/${stockData.company.code}.json`
            ) || "{}"
          );
        } catch (e) {
          console.log(e);
          existingData = {};
        }
      }
      let companyCode = stockData.company.code;
      delete stockData.company;
      existingData[date] = stockData;

      fs.writeFileSync(
        `./${route}/company/${companyCode.replace(/\//g, "\u2215")}.json`,
        JSON.stringify(existingData)
      );
    }
  }
};

const generateSummary = (csvRow) => {
  let companySummary = [];
  let existingCompanies = {};
  if (fs.existsSync(`./data/companies.json`)) {
    try {
      existingCompanies = JSON.parse(
        fs.readFileSync(`./data/companies.json`) || "{}"
      );
    } catch (e) {
      console.log(e);
      existingCompanies = {};
    }
  }
  for (let key in existingCompanies) {
    if (existingCompanies.hasOwnProperty(key)) {
      let existingData = {};
      if (fs.existsSync(`./data/company/${key}.json`)) {
        try {
          existingData = JSON.parse(
            fs.readFileSync(`./data/company/${key}.json`) || "{}"
          );
        } catch (e) {
          console.log(e);
          existingData = {};
        }
      }
      let sorted_low_data = Object.keys(existingData).sort(
        (a, b) => existingData[a]?.price?.close - existingData[b]?.price?.close
      );
      const today = new Date();
      const todayFormatted = formatDate(today);

      const closestDate = findClosestDate(todayFormatted, existingData);
      const closePrice = closestDate
        ? existingData[closestDate].price.close
        : null;

      companySummary.push({
        companyCode: key,
        companyName: existingCompanies?.[key].name,
        high: existingData[sorted_low_data.pop()]?.price?.close,
        low: existingData[sorted_low_data?.[0]]?.price?.close,
        highDate: sorted_low_data?.pop(),
        lowDate: sorted_low_data?.[0],
        ltp: closePrice,
      });

      // Do something with the property value
    }
  }
  fs.writeFileSync(
    "./data/companies_summary.json",
    JSON.stringify(companySummary)
  );
};
function calculateMovingAverage(data, period) {
  let sum = 0;

  for (let i = 0; i < period; i++) {
    sum = sum + data?.[i];
  }

  return sum / period || 0;
}
const stockHunt = () => {
  let existingCompanies = {};
  let stockHunt = [];
  if (fs.existsSync(`./data/companies.json`)) {
    try {
      existingCompanies = JSON.parse(
        fs.readFileSync(`./data/companies.json`) || "{}"
      );
    } catch (e) {
      console.log(e);
      existingCompanies = {};
    }
  }

  for (let key in existingCompanies) {
    if (existingCompanies.hasOwnProperty(key)) {
      let existingData = {};
      if (fs.existsSync(`./data/company/${key}.json`)) {
        try {
          existingData = JSON.parse(
            fs.readFileSync(`./data/company/${key}.json`) || "{}"
          );
        } catch (e) {
          console.log(e);
          existingData = {};
        }
        const sortedDate = Object.entries(existingData)
          .sort((a, b) => new Date(b[0]) - new Date(a[0]))
          .filter((val, index) => index < 90);
        const closingPrices = sortedDate.map(([key, day]) => day.price.close);

        // Calculate the 5-day moving average
        const fiveDayMovingAverage = calculateMovingAverage(closingPrices, 5);

        // Calculate the 20-day moving average
        const twentyDayMovingAverage = calculateMovingAverage(
          closingPrices,
          20
        );

        // Get the last high and last low

        const lastLow = Math.min(
          ...sortedDate.map(([key, day]) => day.price.min)
        );
        const indexLimit = sortedDate
          ?.map(([key, day]) => day.price.min)
          ?.indexOf(lastLow);

        const lastHigh = Math.max(
          ...sortedDate
            .filter((val, index) => index > indexLimit)
            .map(([key, day]) => day.price.max)
        );

        const firstHigh = Math.max(
          ...sortedDate
            ?.filter((val, index) => index < indexLimit)
            ?.map(([key, day]) => day.price.max)
        );

        // Check the condition
        const condition =
          fiveDayMovingAverage > twentyDayMovingAverage &&
          sortedDate?.[0]?.[1]?.price?.close >
            (lastHigh - lastLow) * 0.382 + lastLow &&
          sortedDate?.[0]?.[1]?.price?.close <
            (lastHigh - lastLow) * 0.5 + lastLow;

        const retrace =
          fiveDayMovingAverage > twentyDayMovingAverage &&
          sortedDate?.[0]?.[1]?.price?.close >
            firstHigh - (firstHigh - lastLow) * 0.5;

        stockHunt = stockHunt.concat({
          stock: key,
          condition,
          retrace,
          "5_sma": fiveDayMovingAverage,
          "20_SMA": twentyDayMovingAverage,
          lastHigh,
          lastLow,
          indexLimit,
          "0.5_LEVEL": firstHigh - (firstHigh - lastLow) * 0.5,
          ltp: sortedDate?.[0]?.[1]?.price?.close,
          date: sortedDate?.[sortedDate?.length - 1]?.[0],
        });
        // Function to calculate the moving average
      }
    }
  }
  fs.writeFileSync(
    `./data/stock_report_${moment().format("YY-MM-DD")}.json`,
    JSON.stringify(stockHunt)
  );
  const true_companies = stockHunt?.filter(
    (val) => val?.condition || val?.retrace
  );
  fs.writeFileSync(
    `./data/stock_hunt_${moment().format("YY-MM-DD")}.json`,
    JSON.stringify(true_companies)
  );
};

const stockHuntMeanDivergence = () => {
  let existingCompanies = {};
  let stockHunt = [];
  if (fs.existsSync(`./mean/companies.json`)) {
    try {
      existingCompanies = JSON.parse(
        fs.readFileSync(`./mean/companies.json`) || "{}"
      );
    } catch (e) {
      console.log(e);
      existingCompanies = {};
    }
  }

  for (let key in existingCompanies) {
    if (existingCompanies.hasOwnProperty(key)) {
      let existingData = {};
      if (fs.existsSync(`./mean/company/${key}.json`)) {
        try {
          existingData = JSON.parse(
            fs.readFileSync(`./mean/company/${key}.json`) || "{}"
          );
        } catch (e) {
          console.log(e);
          existingData = {};
        }
        const sortedDate = Object.entries(existingData).sort(
          (a, b) => new Date(b[0]) - new Date(a[0])
        );
        const closingPrices = sortedDate.map(([key, day]) => day.price.close);

        // Calculate the 20-day moving average
        const yearDayMovingAverage = calculateMovingAverage(closingPrices, 200);

        // Get the last high and last low

        // Check the condition

        const awayFromMean =
          ((yearDayMovingAverage - sortedDate?.[0]?.[1]?.price?.close) /
            sortedDate?.[0]?.[1]?.price?.close) *
          100;

        stockHunt = stockHunt.concat({
          stock: key,
          ltp: sortedDate?.[0]?.[1]?.price?.close,
          date: sortedDate?.[0]?.[0],
          awayFromMean,
          yearDayMovingAverage,
        });
        // Function to calculate the moving average
      }
    }
  }
  fs.writeFileSync(
    `./mean/stock_report_${moment().format("YY-MM-DD")}.json`,
    JSON.stringify(stockHunt)
  );
};
module.exports = {
  fetchData,
  scrapeCompaniesData,
  scrapeMarketData,
  groupMarketDataByCompany,
  generateSummary,
  stockHunt,
  stockHuntMeanDivergence,
};
