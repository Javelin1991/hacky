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

const getCustTx = (res, txs, url) => {
  const fullUrl = `https://api-stg.syf.com/m2020${url}`;
  console.log(fullUrl);
  request({url: fullUrl, auth: {bearer: AUTH_TOKEN}, json: true}, (err, response, body) => {
    console.log(Object.keys(response));
    console.log(response.statusCode);
    console.log(body);
    if (!body) {
      return res.json(Api.success(txs));
    }
    const { retailer, date, amount, itemType, links } = body;
    txs.push({ retailer, date, amount, itemType });
    if (links && links[0] && links[0].href) {
      return getCustTx(res, txs, links[0].href);
    } else {
      return res.json(Api.success(txs));
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
      return res.json(Api.success(purchs));
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
      return res.json(Api.success(purchs));
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
      return res.json(Api.success(profiles));
    }
    // const { retailer, date, amount, itemType, links } = body;
    const { syfCreditScore, ficoScore, delinquentAccounts, bankruptAccounts, averageAccountAge, paymentHistory, } = body;
    // if (links && links[0] && links[0].href) {
    profiles[custId] = { syfCreditScore, ficoScore, delinquentAccounts, bankruptAccounts, averageAccountAge, paymentHistory };
    if (Object.keys(profiles).length !== 5) {
      return getCustProfile(res, profiles, custId + 1);
    } else {
      return res.json(Api.success(profiles));
    }
  });
}

const getCustProfile = (res, profiles, custId) => {
  const fullUrl = `https://api-stg.syf.com/m2020/customers/${custId}/profile`;
  console.log(fullUrl);
  request({url: fullUrl, auth: {bearer: AUTH_TOKEN}, json: true}, (err, response, body) => {
    if (!body) {
      return res.json(Api.success(profiles));
    }
    profiles[custId] = body;
    if (Object.keys(profiles).length !== 5) {
      return getCustProfile(res, profiles, custId + 1);
    } else {
      return res.json(Api.success(profiles));
    }
  });
}

const getCustInteractions = (res, profiles, custId) => {
  const fullUrl = `https://api-stg.syf.com/m2020/customers/${custId}/interactions`;
  console.log(fullUrl);
  request({url: fullUrl, auth: {bearer: AUTH_TOKEN}, json: true}, (err, response, body) => {
    if (!body) {
      return res.json(Api.success(profiles));
    }
    profiles[custId] = body;
    if (Object.keys(profiles).length !== 5) {
      return getCustInteractions(res, profiles, custId + 1);
    } else {
      return res.json(Api.success(profiles));
    }
  });
}

const getHistoryHandler = (req, res) => {
  // getCustTx(res, [], "/credit/customers/5/transactions");
  getCustPurchStats(res, {}, 1, 1);
  // getCustProfile(res, {}, 1);
  // getCustInteractions(res, {}, 1);
}

const getCustMonthlyStats = (i, currentMonth) => {
  const { transactions, profiles, incomes } = Data;
  const custTxs = transactions[i];
  const custProfile = profiles[i];
  const custIncome = incomes[i];
  const { totalSpend, averageYearlySpend, averageMonthlySpend } = custProfile;
  const cust = {
    pastMonthsSpend: {},
    pastMonthsIncome: {},
    currentMonthSpend: 0.0,
    currentMonthIncome: 0,
  };

  let total = 0.0;
  let monthsCounted = 0;
  custTxs.forEach((tx) => {
    const amount = parseFloat(tx.amount);
    const month = tx.date.split("-")[1];
    if (month == currentMonth) {
      cust.currentMonthSpend += amount;
      return;
    }
    if (!cust.pastMonthsSpend[month]) {
      cust.pastMonthsSpend[month] = 0.0;
    }
    total += amount;
    cust.pastMonthsSpend[month] += amount;
  });
  const realAverage = (total * 1.0) / Object.keys(cust.pastMonthsSpend).length;
  cust.averageMonthlySpend = parseFloat(averageMonthlySpend);
  cust.realAverageMonthlySpend = realAverage;

  total = 0.0;
  monthsCounted = 0.0;
  custIncome.forEach((inc) => {
    const amount = parseFloat(inc.amount);
    const month = inc.date.split("-")[1];
    if (month == currentMonth) {
      cust.currentMonthIncome += amount;
      return;
    }
    if (!cust.pastMonthsIncome[month]) {
      cust.pastMonthsIncome[month] = 0.0;
    }
    total += amount;
    cust.pastMonthsIncome[month] += amount;
  });
  const averageMonthlyIncome = (total * 1.0) / Object.keys(cust.pastMonthsIncome).length;
  cust.averageMonthlyIncome = averageMonthlyIncome;
  cust.averageYearlyIncome = averageMonthlyIncome * 12;

  return cust;
}

