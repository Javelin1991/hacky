const Visa = {
  key: "",
  secret: "",
}

const Synchrony = {
  key: "0pDRXIDFhxaht9qTDQrs4S6V90h2K95Q",
  secret: "FSlVnpJu6p695uyf",
}

const success = (data) => {
  return {
    data,
    status: {
      code: 200,
      message: "OK",
    },
  };
}

const Api = {
  success
}

module.exports = Api
