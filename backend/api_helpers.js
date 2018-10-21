const Visa = {
  key: "",
  secret: "",
};

const Synchrony = {
  key: "KtEEk12rwlyPMIVcgmj8tuG3TwdCdan8",
  secret: "DsZAPCIyHKkvKY1F",
  token: "4k3Q8sw4KPDOdao5mqpXq2WJwJVT",
};

const success = (data) => {
  return {
    data,
    status: {
      code: 200,
      message: "OK",
    },
  };
};

const fail = (data) => {
  return {
    data,
    status: {
      code: 500,
      message: "SERVER ERROR",
    },
  };
};

module.exports = {
  success,
  fail,
};

// curl -H 'Content-Type: application/x-www-form-urlencoded' -X POST 'https://api.syf.com/oauth2/v1/token' -d 'grant_type=client_credentials&client_id=KtEEk12rwlyPMIVcgmj8tuG3TwdCdan8&client_secret=DsZAPCIyHKkvKY1F'
