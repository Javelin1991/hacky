const transactions = {
  1: [
    {
      "retailer": "Retailer1",
      "date": "2018-08-05",
      "amount": "450.00",
      "itemType": "TV"
    },
    {
      "retailer": "Retailer1",
      "date": "2018-09-05",
      "amount": "90.00",
      "itemType": "Interest"
    }
  ],
  2: [
    {
      "retailer": "Retailer1",
      "date": "2018-09-15",
      "amount": "50.00",
      "itemType": "shirts"
    },
    {
      "retailer": "Retailer1",
      "date": "2018-09-23",
      "amount": "101.23",
      "itemType": "clothes"
    },
    {
      "retailer": "Retailer1",
      "date": "2018-10-05",
      "amount": "532.95",
      "itemType": "clothes"
    },
    {
      "retailer": "Retailer2",
      "date": "2018-08-08",
      "amount": "800.00",
      "itemType": "tires"
    },
    {
      "retailer": "Retailer2",
      "date": "2018-09-08",
      "amount": "112.00",
      "itemType": "interest"
    },
    {
      "retailer": "Retailer2",
      "date": "2018-09-26",
      "amount": "200.00",
      "itemType": "payment"
    },
    {
      "retailer": "Retailer3",
      "date": "2018-09-30",
      "amount": "233.56",
      "itemType": "sweaters"
    },
    {
      "retailer": "Retailer3",
      "date": "2018-10-01",
      "amount": "54.12",
      "itemType": "sweaters"
    },
    {
      "retailer": "Retailer3",
      "date": "2018-10-09",
      "amount": "150.00",
      "itemType": "payment"
    },
    {
      "retailer": "Retailer4",
      "date": "2018-08-31",
      "amount": "85.62",
      "itemType": "shoes"
    },
    {
      "retailer": "Retailer4",
      "date": "2018-09-14",
      "amount": "85.62",
      "itemType": "payment"
    },
    {
      "retailer": "Retailer4",
      "date": "2018-10-03",
      "amount": "154.26",
      "itemType": "shoes"
    },
    {
      "retailer": "Retailer5",
      "date": "2018-08-25",
      "amount": "30.26",
      "itemType": "gasoline"
    },
    {
      "retailer": "Retailer5",
      "date": "2018-09-18",
      "amount": "28.65",
      "itemType": "gasoline"
    },
    {
      "retailer": "Retailer5",
      "date": "2018-10-02",
      "amount": "31.12",
      "itemType": "gasoline"
    }
  ],
  3: [
    {
      "retailer": "Retailer1",
      "date": "2018-09-23",
      "amount": "150.00",
      "itemType": "jeans"
    },
    {
      "retailer": "Retailer2",
      "date": "2018-09-30",
      "amount": "50.23",
      "itemType": "gasoline"
    },
    {
      "retailer": "Retailer2",
      "date": "2018-10-07",
      "amount": "55.68",
      "itemType": "gasoline"
    }
  ],
  4: [
    {
      "retailer": "Retailer1",
      "date": "2018-07-25",
      "amount": "50.23",
      "itemType": "shoes"
    },
    {
      "retailer": "Retailer1",
      "date": "2018-08-12",
      "amount": "50.23",
      "itemType": "payment"
    },
    {
      "retailer": "Retailer1",
      "date": "2018-08-14",
      "amount": "78.95",
      "itemType": "shoes"
    },
    {
      "retailer": "Retailer2",
      "date": "2018-08-19",
      "amount": "1925.66",
      "itemType": "couch"
    },
    {
      "retailer": "Retailer2",
      "date": "2018-09-10",
      "amount": "900.66",
      "itemType": "payment"
    }
  ],
  5: [
    {
      "retailer": "Retailer1",
      "date": "2018-07-08",
      "amount": "814.95",
      "itemType": "TV"
    },
    {
      "retailer": "Retailer1",
      "date": "2018-09-25",
      "amount": "65.23",
      "itemType": "headphones"
    },
    {
      "retailer": "Retailer1",
      "date": "2018-10-08",
      "amount": "100.00",
      "itemType": "payment"
    },
    {
      "retailer": "Retailer2",
      "date": "2018-07-08",
      "amount": "740.45",
      "itemType": "TV stand"
    },
    {
      "retailer": "Retailer2",
      "date": "2018-08-08",
      "amount": "86.15",
      "itemType": "interest"
    },
    {
      "retailer": "Retailer2",
      "date": "2018-08-09",
      "amount": "250.00",
      "itemType": "payment"
    },
    {
      "retailer": "Retailer3",
      "date": "2018-08-10",
      "amount": "1051.68",
      "itemType": "concert tickets"
    },
    {
      "retailer": "Retailer3",
      "date": "2018-09-10",
      "amount": "1051.68",
      "itemType": "payment"
    },
    {
      "retailer": "Retailer3",
      "date": "2018-10-01",
      "amount": "546.87",
      "itemType": "concert tickets"
    }
  ]
};

