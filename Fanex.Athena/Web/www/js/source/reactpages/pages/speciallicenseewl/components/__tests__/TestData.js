const defaultAppData = {
    productOptions: [{ Code: 'p1', Name: 'product1', Status: false }, { Code: 'p2', Name: 'product2', Status: true }],
    selectedCurrency: [{ value: 1, label: 'Cur 1' }, { value: 2, label: 'Cur 2' }],
    dateConstraint: { minDate: '01/01/2017', maxDate: '01/01/2019' }
}

const defaultFilterProps = {
    reportByList: [{ value: 1, label: 'Opt 1' }, { value: 2, label: 'Opt 2' }],
    selectedReportBy: 1,
    selectedCurrency: { value: 1, label: 'Cur 1' },
    dateRange: { fromDate: '01/01/2018', toDate: '01/02/2018' },
    selectedProduct: 'p1,p2',
    xsrfToken: '123'
}

const defaultGridProps = {
    toggleLoader: jest.fn(),
    setReportTitle: jest.fn(),
    setParams: jest.fn()
}

const gridData = {
    Data: [{
        Ticks: 1,
        Index: 0,
        Date: "2018-08-21T00:00:00",
        CurrencyId: 10,
        CurrencyName: "UUS",
        CustomerWinLoss: -5,
        TotalTransaction: 1,
        TotalTurnOver: 15,
        TotalLicenseeWL: -10,
        TurnOverSB: 5,
        TurnOverNG: 10,
        LicenseeWLSB: -20,
        LicenseeWLNG: 30
    },
    {
        Ticks: 2,
        Index: 1,
        Date: "2018-08-21T00:00:00",
        CurrencyId: 10,
        CurrencyName: "UUS",
        CustomerWinLoss: -5,
        TotalTransaction: 1,
        TotalTurnOver: 15,
        TotalLicenseeWL: 20,
        TurnOverSB: 5,
        TurnOverNG: 10,
        LicenseeWLSB: -20,
        LicenseeWLNG: 30
    }],
    SummaryTotal: {
        USD: {
            CurrencyId: 1,
            CurrencyName: "USD",
            CustomerWinLoss: -1,
            TotalTransaction: 2,
            TotalTurnOver: 3,
            TotalLicenseeWL: 2,
            TurnOverSB: 1,
            TurnOverNG: 2,
            LicenseeWLSB: -4,
            LicenseeWLNG: 6
        }
    },
    Total: [{
        CurrencyId: 1,
        CurrencyName: "USD",
        CustomerWinLoss: -1,
        TotalTransaction: 2,
        TotalTurnOver: 3,
        TotalLicenseeWL: 2,
        TurnOverSB: 1,
        TurnOverNG: 2,
        LicenseeWLSB: -4,
        LicenseeWLNG: 6
    }, {
        CurrencyId: 2,
        CurrencyName: "UUS",
        CustomerWinLoss: -10,
        TotalTransaction: 2,
        TotalTurnOver: 30,
        TotalLicenseeWL: 20,
        TurnOverSB: 10,
        TurnOverNG: 20,
        LicenseeWLSB: -40,
        LicenseeWLNG: 60
    }]
}

export { defaultAppData, defaultFilterProps, defaultGridProps, gridData }