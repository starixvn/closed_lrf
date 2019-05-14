const defaultProps = {
    selectedBaseCurrency: "EUR",
    dateRange: { fromDate: '09/26/2017', toDate: '09/28/2017' },
    includeDrawData: true,
    isExcludeTest: true,

    setSelectedProduct: jest.fn(),
    setSelectedSubsidiary: jest.fn(),
    setDateRange: jest.fn(),
    toggleLoader: jest.fn(),
    changeConvertAll: jest.fn(),
    setParams: jest.fn(),
    changeIncludeDrawData: jest.fn(),
    changeIsExcludeTest: jest.fn()
}

const defaultAppData = {
    productOptions: [{ Code: "SB", Name: "Sportsbook", Status: true }, { Code: "BA", Name: "BA", Status: true }],
    baseCurrencyList: [{ "value": "EUR", "label": "EUR" }, { "value": "USD", "label": "USD" }],
    subsidiaryList: [{ ID: 1, Name: "New York", Checked: true }, { ID: 2, Name: "India", Checked: false }],
    dateConstraint: { minDate: '06/01/2012', maxDate: '09/28/2017' }
}

const bodyData = [{
    "Subsidiary": "SUB1",
    "TotalItem": 4,
    "Details": {
        "EUR": [{
            "Product": "All",
            "BetCount": 52,
            "Turnover": 322.0000,
            "CustomerWinLoss": 142.3210,
            "SubsidiaryWinLoss": -141.7636
        }, {
            "Product": "Product 1",
            "BetCount": 4,
            "Turnover": 0.0000,
            "CustomerWinLoss": 0.0000,
            "SubsidiaryWinLoss": 0.5574
        }],
        "USD": [{
            "Product": "All",
            "BetCount": 1,
            "Turnover": -111.0000,
            "CustomerWinLoss": 45.258,
            "SubsidiaryWinLoss": -785.2569
        }, {
            "Product": "Product 2",
            "BetCount": 2,
            "Turnover": 0.0000,
            "CustomerWinLoss": 0.0000,
            "SubsidiaryWinLoss": 0.2478
        }]
    }
}];

const totalData = {
    "SUB1": {
        "BetCount": 3,
        "CurrencyName": "EUR",
        "CustomerWinLoss": 224.7238,
        "Product": null,
        "SubsidiaryWinLoss": -224.7238,
        "Turnover": 276.469,
    }
}

const grandTotalData = {
    "CurrencyName": "EUR",
    "Product": null,
    "BetCount": 13286376,
    "Turnover": 405367913.09429135,
    "CustomerWinLoss": -14046804.028517062,
    "SubsidiaryWinLoss": 14046469.750504408
}

const bodyDetailData = [{
    "CurrencyName": "USD",
    "ExternalId": "Ex1",
    "SystemId": "Sys1",
    "BetCount": 52,
    "Turnover": 322.0000,
    "CustomerWinLoss": 142.3210,
    "SubsidiaryWinLoss": -141.7636
}, {
    "CurrencyName": "EUR",
    "ExternalId": "Ex2",
    "SystemId": "Sys2",
    "BetCount": 4,
    "Turnover": 0.0000,
    "CustomerWinLoss": 0.0000,
    "SubsidiaryWinLoss": 0.5574
}];

const totalDetailData = {
    "USD": {
        "BetCount": 52,
        "Turnover": 322.0000,
        "CustomerWinLoss": 142.3210,
        "SubsidiaryWinLoss": -141.7636
    },
    "EUR": {
        "BetCount": 4,
        "Turnover": 0.0000,
        "CustomerWinLoss": 0.0000,
        "SubsidiaryWinLoss": 0.5574
    }
}

export { defaultProps, totalData, bodyData, grandTotalData, bodyDetailData, totalDetailData, defaultAppData };