const creditProfiles = {
  "1": {
    "syfCreditScore": "600",
    "ficoScore": "600",
    "delinquentAccounts": "1",
    "bankruptAccounts": "0",
    "averageAccountAge": "3",
    "paymentHistory": "0.75"
  },
  "2": {
    "syfCreditScore": "790",
    "ficoScore": "776",
    "delinquentAccounts": "0",
    "bankruptAccounts": "0",
    "averageAccountAge": "7",
    "paymentHistory": "1"
  },
  "3": {
    "syfCreditScore": "690",
    "ficoScore": "675",
    "delinquentAccounts": "0",
    "bankruptAccounts": "0",
    "averageAccountAge": "4",
    "paymentHistory": "1"
  },
  "4": {
    "syfCreditScore": "700",
    "ficoScore": "680",
    "delinquentAccounts": "0",
    "bankruptAccounts": "0",
    "averageAccountAge": "5",
    "paymentHistory": "1"
  },
  "5": {
    "syfCreditScore": "720",
    "ficoScore": "700",
    "delinquentAccounts": "0",
    "bankruptAccounts": "0",
    "averageAccountAge": "7",
    "paymentHistory": "1"
  }
};

const profiles = {
  "1": {
    "totalSpend": "450",
    "averageYearlySpend": "450",
    "averageMonthlySpend": "450",
    "monthlyTransactionCount": "1",
    "yearlyTransactionCount": "1",
    "paymentHistory": "0",
    "numberOfAccounts": "1",
    "demographics": [
      {
        "countryCode": "US",
        "location": "NY",
        "region": "northeast"
      }
    ]
  },
  "2": {
    "totalSpend": "2102.77",
    "averageYearlySpend": "6000",
    "averageMonthlySpend": "500",
    "monthlyTransactionCount": "8",
    "yearlyTransactionCount": "150",
    "paymentHistory": "100",
    "numberOfAccounts": "5",
    "demographics": [
      {
        "countryCode": "US",
        "location": "CA",
        "region": "west"
      }
    ]
  },
  "3": {
    "totalSpend": "255.91",
    "averageYearlySpend": "255.91",
    "averageMonthlySpend": "50",
    "monthlyTransactionCount": "2",
    "yearlyTransactionCount": "3",
    "paymentHistory": "100",
    "numberOfAccounts": "2",
    "demographics": [
      {
        "countryCode": "US",
        "location": "KY",
        "region": "south"
      }
    ]
  },
  "4": {
    "totalSpend": "2054.84",
    "averageYearlySpend": "2054.84",
    "averageMonthlySpend": "100",
    "monthlyTransactionCount": "1",
    "yearlyTransactionCount": "5",
    "paymentHistory": "100",
    "numberOfAccounts": "2",
    "demographics": [
      {
        "countryCode": "US",
        "location": "NY",
        "region": "northeast"
      }
    ]
  },
  "5": {
    "totalSpend": "3229.18",
    "averageYearlySpend": "3229.18",
    "averageMonthlySpend": "1076",
    "monthlyTransactionCount": "5",
    "yearlyTransactionCount": "60",
    "paymentHistory": "100",
    "numberOfAccounts": "3",
    "demographics": [
      {
        "countryCode": "US",
        "location": "CO",
        "region": "west"
      }
    ]
  }
};

const interactions = {
  "1": {
    "totalCallVolume": "1",
    "totalChatVolume": "0",
    "totalInteractions": "1",
    "previousContactReason": "bill payment issue",
    "nextLikelyContactReason": "pay bill",
    "currentBalance": "540",
    "loginCount": "1",
    "paymentChannel": "mail",
    "autoPay": "false",
    "statementChannel": "paper"
  },
  "2": {
    "totalCallVolume": "3",
    "totalChatVolume": "5",
    "totalInteractions": "8",
    "previousContactReason": "statement questions",
    "nextContactReason": "statement questions",
    "currentBalance": "1779.15",
    "loginCount": "56",
    "paymentChannel": "online",
    "autoPay": "true",
    "statementChannel": "paperless"
  },
  "3": {
    "totalCallVolume": "0",
    "totalChatVolume": "2",
    "totalInteractions": "2",
    "previousContactReason": "bill payment issue",
    "nextContactReason": "pay bill",
    "currentBalance": "2000",
    "loginCount": "5",
    "paymentChannel": "online",
    "autoPay": "true",
    "statementChannel": "paper"
  },
  "4": {
    "totalCallVolume": "0",
    "totalChatVolume": "0",
    "totalInteractions": "0",
    "previousContactReason": "",
    "nextContactReason": "",
    "currentBalance": "1154",
    "loginCount": "10",
    "paymentChannel": "online",
    "autoPay": "false",
    "statementChannel": "paperless"
  },
  "5": {
    "totalCallVolume": "2",
    "totalChatVolume": "2",
    "totalInteractions": "4",
    "previousContactReason": "transaction inquiry",
    "nextContactReason": "pay bill",
    "currentBalance": "8200",
    "loginCount": "12",
    "paymentChannel": "online",
    "autoPay": "true",
    "statementChannel": "paperless"
  }
};

