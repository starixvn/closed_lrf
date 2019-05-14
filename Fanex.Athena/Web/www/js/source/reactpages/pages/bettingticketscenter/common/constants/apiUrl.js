import Site from '@jsroot/lib/site'
const ApiUrl = {
    CUSTOMER_SEARCH_URL: Site.resolveClientUrl("SearchCustomerAPI/SearchCustomer"),
    RUNNING_DATA_URL: Site.resolveClientUrl('api/BettingTicketCenter/GetByRunning'),
    REFNO_DATA_URL: Site.resolveClientUrl('api/BettingTicketCenter/GetByRefNo'),
    SINGLECUSTOMER_DATA_URL: Site.resolveClientUrl('api/BettingTicketCenter/GetBySingleCustomer'),
    MULTICUSTOMER_DATA_URL: Site.resolveClientUrl('api/BettingTicketCenterMultiCustomer/GetData')
}
export default ApiUrl;
