import LangHelper from '../../../lib/langHelper'
import Site from '../../../lib/site'

const headerText = {
    index: "#",
    ticketList: LangHelper.getSingleResource("TicketList"),
    dateTime: LangHelper.getSingleResource("EventDate"),
    content: LangHelper.getSingleResource("Content")
}

export default class Service {
    static getReportTitle(dateRange) {
        const fromDate = Site.convertDateToString(dateRange.fromDate);
        const toDate = Site.convertDateToString(dateRange.toDate);

        return `${LangHelper.getSingleResource("Amendment")}, ${fromDate} - ${toDate}`;
    }

    static getHeaderText() {
        return headerText;
    }
}