import LangHelper from '../../../lib/langHelper'
import Site from '../../../lib/site'

const headerText = {
    Index: "#",
    ReportBy: "",
    GroupBy : "",
    BetCount: LangHelper.getSingleResource("BetCount"),
    Turnover: LangHelper.getSingleResource("Turnover"),
    CustomerComm: LangHelper.getSingleResource("CustomerComm"),
    LicenseeWL: LangHelper.getSingleResource("LicenseeWL"),
    LicenseeComm: LangHelper.getSingleResource("LicenseeComm"),
    LicenseeNetWL: LangHelper.getSingleResource("LicenseeNetWL"),
    Margin: LangHelper.getSingleResource("Margin")
}

export default class Service {
    static getReportTitle(timeZone, dateRange, currency, baseCurrency, isConvertAll) {
        const fromDate = Site.convertDateToString(dateRange.fromDate);
        const toDate = Site.convertDateToString(dateRange.toDate);
        const viewInByCurrency = isConvertAll ? ", " + LangHelper.getSingleResource("BaseCurrency") + ": " + baseCurrency : "";
        var timeZoneText =  "GMT" + (timeZone < 0 ? timeZone : "+" + timeZone);
        var currencyText = LangHelper.getSingleResource("Currency") + ": " + currency;
        return `${LangHelper.getSingleResource("WinLossByTimeZone")}, ${timeZoneText}, ${fromDate} → ${toDate}, ${currencyText}${viewInByCurrency}`;
    }

    static getHeaderText(reportBy, groupBy) {
        headerText.ReportBy = LangHelper.getSingleResource(reportBy === 2 ? "Date" : "Month");
        headerText.GroupBy = LangHelper.getSingleResource(groupBy === 1 ? "Product" : "Currency");
        
        return headerText;
    }
}