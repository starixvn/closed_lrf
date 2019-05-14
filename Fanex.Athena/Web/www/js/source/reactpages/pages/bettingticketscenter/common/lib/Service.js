import LangHelper from '@jsroot/lib/langHelper'
import Site from '@jsroot/lib/site'

const HeaderText = {
    Index: "#",
    Platform: LangHelper.getSingleResource("Platform"),
    ExternalId : LangHelper.getSingleResource("ExternalId"),
    SystemId: LangHelper.getSingleResource("SystemId"),
    RefNo: LangHelper.getSingleResource("RefNo"),
    TransTime: LangHelper.getSingleResource("TransTime"),
    Choice: LangHelper.getSingleResource("Choice"),
    Odds: LangHelper.getSingleResource("Odds"),
    OddsType: LangHelper.getSingleResource("OddsType"),
    Stake: LangHelper.getSingleResource("Stake"),
    WinLoss: LangHelper.getSingleResource("WinLoss"),
    LicenseeWL: LangHelper.getSingleResource("LicenseeWL"),
    Comm: LangHelper.getSingleResource("Comm"),
    Status: LangHelper.getSingleResource("Status"),
    Live: LangHelper.getSingleResource("Live")
}

export default class Service {
    static getHeaderText() {
        return HeaderText;
    }

    static getTitle(fromDate, toDate, currencyName, baseCurrency) {
        const dateRangeText = fromDate && toDate 
            ? `, ${Site.convertDateToString(fromDate)} → ${Site.convertDateToString(toDate)}` 
            : '';
        const currencyNameText = currencyName ? `, ${LangHelper.getSingleResource("Currency")}: ${currencyName}` : '';
        const baseCurrencyText = baseCurrency ? `, ${LangHelper.getSingleResource("BaseCurrency")}: ${baseCurrency}` : '';

        return LangHelper.getSingleResource("BettingTicketCenter") + dateRangeText + currencyNameText + baseCurrencyText;
    }
}