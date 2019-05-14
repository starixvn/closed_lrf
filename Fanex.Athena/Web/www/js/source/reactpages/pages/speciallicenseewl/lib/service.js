import LangHelper from '../../../lib/langHelper'

export const Url = 'api/SpecialLicenseeWinLossReport/Index';

export const HeaderText = {
    index: '#',
    date: LangHelper.getSingleResource('Date'),
    currency: LangHelper.getSingleResource('Currency'),
    turnover: LangHelper.getSingleResource('Turnover'),
    totalTransaction: LangHelper.getSingleResource('TotalTransaction'),
    customer: LangHelper.getSingleResource('CustomerW_L'),
    licenseeWL: LangHelper.getSingleResource('LicenseeW_L'),
    total: LangHelper.getSingleResource('Total'),
    SB: LangHelper.getSingleResource('ProductSB'),
    NG: LangHelper.getSingleResource('ProductNG')
};

export const TotalText = {
    total: LangHelper.getSingleResource('Total'),
    totalIn: LangHelper.getSingleResource('Totalin')
}

const sortNumber = (a, b) => a - b;
const sortString = (a, b) => a > b ? 1 : (a < b ? -1 : 0);

export class Service {
    static getReportTitle(fromDate, toDate, currencyId, currencyName, baseCurrency) {
        const viewInByCurrency = currencyId == 0 
            ? LangHelper.getSingleResource('AllCurrencies')
            : `${LangHelper.getSingleResource('Viewin').replace('{0}', baseCurrency.toUpperCase() || currencyName)}`;

        return `${LangHelper.getSingleResource('LicenseeWinLoss')}, GMT+8, ${fromDate} - ${toDate} - ${viewInByCurrency}`;
    }

    static showErrorMsg() {
        alert(LangHelper.getSingleResource('ErrorProcessingMsg'));
    }

    static sort(data, sortBy, sortOrder) {

 
        sortBy = sortBy === 'Date' ? 'Ticks' : sortBy;

        let compareFunc = null;

        if (sortBy === 'CurrencyName') {
            if (sortOrder === 'asc') {
                compareFunc = (a, b) => sortString(a[sortBy], b[sortBy]);
            }
            else {
                compareFunc = (a, b) => sortString(b[sortBy], a[sortBy]);
            }
        }
        else {
            if (sortOrder === 'asc') {
                compareFunc = (a, b) => sortNumber(a[sortBy], b[sortBy]);
            }
            else {
                compareFunc = (a, b) => sortNumber(b[sortBy], a[sortBy]);
            }
        }

        data.sort(compareFunc);
    }
};