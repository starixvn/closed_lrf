import { ReportBy } from '../constants/report'
import Site from './site'
import axios from 'axios'

const fetchData = (relativeUrl, params) => {
    const url = Site.resolveClientUrl(relativeUrl);
    return axios.post(url, params.data, {
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            '__RequestVerificationToken': Site.getXsrfToken()
        }
    });
}

export default class Report {
    static getDrilldownDateRange(reportBy, fromDate, toDate, drilldownDate) {
        let fdate = typeof drilldownDate === "string" ? new Date(drilldownDate) : drilldownDate;
        let tdate = fdate;

        if (Number(reportBy) === ReportBy.MONTHLY) {
            let fday = 1;
            const month = fdate.getMonth();
            const year = fdate.getFullYear();
            const orignalFDate = new Date(fromDate);

            if (month === orignalFDate.getMonth()) {
                fday = orignalFDate.getDate();
            }

            fdate = new Date(year, month, fday, 0, 0, 0, 0);

            const originalTDate = new Date(toDate);

            if (month === originalTDate.getMonth()) {
                const tday = originalTDate.getDate();
                tdate = new Date(year, month, tday, 0, 0, 0, 0);
            }
            else {
                tdate = new Date(year, month + 1, 0);
            }
        }

        return {
            fromDate: fdate,
            toDate: tdate
        };
    }

    static fetchGridData(relativeUrl, params) {
        return fetchData(relativeUrl, params);
    }
}