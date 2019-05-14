const Data = [],
    Total = [];

const defaultProps = {
    gridData: { Data, Total },
    xsrfToken: "token",
    selectedProduct: 'SB,BA',
    selectedCurrency: { "value": 0, "label": "All" },
    selectedBaseCurrency: 'EUR',
    timeZoneList: [{ "value": -4, "label": "GMT-4" }, { "value": 8, "label": "GMT+8" }],
    selectedTimeZone: -4,
    reportByList: [{ "value": 1, "label": "Summary" }, { "value": 2, "label": "Daily" }, { "value": 3, "label": "Monthly" }],
    selectedReportBy: 1,
    groupBy: 1,
    isConvertAll: true,
    isIncludeDrawData: true,
    isExcludeTest: true,
    dateRange: { fromDate: '12/12/2017', toDate: '12/12/2017' },
    isLoading: false,
    dateConstraint: { minDate: '06/01/2012', maxDate: '12/12/2017' },

    setDateRange: jest.fn(),
    toggleLoader: jest.fn(),
    setSelectedTimeZone: jest.fn(),
    setSelectedReportBy: jest.fn(),
    setSelectedCurrency: jest.fn(),
    setSelectedBaseCurrency: jest.fn(),
    changeIsConvertAll: jest.fn(),
    changeIsIncludeDrawData: jest.fn(),
    changeIsExcludeTest: jest.fn()
}

const defaultAppData = {
    productOptions: [{ "Code": "SB", "Name": "Sportsbook", "Status": true }, { "Code": "BA", "Name": "BA", "Status": true }],
    currencyList: [{ "value": 0, "label": "All" }, { "value": 9, "label": "AUD" }, { "value": 41, "label": "CHF" }, { "value": 6, "label": "EUR" }, { "value": 51, "label": "INH" }, { "value": 61, "label": "INR" }, { "value": 32, "label": "JPY" }, { "value": 45, "label": "KRW" }, { "value": 70, "label": "MKK" }, { "value": 4, "label": "THB" }, { "value": 3, "label": "USD" }, { "value": 20, "label": "UUS" }],
    baseCurrencyList: [{ "value": "EUR", "label": "EUR" }, { "value": "USD", "label": "USD" }, { "value": "GBP", "label": "GBP" }, { "value": "MYR", "label": "MYR" }, { "value": "CNY", "label": "CNY" }, { "value": "THB", "label": "THB" }, { "value": "IDR", "label": "IDR" }]
};

const bodyData = [{
    "ReportBy": "0001-01-01T00:00:00",
    "GroupBy": "Sportsbook",
    "BetCount": 50,
    "Turnover": 26761.0000,
    "CustomerComm": 960.0000,
    "LicenseeWinLoss": 23646.1700,
    "LicenseeComm": 72.0000,
    "LicenseeNetWinLoss": 22758.1700,
    "Margin": 85.04230036246777026269571391
}]

const totalData = {
    "ReportBy": "0001-01-01T00:00:00",
    "GroupBy": null,
    "BetCount": 50,
    "Turnover": 130685.73784,
    "CustomerComm": 4688.1024,
    "LicenseeWinLoss": 115474.6524248,
    "LicenseeComm": 351.60768,
    "LicenseeNetWinLoss": 111138.1577048,
    "Margin": 85.04230036246777026269571391
}

export { defaultProps, defaultAppData, totalData, bodyData };