const purchaseStatistics = {
  "1": [
    {
      "retailer": "Retailer1",
      "purchaseLocation": "NY",
      "storeType": "physical",
      "cardType": "private label credit card",
      "productType": "rewards card",
      "availableSpend": "600",
      "nextLikelyPurchase": "",
      "customerValue": ".1"
    }
  ],
  "2": [
    {
      "retailer": "Retailer1",
      "purchaseLocation": "CA",
      "storeType": "physical",
      "cardType": "private label credit card",
      "productType": "rewards card",
      "availableSpend": "3500",
      "nextLikelyPurchase": "clothes",
      "customerValue": ".9"
    },
    {
      "retailer": "Retailer2",
      "purchaseLocation": "CA",
      "storeType": "physical",
      "cardType": "private label credit card",
      "productType": "rewards card",
      "availableSpend": "3000",
      "nextLikelyPurchase": "tires",
      "customerValue": ".9"
    },
    {
      "retailer": "Retailer3",
      "purchaseLocation": "CA",
      "storeType": "online",
      "cardType": "private label credit card",
      "productType": "store card",
      "availableSpend": "2000",
      "nextLikelyPurchase": "sweaters",
      "customerValue": ".9"
    },
    {
      "retailer": "Retailer4",
      "purchaseLocation": "CA",
      "storeType": "online",
      "cardType": "dual card",
      "productType": "rewards card",
      "availableSpend": "3500",
      "nextLikelyPurchase": "shoes",
      "customerValue": ".9"
    },
    {
      "retailer": "Retailer5",
      "purchaseLocation": "CA",
      "storeType": "physical",
      "cardType": "dual card",
      "productType": "store card",
      "availableSpend": "5000",
      "nextLikelyPurchase": "gasoline",
      "customerValue": ".9"
    }
  ],
  "3": [
    {
      "retailer": "Retailer1",
      "purchaseLocation": "KY",
      "storeType": "online",
      "cardType": "private label credit card",
      "productType": "store card",
      "availableSpend": "1000",
      "nextLikelyPurchase": "jeans",
      "customerValue": ".5"
    },
    {
      "retailer": "Retailer2",
      "purchaseLocation": "KY",
      "storeType": "physical",
      "cardType": "dual card",
      "productType": "rewards card",
      "availableSpend": "1500",
      "nextLikelyPurchase": "gasoline",
      "customerValue": ".5"
    }
  ],
  "4": [
    {
      "retailer": "Retailer1",
      "purchaseLocation": "NY",
      "storeType": "physical",
      "cardType": "dual card",
      "productType": "rewards card",
      "availableSpend": "1000",
      "nextLikelyPurchase": "shoes",
      "customerValue": ".7"
    },
    {
      "retailer": "Retailer2",
      "purchaseLocation": "CA",
      "storeType": "online",
      "cardType": "private label credit card",
      "productType": "store card",
      "availableSpend": "2000",
      "nextLikelyPurchase": "furniture",
      "customerValue": ".7"
    }
  ],
  "5": [
    {
      "retailer": "Retailer1",
      "purchaseLocation": "CO",
      "storeType": "physical",
      "cardType": "private label credit card",
      "productType": "store card",
      "availableSpend": "3000",
      "nextLikelyPurchase": "electronics",
      "customerValue": ".8"
    },
    {
      "retailer": "Retailer2",
      "purchaseLocation": "CO",
      "storeType": "physical",
      "cardType": "private label credit card",
      "productType": "store card",
      "availableSpend": "3500",
      "nextLikelyPurchase": "furniture",
      "customerValue": ".8"
    },
    {
      "retailer": "Retailer3",
      "purchaseLocation": "CO",
      "storeType": "physical",
      "cardType": "dual card",
      "productType": "rewards card",
      "availableSpend": "5000",
      "nextLikelyPurchase": "concert tickets",
      "customerValue": ".8"
    }
  ]
}

module.exports = {
  creditProfiles,
  profiles,
  transactions,
  purchaseStatistics,
};
