import LangHelper from '../../../lib/langHelper'
import Site from '../../../lib/site'
import Report from '../../../lib/report'

export const HeaderText = {
    index: LangHelper.getSingleResource('#'),
    date: LangHelper.getSingleResource('Date'),
    month: LangHelper.getSingleResource('Month'),
    externalId: LangHelper.getSingleResource('ExternalId'),
    systemId: LangHelper.getSingleResource('SystemId'),
    currency: LangHelper.getSingleResource('Currency'),
    turnover: LangHelper.getSingleResource('Turnover'),
    netTurnover: LangHelper.getSingleResource('NetTurnover'),
    totalTransaction: LangHelper.getSingleResource('TotalTransaction'),
    customer: LangHelper.getSingleResource('Customer'),
    customerWL: LangHelper.getSingleResource('CustomerW_L'),
    customerComm: LangHelper.getSingleResource('CustomerComm'),
    total: LangHelper.getSingleResource('Total'),
    licensee: LangHelper.getSingleResource('Licensee'),
    licenseeWL: LangHelper.getSingleResource('LicenseeW_L'),
    amountDueTo: LangHelper.getSingleResource('AmountDueTo'),
    licenseeComm: LangHelper.getSingleResource('LicenseeComm'),
}

export const TotalText = {
    total: LangHelper.getSingleResource('Total'),
    totalIn: LangHelper.getSingleResource('Totalin')
}

export const BreadcrumbText = {
    main: LangHelper.getSingleResource('Main'),
    licensee: LangHelper.getSingleResource('Licensee'),
    customer: LangHelper.getSingleResource('Customer')
}

export class Service {
    static getReportTitle(dateRange, selectedCurrency, allCurrencies) {
        const fromDate = Site.convertDateToString(dateRange.fromDate);
        const toDate = Site.convertDateToString(dateRange.toDate);
        const viewInByCurrency = allCurrencies 
            ? LangHelper.getSingleResource('AllCurrencies') 
            : `${LangHelper.getSingleResource('Viewin').replace('{0}', selectedCurrency)}`;

        return `${LangHelper.getSingleResource('ExchangeWinLoss')}, ${fromDate} - ${toDate} - ${viewInByCurrency}`;
    }

    static showErrorMsg() {
        alert(LangHelper.getSingleResource('ErrorProcessingMsg'));
    }

    static getDrilldownDateRange(reportBy, fromDate, toDate, drilldownDate) {
        return Report.getDrilldownDateRange(reportBy, fromDate, toDate, drilldownDate)
    }
}