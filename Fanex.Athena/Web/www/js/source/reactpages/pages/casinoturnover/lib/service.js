import LangHelper from '../../../lib/langHelper'

export const HeaderText = {
    Index: LangHelper.getSingleResource('#'),
    Date: LangHelper.getSingleResource('Date'),
    SystemId: LangHelper.getSingleResource('SystemId'),
    ExternalId: LangHelper.getSingleResource('ExternalId'),    
    Product: LangHelper.getSingleResource('Product'),
    TotalTransaction: LangHelper.getSingleResource('TotalTransaction'),
    Turnover: LangHelper.getSingleResource('Turnover'),
    ValidBetAmount: LangHelper.getSingleResource('ValidBetAmount'),
    CustomerWL: LangHelper.getSingleResource('CustomerW_L'),
}

export class Service {
    static showErrorMsg() {
        alert(LangHelper.getSingleResource('ErrorProcessingMsg'));
    }

    static getReportTitle(fromDate, toDate, currency, baseCurrency) {
        return `${LangHelper.getSingleResource('CasinoTurnover')}`
            + `, ${fromDate} → ${toDate}`
            + `, ${LangHelper.getSingleResource('Currency')}: ${currency}`
            + `, ${LangHelper.getSingleResource('BaseCurrency')}: ${baseCurrency}`;
    }
}