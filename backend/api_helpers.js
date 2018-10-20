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
