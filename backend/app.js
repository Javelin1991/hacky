const Api = require("./api_helpers.js");
const Data = require("./data.js");
const express = require("express");
const needle = require('needle');
const request = require("request");
const bodyParser = require('body-parser');

// setup
const app = express();
const port = 3000;
const AUTH_TOKEN = "BZMBgRSnEhinidAGp8ioSB1iizNo";
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// route handlers
const rootHandler = (req, res) => {
  console.log(req);
  const data = {
    message: "hello world",
  };
  res.json(Api.success(Data));
};

const itemCheckHandler = (req, res) => {
  const { price } = req.body;
  const data = {
    withinBudget: true,
  }
  res.send(Api.success(data));
};

const getCustTx = (res, txs, url) => {
  const fullUrl = `https://api-stg.syf.com/m2020${url}`;
  console.log(fullUrl);
  request({url: fullUrl, auth: {bearer: AUTH_TOKEN}, json: true}, (err, response, body) => {
    console.log(Object.keys(response));
    console.log(response.statusCode);
    console.log(body);
    if (!body) {
      return res.send(Api.success(txs));
    }
    const { retailer, date, amount, itemType, links } = body;
    txs.push({ retailer, date, amount, itemType });
    if (links && links[0] && links[0].href) {
      return getCustTx(res, txs, links[0].href);
    } else {
      return res.send(Api.success(txs));
    }
  });
};

const getCustPurchStats = (res, purchs, custId, count) => {
  const fullUrl = `https://api-stg.syf.com/m2020/credit/customers/${custId}/purchaseStatistics${count > 1 ? "/" : ""}${count > 1 ? count : ""}`;
  console.log(fullUrl);
  request({url: fullUrl, auth: {bearer: AUTH_TOKEN}, json: true}, (err, response, body) => {
    console.log(Object.keys(response));
    console.log(response.statusCode);
    console.log(body);
    if (!body) {
      return res.send(Api.success(purchs));
    }

    const { retailer, purchaseLocation, storeType, cardType, productType, availableSpend, nextLikelyPurchase, customerValue, links } = body;
    if (!purchs[custId]) {
      purchs[custId] = [];
    }

    purchs[custId].push({ retailer, purchaseLocation, storeType, cardType, productType, availableSpend, nextLikelyPurchase, customerValue });

    if (links && links[0] && links[0].href) {
      return getCustPurchStats(res, purchs, custId, count + 1);

    } else if (Object.keys(purchs).length !== 5) {
      return getCustPurchStats(res, purchs, custId + 1, 1);

    } else {
      return res.send(Api.success(purchs));
    }
  });
}

const getCustCreditProfile = (res, profiles, custId) => {
  const fullUrl = `https://api-stg.syf.com/m2020/credit/customers/${custId}/profile`;
  console.log(fullUrl);
  request({url: fullUrl, auth: {bearer: AUTH_TOKEN}, json: true}, (err, response, body) => {
    // console.log(Object.keys(response));
    // console.log(response.statusCode);
    // console.log(body);
    if (!body) {
      return res.send(Api.success(profiles));
    }
    // const { retailer, date, amount, itemType, links } = body;
    const { syfCreditScore, ficoScore, delinquentAccounts, bankruptAccounts, averageAccountAge, paymentHistory, } = body;
    // if (links && links[0] && links[0].href) {
    profiles[custId] = { syfCreditScore, ficoScore, delinquentAccounts, bankruptAccounts, averageAccountAge, paymentHistory };
    if (Object.keys(profiles).length !== 5) {
      return getCustProfile(res, profiles, custId + 1);
    } else {
      return res.send(Api.success(profiles));
    }
  });
}

const getCustProfile = (res, profiles, custId) => {
  const fullUrl = `https://api-stg.syf.com/m2020/customers/${custId}/profile`;
  console.log(fullUrl);
  request({url: fullUrl, auth: {bearer: AUTH_TOKEN}, json: true}, (err, response, body) => {
    if (!body) {
      return res.send(Api.success(profiles));
    }
    profiles[custId] = body;
    if (Object.keys(profiles).length !== 5) {
      return getCustProfile(res, profiles, custId + 1);
    } else {
      return res.send(Api.success(profiles));
    }
  });
}

const getCustInteractions = (res, profiles, custId) => {
  const fullUrl = `https://api-stg.syf.com/m2020/customers/${custId}/interactions`;
  console.log(fullUrl);
  request({url: fullUrl, auth: {bearer: AUTH_TOKEN}, json: true}, (err, response, body) => {
    if (!body) {
      return res.send(Api.success(profiles));
    }
    profiles[custId] = body;
    if (Object.keys(profiles).length !== 5) {
      return getCustInteractions(res, profiles, custId + 1);
    } else {
      return res.send(Api.success(profiles));
    }
  });
}

const getHistoryHandler = (req, res) => {
  // getCustTx(res, [], "/credit/customers/5/transactions");
  getCustPurchStats(res, {}, 1, 1);
  // getCustProfile(res, {}, 1);
  // getCustInteractions(res, {}, 1);
}

const getMonthlyStats = (currentMonth) => {
  const { transactions, profiles } = Data;
  const stats = {};
  for (let i = 1; i < 6; i++) {
    const cust = {
      pastMonths: {},
      currentMonthSpend: 0.0,
    };
    const custTxs = transactions[i];
    let total = 0.0;
    let monthsCounted = 0;
    custTxs.forEach((tx) => {
      const amount = parseFloat(tx.amount)
      const month = tx.date.split("-")[1];
      if (month == currentMonth) {
        cust.currentMonthSpend += amount;
        return;
      }
      if (!cust.pastMonths[month]) {
        cust.pastMonths[month] = 0.0;
      }
      total += amount;
      cust.pastMonths[month] += amount;
    });
    const realAverage = (total * 1.0) / Object.keys(cust.pastMonths).length;
    cust.averageMonthlySpend = parseFloat(profiles[i].averageMonthlySpend);
    cust.realAverageMonthlySpend = realAverage;
    stats[i] = cust;
  }
  return stats;
}

const getMonthlyHandler = (req, res) => {
  const currentMonth = 10;
  res.json(Api.success(getMonthlyStats(currentMonth)));
}

// routes
app.get('/', rootHandler);
app.post('/item/check', itemCheckHandler);
app.post('/train', getHistoryHandler);
app.post('/monthly', getMonthlyHandler);

// start script
app.listen(port, () => console.log(`Example app listening on port ${port}!`));


/*
{
    "data": [
        "_readableState",
        "readable",
        "_events",
        "_eventsCount",
        "_maxListeners",
        "socket",
        "connection",
        "httpVersionMajor",
        "httpVersionMinor",
        "httpVersion",
        "complete",
        "headers",
        "rawHeaders",
        "trailers",
        "rawTrailers",
        "aborted",
        "upgrade",
        "url",
        "method",
        "statusCode",
        "statusMessage",
        "client",
        "_consuming",
        "_dumped",
        "next",
        "baseUrl",
        "originalUrl",
        "_parsedUrl",
        "params",
        "query",
        "res",
        "route"
    ],
    "status": {
        "code": 200,
        "message": "OK"
    }
}
*/
