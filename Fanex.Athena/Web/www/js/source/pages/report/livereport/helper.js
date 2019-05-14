define(['common/querystring'], function (QueryString) {
    'use strict';
    function setSumParams(url, totalValue) {
        let newUrl = url;
        newUrl = QueryString.setParam(newUrl, 'totalrows', totalValue.BetCount);
        newUrl = QueryString.setParam(newUrl, 'sumwinlost', totalValue.CustomerWinLoss);
        newUrl = QueryString.setParam(newUrl, 'sumplayercomm', totalValue.CustomerComm);
        newUrl = QueryString.setParam(newUrl, 'sumlicenseewl', totalValue.LicenseeWinLoss);
        newUrl = QueryString.setParam(newUrl, 'sumcomm', totalValue.LicenseeComm);
        newUrl = QueryString.setParam(newUrl, 'sumturnover', totalValue.TurnOver);
        newUrl = QueryString.setParam(newUrl, 'sumamtdueto3rd', totalValue.AmountDue);

        return newUrl;
    }

    function getMatchListProductOption(sportId, productCode) {
        const newSportId = Number(sportId);
        let productOptions = [];
        if (newSportId > 0) {
            if (newSportId === 180 || newSportId === 186) {
                productOptions.push('VS');
            }
            else if (newSportId === 162) {
                productOptions.push('LC');
            }
            else if (newSportId === 104 || (newSportId >= 190 && newSportId <= 194)) {
                productOptions.push('VS2');
            }
            else {
                if (productCode === 'SB' || productCode === 'ALL') {
                    productOptions.push('SB');
                }
                if (productCode === 'BA' || productCode === 'ALL') {
                    productOptions.push('BA');
                }
            }
        }
        else {
            if (productCode === 'ALL') {
                productOptions = ['SB', 'BA', 'NG', 'LC', 'VS', 'CS', 'VS2'];
            }
            else {
                productOptions.push(productCode);
            }
        }

        return productOptions;
    }

    return {
        setSumParams: setSumParams,
        getMatchListProductOption: getMatchListProductOption,
    };
});