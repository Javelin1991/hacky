const Api = require("./api_helpers.js");
const Data = require("./data.js");
const express = require("express");
const needle = require('needle');
const request = require("request");
const bodyParser = require('body-parser');
const SLR = require("ml-regression-simple-linear");
const MLR = require("ml-regression-multivariate-linear");
var fs = require('fs');

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
  console.log(averageMonthlySpend, averageMonthlyIncome, averageYearlyIncome);
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
  console.log(multiplier);
  if (cust.totalBalance > multiplier * averageYearlyIncome) {
    multiplier = (multiplier * averageYearlyIncome) / cust.totalBalance;
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
  console.log("total goal", totalGoal);
  if (totalGoal === -1) {
    console.log("total goal lower than 0");
    return -1;
  }

  const remaining = totalGoal - cust.totalBalance;
  console.log("remaining", remaining);
  if (remaining < 0) {
    console.log("more balance than goal");
    return -1;
  }

  const remainingMonthly = (remaining * 1.0) / (getNextAgeLimit(cust.age) * 12);
  console.log("remaining monthly", remainingMonthly);
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
  // console.log(req.query);
  const { price, custId } = req.query;
  const itemPrice = parseInt(price);
  // const { currentMonthSpend, averageMonthlySpend } = getCustMonthlyStats(custId, 10);
  // const spendRatio = parseFloat(currentMonthSpend) / parseFloat(averageMonthlySpend);
  // const newMonthSpend = parseFloat(currentMonthSpend) + parseFloat(price);
  // const newSpendRatio = newMonthSpend / parseFloat(averageMonthlySpend);
  // const data = {
  //   withinBudget: newSpendRatio < 1.0,
  //   newSpendRatio: newSpendRatio,
  //   newMonthSpend: newMonthSpend,
  //   currentMonthSpend,
  //   averageMonthlySpend,
  // }
  // res.json(Api.success(data));
  const { pastMonthsSpend, currentMonthSpend, averageMonthlySpend, averageMonthlyIncome } = getCustMonthlyStats(custId, 10);
  // const x = [[112, 8], [85.62, 14], [50, 15], [28.65, 18], [101.23, 23], [200, 26], [233.56, 29]];
  // const y = [[112], [85.62 + 112], [85.62 + 112 + 50], [85.62 + 112 + 50 + 28.65], [85.62 + 112 + 50 + 28.65 + 101.23], [85.62 + 112 + 50 + 28.65 + 101.23 + 200], [85.62 + 112 + 50 + 28.65 + 101.23 + 200 + 233.56]];
  const x_days = [8,14,15,18,23,26,27];
  const y_spend = [2112,2197.62,2247.62,2276.27,2377.5,2577.5,2811.06];
  // y_spend.push(y_spend[y_spend.length-1] + price);
  // x_days.push(30);
  y_spend[y_spend.length-1] += itemPrice;
  // console.log(x);
  // console.log(y);
  const regression = new SLR(x_days, y_spend);
  const currentDayOfMonth = 31;
  const predictedSpend = Math.max(y_spend[y_spend.length-1], regression.predict([currentDayOfMonth]));
  // const averageMonthlySpend
  const goal = getCustGoal(custId);
  const savingGoal = goal > 0 ? goal : 0;
  const spendGoal = averageMonthlyIncome - savingGoal

  res.json(Api.success({predictedSpend, spendGoal}));
};

const makePaymentHandler = (req, res) => {
  const { price, payerId, payeeId } = req.body;
  const fullUrl = "https://sandbox.api.visa.com/visadirect/fundstransfer/v1/pullfundstransactions";
  const userId = "9QFEG2CLWNY5T90Z169C21orzAexMmQkseGk6HPileeSNP-Qo";
  const password = "QsKD00w576BqMMqdds3FyQF5700H0D98hFu";
  const keyFile = "./privateKey.pem";
  const certificateFile = "./cert.pem";
  const caFile = "./DigiCertGlobalRootCA.crt";
  // console.log(fs.readFileSync(keyFile).toString());
  const data = {
    "acquirerCountryCode": "840",
    "acquiringBin": "408999",
    "amount": price,
    "businessApplicationId": "AA",
    "cardAcceptor": {
      "address": {
        "country": "USA",
        "county": "081",
        "state": "CA",
        "zipCode": "94404"
      },
      "idCode": "ABCD1234ABCD123",
      "name": "Visa Inc. USA-Foster City",
      "terminalId": "ABCD1234"
    },
    "cavv": "0700100038238906000013405823891061668252",
    "foreignExchangeFeeTransaction": "11.99",
    "localTransactionDateTime": "2018-10-21T15:51:03",
    "retrievalReferenceNumber": "330000550000",
    "senderCardExpiryDate": "2015-10",
    "senderCurrencyCode": "USD",
    "senderPrimaryAccountNumber": "4895142232120006",
    "surcharge": "11.99",
    "systemsTraceAuditNumber": "451001",
    "nationalReimbursementFee": "11.22",
    "cpsAuthorizationCharacteristicsIndicator": "Y",
    "addressVerificationData": {
      "street": "XYZ St",
      "postalCode": "12345"
    }
  };
  request({
    method: "POST",
    uri: fullUrl,
    key: fs.readFileSync(keyFile),//.toString(),
    cert: fs.readFileSync(certificateFile),//.toString(),
    // ca: fs.readFileSync(caFile),//.toString(),
    headers: {
      'Content-Type' : 'application/json',
      'Accept' : 'application/json',
      'Authorization' : 'Basic ' + new Buffer(userId + ':' + password).toString('base64'),
    },
    body: data,
    json: true,
  }, (err, response, body) => {
    // if (!body) {
    //   return res.json(Api.success({}));
    // }
    return res.json(Api.success(body));
    // profiles[custId] = body;
    // if (Object.keys(profiles).length !== 5) {
    //   return getCustProfile(res, profiles, custId + 1);
    // } else {
    //   return res.json(Api.success(profiles));
    // }
  });
  // res.json(Api.success({}));
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
