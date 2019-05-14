import LangHelper from '../../../../lib/langHelper'

import { Service, HeaderText, TotalText } from '../service'

describe('Service ', () => {
    beforeAll(() => {
        LangHelper.getSingleResource = jest.fn(resource => {
            if (resource === 'Viewin') {
                return 'Viewin {0}';
            }

            return resource;
        });
    })
    afterAll(() => {
        jest.resetAllMocks();
    })

    describe('getReportTitle', () => {
        it('view in EUR - return correct content', () => {
            const fromDate = '01/01/2017';
            const toDate = '10/10/2017';
            const selectedCurrency = 'EUR';

            const expectedResult = `LicenseeWinLoss, GMT+8, ${fromDate} - ${toDate} - Viewin ${selectedCurrency}`

            const result = Service.getReportTitle(fromDate, toDate, 1, selectedCurrency, '');

            expect(result).toBe(expectedResult);
        })

        it('view in base USD - return correct content', () => {
            const fromDate = '01/01/2017';
            const toDate = '10/10/2017';
            const selectedCurrency = 'EUR';
            const baseCurrency = 'usd';

            const expectedResult = `LicenseeWinLoss, GMT+8, ${fromDate} - ${toDate} - Viewin ${baseCurrency.toUpperCase()}`

            const result = Service.getReportTitle(fromDate, toDate, 1, selectedCurrency, baseCurrency);

            expect(result).toBe(expectedResult);
        })

        it('all currencies - return correct content', () => {
            const fromDate = '01/01/2017';
            const toDate = '10/10/2017';
            const selectedCurrency = 'EUR';

            const expectedResult = `LicenseeWinLoss, GMT+8, ${fromDate} - ${toDate} - AllCurrencies`

            const result = Service.getReportTitle(fromDate, toDate, 0, selectedCurrency, '');

            expect(result).toBe(expectedResult);
        })
    })

    describe('HeaderText', () => {
        it('header text should has correct content', () => {
            const expectedResult = {
                index: '#',
                date: 'Date',
                currency: 'Currency',
                turnover: 'Turnover',
                totalTransaction: 'TotalTransaction',
                customer: 'CustomerW_L',
                licenseeWL: 'LicenseeW_L',
                total: 'Total',
                SB: 'ProductSB',
                NG: 'ProductNG'
            };

            expect(HeaderText).toEqual(expectedResult);
        })
    })

    describe('TotalText', () => {
        it('text should has correct content', () => {
            const expectedResult = {
                total: 'Total',
                totalIn: 'Totalin'
            };

            expect(TotalText).toEqual(expectedResult);
        })
    })

    describe('showErrorMsg', () => {
        it('alert correct message', () => {
            window.alert = jest.fn();

            Service.showErrorMsg();

            expect(alert).toHaveBeenCalledWith('ErrorProcessingMsg');
        })
    })

    describe('sort', () => {
        it('sort asc by Date - return correct data', () => {
            const data = [{ Ticks: 2 }, { Ticks: 3 }, { Ticks: 1 }];
            const expected = [{ Ticks: 1 }, { Ticks: 2 }, { Ticks: 3 }];

            const sortBy = 'Date';
            const sortOrder = 'asc';

            Service.sort(data, sortBy, sortOrder);

            expect(data).toEqual(expected);
        })

        it('sort desc by Date - return correct data', () => {
            const data = [{ Ticks: 2 }, { Ticks: 3 }, { Ticks: 1 }];
            const expected = [{ Ticks: 3 }, { Ticks: 2 }, { Ticks: 1 }];

            const sortBy = 'Date';
            const sortOrder = 'desc';

            Service.sort(data, sortBy, sortOrder);

            expect(data).toEqual(expected);
        })

        it('sort asc by CurrencyName - return correct data', () => {
            const data = [{ CurrencyName: 'B' }, { CurrencyName: 'C' }, { CurrencyName: 'A' }];
            const expected = [{ CurrencyName: 'A' }, { CurrencyName: 'B' }, { CurrencyName: 'C' }];

            const sortBy = 'CurrencyName';
            const sortOrder = 'asc';

            Service.sort(data, sortBy, sortOrder);

            expect(data).toEqual(expected);
        })

        it('sort desc by CurrencyName - return correct data', () => {
            const data = [{ CurrencyName: 'A' }, { CurrencyName: 'C' }, { CurrencyName: 'A' }, { CurrencyName: 'B' }];
            const expected = [{ CurrencyName: 'C' }, { CurrencyName: 'B' }, { CurrencyName: 'A' }, { CurrencyName: 'A' }];

            const sortBy = 'CurrencyName';
            const sortOrder = 'desc';

            Service.sort(data, sortBy, sortOrder);

            expect(data).toEqual(expected);
        })

        it('sort asc by Number - return correct data', () => {
            const data = [{ Number: 2 }, { Number: 3 }, { Number: 1 }];
            const expected = [{ Number: 1 }, { Number: 2 }, { Number: 3 }];

            const sortBy = 'Number';
            const sortOrder = 'asc';

            Service.sort(data, sortBy, sortOrder);

            expect(data).toEqual(expected);
        })

        it('sort desc by Number - return correct data', () => {
            const data = [{ Number: 3 }, { Number: 1 }, { Number: 2 }, { Number: 3 }];
            const expected = [{ Number: 3 }, { Number: 3 }, { Number: 2 }, { Number: 1 }];

            const sortBy = 'Number';
            const sortOrder = 'desc';

            Service.sort(data, sortBy, sortOrder);

            expect(data).toEqual(expected);
        })
    })
})