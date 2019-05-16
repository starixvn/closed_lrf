import LangHelper from '../../../lib/langHelper'

export const HeaderText = {
    Product: LangHelper.getSingleResource('Product'),
    Turnover: LangHelper.getSingleResource('Turnover'),
    CustomerWL: LangHelper.getSingleResource('CustomerW_L'),
    LicenseeNetWL: LangHelper.getSingleResource('LicenseeNetWL'),
    AmountDue: LangHelper.getSingleResource('AmountDue'),
    Currency: LangHelper.getSingleResource('Currency'),
    Unit: LangHelper.getSingleResource('Unit')
}

export const TotalText = {
    SubTotal: LangHelper.getSingleResource('SubTotal'),
    DeductAMF: LangHelper.getSingleResource('DeductAMF'),
    DeductPrepayment: LangHelper.getSingleResource('DeductPrepayment'),
    Total: LangHelper.getSingleResource('Total')
}

export class Service {
    static showErrorMsg() {
        alert(LangHelper.getSingleResource('ErrorProcessingMsg'));
    }

    static getReportTitle(fromDate, toDate, baseCurrency) {
        return `${LangHelper.getSingleResource('DetailedBilling')}`
            + `, ${fromDate} → ${toDate}`
            + `, ${LangHelper.getSingleResource('BaseCurrency')}: ${baseCurrency}`;
    }

    static getExchangeTitle(toDate) {
        return `${LangHelper.getSingleResource('Forex')} @ ${toDate}`;
    }
}