const getMonthlyStats = (currentMonth) => {
  const stats = {};
  for (let i = 1; i < 6; i++) {
    stats[i] = getCustMonthlyStats(i, currentMonth);
  }
  return stats;
}

const getMonthlyHandler = (req, res) => {
  const currentMonth = 10;
  res.json(Api.success(getMonthlyStats(currentMonth)));
}

const getNextAgeLimit = (age) => {
  const ages = [30, 40, 50, 60, 67];
  if (age < 30) {
    return 30;
  } else if (age > 67) {
    return 999;
  }
  for (let i = 0, j = 1; j < ages.length; i++, j++) {
    if (ages[i] <= age && age < ages[j]) {
      return ages[j];
    }
  }
  return 999;
}

const getMultiplier = (cust, monthlyStats) => {
  const { averageMonthlySpend, averageMonthlyIncome, averageYearlyIncome } = monthlyStats;
  const fidelity = {
    30: 1.0,
    40: 3.0,
    50: 6.0,
    60: 8.0,
    67: 10.0,
  }
  const nextAgeLimit = getNextAgeLimit(30);
  if (nextAgeLimit > 67) {
    return 0;
  }
  let multiplier = fidelity[nextAgeLimit];
  if (cust.totalBalance > multiplier * averageMonthlySpend) {
    multiplier = (multiplier * averageMonthlySpend) / cust.totalBalance;
  }
  console.log(multiplier);
  return multiplier;
}

const getCustGoal = (custId) => {
  const { personalProfiles, creditProfiles, savings } = Data;
  const cust = {
    ...personalProfiles[custId],
    ...creditProfiles[custId],
    ...savings[custId],
  };
  const currentMonth = 10;
  const monthlyStats = getCustMonthlyStats(custId, currentMonth);
  const { averageMonthlySpend, averageMonthlyIncome, averageYearlyIncome } = monthlyStats;

  const multiplier = getMultiplier(cust, monthlyStats);

  const totalGoal = multiplier > 0 ? averageYearlyIncome * multiplier : -1;
  if (totalGoal === -1) {
    return -1;
  }

  const remaining = totalGoal - cust.totalBalance;
  if (remaining < 0) {
    return -1;
  }

  const remainingMonthly = (remaining * 1.0) / (getNextAgeLimit(cust.age) * 12);

  return remainingMonthly;
  /*
  recommended by fidelity:
  By 30: Have the equivalent of your salary saved
  By 40: Have three times your salary saved
  By 50: Have six times your salary saved
  By 60: Have eight times your salary saved
  By 67: Have 10 times your salary saved
  */
  // const fidelityRecommendedGoal
}

const getGoalsHandler = (req, res) => {
  const result = {};
  for (let i = 1; i < 6; i++) {
    result[i] = getCustGoal(i);
  }
  res.json(Api.success(result));
}

const itemCheckHandler = (req, res) => {
  console.log(req.query);
  const { price, custId } = req.query;
  const { currentMonthSpend, averageMonthlySpend } = getCustMonthlyStats(custId, 10);
  const spendRatio = parseFloat(currentMonthSpend) / parseFloat(averageMonthlySpend);
  const newMonthSpend = parseFloat(currentMonthSpend) + parseFloat(price);
  const newSpendRatio = newMonthSpend / parseFloat(averageMonthlySpend);
  const data = {
    withinBudget: newSpendRatio < 1.0,
    newSpendRatio: newSpendRatio,
    newMonthSpend: newMonthSpend,
    currentMonthSpend,
    averageMonthlySpend,
  }
  res.json(Api.success(data));
};

const makePaymentHandler = (req, res) => {
  const { price, payerId, payeeId } = res.body;
  res.json(Api.success({}));
}

// routes
app.get('/', rootHandler);
app.get('/api/item/check', itemCheckHandler);
app.get('/api/train', getHistoryHandler);
app.get('/api/monthly', getMonthlyHandler);
app.get('/api/goals', getGoalsHandler);
app.post('/api/pay', makePaymentHandler);

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

income
tx history
recommended
*/
