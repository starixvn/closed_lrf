import React from 'react';
import { FormFilter } from '../FormFilter';
import renderer from 'react-test-renderer';
import ShallowRenderer from 'react-test-renderer/shallow';

import LangHelper from '@jsroot/lib/langHelper';
import AppData from '@jsroot/lib/AppData';
import { Service } from '../../lib/service';
import ReportExcel from '../../lib/reportExcel';

jest.mock('../../lib/reportExcel');
jest.mock('@jsroot/lib/AppData');

describe('FormFilter ', () => {
    const props = {
        dateRange: { fromDate: '01/01/2017', toDate: '10/10/2017' },
        selectedCurrency: { value: '1', label: '1' },
        reportByOption: [{ value: '1', label: '1' }, { value: '2', label: '2' }],
        selectedReportBy: 1,
        isExcludeTest: true,
        isAllowedCustomerComm: true,
        setParams: jest.fn(),
        toggleLoader: jest.fn(),
        getGridData: jest.fn()
    };
    const reportTitle = 'Report Title';

    beforeAll(() => {
        Object.assign(AppData, {
            dateConstraint: { maxDate: '01/01/2010', minDate: '10/10/2030' },
            currencyList: [{ value: '1', label: '1' }, { value: '2', label: '2' }]
        });
        LangHelper.getSingleResource = jest.fn((resource) => {
            if (resource === 'DateRangeExceedMsg') {
                return 'DateRangeExceedMsg' + ' {0}';
            }

            return resource;
        });
        Service.getReportTitle = jest.fn(() => reportTitle);
        Service.showErrorMsg = jest.fn();
    })

    afterAll(() => {
        jest.resetAllMocks();
    })

    describe('ExchangeWL FormFilter', () => {
        describe('render whole component', () => {
            it('match to snapshot', () => {
                const renderer = new ShallowRenderer();
                const result = renderer.render(<FormFilter {...props}/>);
                expect(result).toMatchSnapshot();
            })
        })

        describe('_renderDateRange', () => {
            it('component props should be correct', () => {
                const expectedResult = {
                    startDate: props.dateRange.fromDate,
                    endDate: props.dateRange.toDate,
                    minDate: AppData.dateConstraint.minDate,
                    maxDate: AppData.dateConstraint.maxDate,
                    limitedMonthRange: 3
                };

                const formFilter = new FormFilter(props);
                const dateRange = formFilter._renderDateRange();

                const { startDate, endDate, minDate, maxDate, limitedMonthRange } = dateRange.props;
                const result = { startDate, endDate, minDate, maxDate, limitedMonthRange };

                expect(result).toEqual(expectedResult);
            })

            it('onChange - is invalid month range - alert warning message', () => {
                window.alert = jest.fn();
                const formFilter = new FormFilter(props);
                const expecteMessage = 'DateRangeExceedMsg 3';

                const dateRange = formFilter._renderDateRange();
                dateRange.props.onChange({}, false);

                expect(window.alert).toHaveBeenCalledWith(expecteMessage);
            })

            it('onChange - is valid month range - change date range state', () => {
                const filterProps = { ...props, setDateRange: jest.fn() };
                const formFilter = new FormFilter(filterProps);
                const newDate = { fromDate: '02/02/2017', toDate: '12/12/2017' };

                const dateRange = formFilter._renderDateRange();
                dateRange.props.onChange(newDate);

                expect(filterProps.setDateRange).toHaveBeenCalledWith(newDate);
            })
        })

        describe('_renderCurrencySelectList', () => {
            it('component props should be correct', () => {
                const expectedResult = {
                    value: props.selectedCurrency,
                    options: AppData.currencyList,
                };

                const formFilter = new FormFilter(props);
                const currencySelect = formFilter._renderCurrencySelectList();

                const { value, options } = currencySelect.props;
                const result = { value, options };

                expect(result).toEqual(expectedResult);
            })

            it('onChange - change selected currency state', () => {
                const filterProps = { ...props, setSelectedCurrency: jest.fn() };
                const formFilter = new FormFilter(filterProps);
                const newData = { value: '2', label: '2' };

                const currencySelect = formFilter._renderCurrencySelectList();
                currencySelect.props.onChange(newData);

                expect(filterProps.setSelectedCurrency).toHaveBeenCalledWith(newData);
            })
        })

        describe('_renderReportByOption', () => {
            it('component props should be correct', () => {
                const expectedResult = props.reportByOption.map((item) => {
                    return {
                        value: item.value,
                        checked: item.value === props.selectedReportBy
                    };
                });

                const formFilter = new FormFilter(props);
                const reportByOption = renderer.create(formFilter._renderReportByOption()).toJSON();

                let result = []
                for (let i = 1; i <= props.reportByOption.length; i++) {
                    const option = reportByOption.children[i];
                    result.push({
                        value: option.children[0].props.value,
                        checked: option.children[0].props.checked
                    });
                }

                expect(result).toEqual(expectedResult);
            })

            it('onChange - new state is not the same with current state - change selected report by state', () => {
                const filterProps = { ...props, setReportBy: jest.fn() };
                const newData = '2';
                const event = {
                    target: { value: newData }
                };

                const formFilter = new FormFilter(filterProps);
                const reportByOption = renderer.create(formFilter._renderReportByOption()).toJSON();
                reportByOption.children[2].children[0].props.onChange(event);

                expect(filterProps.setReportBy).toHaveBeenCalledWith(parseInt(newData));
            })

            it('onChange - the new state is NaN - do not change "selected report by" state', () => {
                const filterProps = { ...props, setReportBy: jest.fn() };
                const newData = 'a';
                const event = {
                    target: { value: newData }
                };

                const formFilter = new FormFilter(filterProps);
                const reportByOption = renderer.create(formFilter._renderReportByOption()).toJSON();
                reportByOption.children[2].children[0].props.onChange(event);

                expect(filterProps.setReportBy).not.toHaveBeenCalled();
            })

            it('onChange - new state is the same with current state - do not change "selected report by" state', () => {
                const filterProps = { ...props, setReportBy: jest.fn() };
                const newData = '1';
                const event = {
                    target: { value: newData }
                };

                const formFilter = new FormFilter(filterProps);
                const reportByOption = renderer.create(formFilter._renderReportByOption()).toJSON();
                reportByOption.children[1].children[0].props.onChange(event);

                expect(filterProps.setReportBy).not.toHaveBeenCalled();
            })
        })

        describe('_renderExcludeTestDataCheckBox', () => {
            it('component props should be correct', () => {
                const expectedResult = {
                    checked: props.isExcludeTest,
                    htmlFor: 'ExcludeTest'
                }

                const formFilter = new FormFilter(props);
                const reportByOption = renderer.create(formFilter._renderExcludeTestDataCheckBox()).toJSON();

                expect(reportByOption.children[0].props.checked).toEqual(expectedResult.checked);
                expect(reportByOption.children[1].props.htmlFor).toEqual(expectedResult.htmlFor);
            })

            it('onChange - change to new state', () => {
                const filterProps = { ...props, changeIsExcludeTest: jest.fn() };
                const expectedNewState = !props.isExcludeTest;

                const formFilter = new FormFilter(filterProps);
                const reportByOption = renderer.create(formFilter._renderExcludeTestDataCheckBox()).toJSON();
                reportByOption.children[0].props.onChange();

                expect(filterProps.changeIsExcludeTest).toHaveBeenCalledWith(expectedNewState);
            })
        })
    });

    describe('filter method', () => {
        describe('submit', () => {
            it('parameter is null - do nothing', () => {
                const formFilter = new FormFilter(props);
                formFilter._getParams = jest.fn((level) => { return null; });

                formFilter.submit({
                    preventDefault: jest.fn()
                });

                expect(props.toggleLoader).not.toHaveBeenCalled();
                expect(props.getGridData).not.toHaveBeenCalled();
            })

            it('get grid data', () => {
                const formFilter = new FormFilter({ ...props, params: [] });
                const params = { data: {} };
                formFilter._getParams = jest.fn((level) => { return params; });

                formFilter.submit({
                    preventDefault: jest.fn()
                });
                const actualParams = props.getGridData.mock.calls[0][0];

                expect(props.toggleLoader).toHaveBeenCalledWith(true);
                expect(props.getGridData).toHaveBeenCalled();
                expect(actualParams).toEqual(params);
                expect(props.setParams).toHaveBeenCalledWith(params.data);
            })

            it('get grid data - alert error when getting data failed', () => {
                const formFilter = new FormFilter({ ...props, params: [] });
                const params = { data: {} };
                formFilter._getParams = jest.fn((level) => { return params; });

                formFilter.submit({
                    preventDefault: jest.fn()
                });
                const errorHandler = props.getGridData.mock.calls[0][1];
                errorHandler();

                expect(Service.showErrorMsg).toHaveBeenCalled();
                expect(props.toggleLoader).toHaveBeenCalledWith(false);
            })

            it('_getParams - get data from props', () => {
                const filterProps = { ...props, params: [] };
                const formFilter = new FormFilter(filterProps);
                const expectedResult = {
                    data: {
                        CurrencyId: filterProps.selectedCurrency.value,
                        CurrencyName: filterProps.selectedCurrency.label,
                        BaseCurrency: "",
                        FromDate: filterProps.dateRange.fromDate,
                        ToDate: filterProps.dateRange.toDate,
                        ReportBy: filterProps.selectedReportBy,
                        ExcludeTestData: filterProps.isExcludeTest,
                        Level: 0
                    }
                };

                const result = formFilter._getParams();

                expect(result).toEqual(expectedResult);
            })

            it('_getParams - Currency is base - get correct data', () => {
                const filterProps = { ...props, params: [], selectedCurrency: { value: -1, lable: 'Base' } };
                const formFilter = new FormFilter(filterProps);
                const expectedResult = {
                    data: {
                        CurrencyId: filterProps.selectedCurrency.value,
                        CurrencyName: 'EUR',
                        BaseCurrency: 'EUR',
                        FromDate: filterProps.dateRange.fromDate,
                        ToDate: filterProps.dateRange.toDate,
                        ReportBy: filterProps.selectedReportBy,
                        ExcludeTestData: filterProps.isExcludeTest,
                        Level: 0
                    }
                };

                const result = formFilter._getParams();

                expect(result).toEqual(expectedResult);
            })
        });

        describe('exportExcel', () => {
            it('_getParams return null - do nothing', () => {
                const filterProps = { ...props, gridData: {} };
                const formFilter = new FormFilter(filterProps);
                formFilter._getParams = jest.fn((level) => { return null; });
                formFilter._doExportExcel = jest.fn();
                formFilter.exportExcel({
                    preventDefault: jest.fn()
                });

                expect(formFilter._doExportExcel).not.toHaveBeenCalled();
            })

            it('get data failed - export data with correct parameter', () => {
                const promise = Promise.reject('error');
                const params = { data: 1 };

                const filterProps = { ...props, gridData: {}, exportExcel: jest.fn(() => promise) };
                const formFilter = new FormFilter(filterProps);
                formFilter._getParams = jest.fn((level) => { return params; });

                formFilter.exportExcel({
                    preventDefault: jest.fn()
                });

                Promise.reject().catch(() => {
                    expect(Service.showErrorMsg).toHaveBeenCalled();
                    expect(props.toggleLoader).toHaveBeenCalledWith(false);
                });
            })

            it('level 0 - export data with correct parameter', () => {
                const level = 0;
                const fakeResponse = { data: [1, 2] };
                const promise = Promise.resolve(fakeResponse);
                const params = { data: 1 };

                const filterProps = { ...props, gridData: {}, exportExcel: jest.fn(() => promise) };
                const formFilter = new FormFilter(filterProps);
                formFilter._getParams = jest.fn((level) => { return params; });
                formFilter._doExportExcel = jest.fn();

                formFilter.exportExcel({
                    preventDefault: jest.fn()
                });

                Promise.resolve().then(() => {
                    expect(formFilter._doExportExcel).toHaveBeenCalledWith(level, params.data, props.isAllowedCustomerComm, fakeResponse.data);
                });
            })

            it('level 1 - export data with correct parameter', () => {
                const level = 1;
                const params = { data: 1 };

                const filterProps = { ...props, gridData: { level: 1, data: [] } };
                const formFilter = new FormFilter(filterProps);
                formFilter._getParams = jest.fn((level) => { return params; });
                formFilter._doExportExcel = jest.fn();

                formFilter.exportExcel({
                    preventDefault: jest.fn()
                });

                expect(formFilter._doExportExcel).toHaveBeenCalledWith(level, params.data, props.isAllowedCustomerComm, filterProps.gridData.data);
            })

            it('_doExportExcel - data is null - alert message', () => {
                window.alert = jest.fn();

                const formFilter = new FormFilter(props);
                const param = {
                    FromDate: '01/01/2017',
                    ToDate: '01/02/2017',
                    CurrencyName: 'USD',
                    CurrencyId: 0,
                    Level: 0,
                    ReportBy: 1,
                    BaseCurrency: 'USD'
                };
                const isAllowedCustomerComm = true;
                const data = null;

                formFilter._doExportExcel(0, param, isAllowedCustomerComm, data);

                expect(window.alert).toHaveBeenCalledWith('NoInfo');
            })

            it('_doExportExcel - DataList is empty - call export method of Excel class', () => {
                window.alert = jest.fn();

                const formFilter = new FormFilter(props);
                const param = {
                    FromDate: '01/01/2017',
                    ToDate: '01/02/2017',
                    CurrencyName: 'USD',
                    CurrencyId: 0,
                    Level: 0,
                    ReportBy: 1,
                    BaseCurrency: 'USD'
                };
                const isAllowedCustomerComm = true;
                const data = {
                    DataList: []
                };

                formFilter._doExportExcel(0, param, isAllowedCustomerComm, data);

                expect(window.alert).toHaveBeenCalledWith('NoInfo');
            })

            it('_doExportExcel - level MAIN - call export method of Excel class with correct title title', () => {
                const exportFnMock = jest.fn();
                const reportExcelMock = jest.fn(() => {
                    return {
                        export: exportFnMock
                    }
                });
                ReportExcel.mockImplementation(reportExcelMock);

                const formFilter = new FormFilter(props);
                const param = {
                    FromDate: '01/01/2017',
                    ToDate: '01/02/2017',
                    CurrencyName: 'USD',
                    CurrencyId: 0,
                    Level: 0,
                    ReportBy: 1,
                    BaseCurrency: 'USD'
                };
                const isAllowedCustomerComm = true;
                const data = {
                    DataList: [{
                        Date: '2018-01-01T00:00:00'
                    }]
                };

                formFilter._doExportExcel(0, param, isAllowedCustomerComm, data);

                expect(Service.getReportTitle).toHaveBeenCalledWith({ fromDate: param.FromDate, toDate: param.ToDate }, param.BaseCurrency, param.CurrencyId === 0);
                expect(reportExcelMock).toHaveBeenCalledWith(data, reportTitle, param.Level, isAllowedCustomerComm, param.ReportBy);
                expect(exportFnMock.mock.calls.length).toBe(1);
            })

            it('_doExportExcel - level is not MAIN - call export method of Excel class with correct title title', () => {
                const exportFnMock = jest.fn();
                const reportExcelMock = jest.fn(() => {
                    return {
                        export: exportFnMock
                    }
                });
                ReportExcel.mockImplementation(reportExcelMock);

                const formFilter = new FormFilter(props);
                const param = {
                    FromDate: '01/01/2017',
                    ToDate: '01/02/2017',
                    CurrencyName: 'USD',
                    CurrencyId: 0,
                    Level: 10,
                    ReportBy: 2,
                    BaseCurrency: 'USD'
                };
                const isAllowedCustomerComm = true;
                const firstData = { Date: '2017-01-03T00:00:00', CurrencyName: 'GBP', CurrencyId: 1 };
                const data = {
                    DataList: [firstData],
                    AdditionalInfo: 'EUR'
                };
                Service.getDrilldownDateRange = jest.fn((reportBy, fromDate, toDate, drilldownDate) => { return { fromDate: drilldownDate, toDate: drilldownDate }; });

                formFilter._doExportExcel(10, param, isAllowedCustomerComm, data);

                expect(Service.getReportTitle).toHaveBeenCalledWith({ fromDate: '01/03/2017', toDate: '01/03/2017' }, data.AdditionalInfo, firstData.CurrencyId === 0);
                expect(reportExcelMock).toHaveBeenCalledWith(data, reportTitle, 10, isAllowedCustomerComm, param.ReportBy);
                expect(exportFnMock.mock.calls.length).toBe(1);
            })
        });
    });
});