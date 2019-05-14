import LangHelper from '../../../lib/langHelper'
import Site from '../../../lib/site'

export const HeaderText = {
    Index: '#',
    Subsidiary: LangHelper.getSingleResource("Subsidiary"),
    CurrencyName: LangHelper.getSingleResource("Currency"),
    Product: LangHelper.getSingleResource("Product"),
    BetCount: LangHelper.getSingleResource("BetCount"),
    Turnover: LangHelper.getSingleResource("Turnover"),
    CustomerWinLoss: LangHelper.getSingleResource("CustomerW_L"),
    SubsidiaryWinLoss: `${LangHelper.getSingleResource("SubsidiaryWL")}`,
    ExternalId: LangHelper.getSingleResource("ExternalId"),
    SystemId: LangHelper.getSingleResource("SystemId"),
}

export const TotalText = {
    Total: LangHelper.getSingleResource('Total'),
    TotalIn: LangHelper.getSingleResource('Totalin'),
    Based: LangHelper.getSingleResource('Based')
}

export const BreadcrumbText = {
    Main: LangHelper.getSingleResource('Main'),
    Customer: LangHelper.getSingleResource('Customer')
}

export const Api = {
    Url: 'api/SubsidiaryPerformanceReport/Index',
    DetailUrl: 'api/SubsidiaryPerformanceReport/Detail'
}

export class Service {
    static getReportTitle(fromDate, toDate, selectedBaseCurrency) {
        const baseCurrency = `${LangHelper.getSingleResource("BaseCurrency")}: ${selectedBaseCurrency}`;

        return `${LangHelper.getSingleResource("SubsidiaryPerformance")}, ${fromDate} - ${toDate}, ${baseCurrency}`;
    }

    static showErrorMsg() {
        alert(LangHelper.getSingleResource('ErrorProcessingMsg'));
    }
}