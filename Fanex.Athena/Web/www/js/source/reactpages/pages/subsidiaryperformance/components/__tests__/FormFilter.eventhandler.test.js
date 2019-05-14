import React from 'react';
import renderer from 'react-test-renderer';
import { FormFilter } from '../FormFilter';

import AppData from '@jsroot/lib/AppData';
import Site from '@jsroot/lib/site';
import LangHelper from '@jsroot/lib/langHelper';
import { Service, Api } from '../../lib/service';
import ReportExcel from '../../lib/reportExcel'
import Report from '../../../../lib/report'
import { ReportLevel } from '../../../../constants/report'

import { defaultProps, defaultAppData } from './fakeData';

jest.mock('../../lib/reportExcel');
jest.mock('@jsroot/lib/AppData');

describe('FormFilter ', () => {
    const originalWindowAlert = window.alert;

    beforeAll(() => {
        Object.assign(AppData, defaultAppData);
        LangHelper.getSingleResource = jest.fn(resource => {
            if (resource === "DateRangeExceedMsg") {
                return "Exceed {0} Months";
            }

            return resource;
        });

        Site.convertDateToString = jest.fn((date) => date);
    })
    afterAll(() => {
        jest.resetAllMocks();
    })

    describe('Event handler', () => {
        describe('onChange event fire on MultipleSelect component', () => {
            it('onChange in Product filter - setSelectedProduct should be called with correct parameter', () => {
                const formFilter = new FormFilter(defaultProps);
                defaultProps.setSelectedProduct = jest.fn();

                const productFilter = formFilter._renderProductSelectList();

                productFilter.props.onChange({}, "SB,BA");

                expect(defaultProps.setSelectedProduct).toHaveBeenCalledWith("SB,BA");
            })

            it('onChange in Subsidiary filter - setSelectedSubsidiary should be called with correct parameter', () => {
                const formFilter = new FormFilter(defaultProps);
                defaultProps.setSelectedSubsidiary = jest.fn();

                const subsidiaryFilter = formFilter._renderSubsidiarySelectList();
                subsidiaryFilter.props.onChange({}, "1,2,3,4");

                expect(defaultProps.setSelectedSubsidiary).toHaveBeenCalledWith("1,2,3,4");
            })
        })

        describe('onChange in Base Currency filter', () => {
            it('props.setSelectedBaseCurrency should be called with correct parameter', () => {
                const formFilter = new FormFilter(defaultProps);
                defaultProps.setSelectedBaseCurrency = jest.fn();

                const expectedValue = "EUR";
                const itemChange = { id: 1, value: expectedValue };
                const subsidiaryFilter = formFilter._renderBaseCurrencySelectList();

                subsidiaryFilter.props.onChange(itemChange);

                expect(defaultProps.setSelectedBaseCurrency).toHaveBeenCalledWith(expectedValue);
            })
        });

        describe('onChange in DateRange', () => {
            it('date range is valid month range - setDateRange should be called with correct parameter', () => {
                const formFilter = new FormFilter(defaultProps);
                defaultProps.setDateRange = jest.fn();
                const date = "09/28/2017"

                const dateRange = formFilter._renderDateRange();
                dateRange.props.onChange(date);

                expect(defaultProps.setDateRange).toHaveBeenCalledWith(date);
            })

            it('date range is invalid month range - window.alert should be called with correct parameter', () => {
                const formFilter = new FormFilter(defaultProps);
                defaultProps.setDateRange = jest.fn();
                const date = "09/28/2017",
                    isValidMonthRange = false;
                const expectedMessage = "Exceed 3 Months";

                const alertMock = jest.fn();
                window.alert = jest.fn().mockImplementationOnce(alertMock);

                const dateRange = formFilter._renderDateRange();
                dateRange.props.onChange(date, isValidMonthRange);

                expect(alertMock).toHaveBeenCalledWith(expectedMessage);

                window.alert = originalWindowAlert;
            })
        })

        describe('ConvertAll checkbox', () => {
            it(' fired click event - props.changeConvertAll should be called with correct parameter', () => {
                const formFilter = renderer.create(<FormFilter {...defaultProps} />);

                const checkBox = formFilter.root.findByProps({ id: 'IsConvertAll'});

                checkBox.props.onChange();

                expect(defaultProps.changeConvertAll).toHaveBeenCalledWith(true);
            })
        })

        describe('IncludeDrawData checkbox', () => {
            it('fired click event - props.includeDrawData should be called with correct parameter', () => {
                const formFilter = renderer.create(<FormFilter {...defaultProps} />);
                const checkBox = formFilter.root.findByProps({ id: 'IncludeDrawData'});        

                checkBox.props.onChange();

                expect(defaultProps.changeIncludeDrawData).toHaveBeenCalledWith(false);
            })
        })

        describe('ExcludeTest checkbox', () => {
            it('fired click event - props.isExcludeTest should be called with correct parameter', () => {
                const formFilter = renderer.create(<FormFilter {...defaultProps} />);
                const checkBox = formFilter.root.findByProps({ id: 'ExcludeTest'});  

                checkBox.props.onChange();

                expect(defaultProps.changeIsExcludeTest).toHaveBeenCalledWith(false);
            })
        })

        describe('isValidModel', () => {
            it('selectedSubsidiary and selectedProduct is not empty - return true', () => {
                const formFilter = new FormFilter(defaultProps);

                const result = formFilter.isValidModel;

                expect(result).toBeTruthy();
            })

            it('selectedSubsidiary is empty - return false', () => {
                const props = { ...defaultProps, selectedSubsidiary: "" };
                const formFilter = new FormFilter(props);

                const result = formFilter.isValidModel;

                expect(result).toBeFalsy();
            })

            it('selectedProduct is empty - return false', () => {
                const props = { ...defaultProps, selectedProduct: "" };
                const formFilter = new FormFilter(props);

                const result = formFilter.isValidModel;

                expect(result).toBeFalsy();
            })
        })

        describe('submit data', () => {
            describe('_getParams', () => {
                it('filter data is invalid - return null', () => {
                    const props = { ...defaultProps, selectedProduct: "" };
                    const formFilter = new FormFilter(props);

                    const result = formFilter._getParams();

                    expect(result).toBeNull();
                })

                it('filter data is valid - return correct param data', () => {
                    const formFilter = new FormFilter(defaultProps);

                    const result = formFilter._getParams();

                    expect(result.BaseCurrency).toEqual(defaultProps.selectedBaseCurrency);
                    expect(result.SubsidiaryList).toEqual(defaultProps.selectedSubsidiary);
                    expect(result.ProductCodeList).toEqual(defaultProps.selectedProduct);
                    expect(result.ConvertAll).toEqual(defaultProps.convertAll);
                    expect(result.FromDate).toEqual(defaultProps.dateRange.fromDate);
                    expect(result.ToDate).toEqual(defaultProps.dateRange.toDate);
                    expect(result.IncludeRaw).toEqual(defaultProps.includeDrawData);
                    expect(result.IsExcludeTest).toEqual(defaultProps.isExcludeTest);
                    expect(result.Level).toEqual(ReportLevel.MAIN);
                })
            })

            describe('submit', () => {
                const event = { preventDefault: jest.fn() };
                it('_getParams return null - do nothing', () => {
                    const props = { ...defaultProps, selectedProduct: "" };
                    const formFilter = new FormFilter(props);

                    formFilter._getParams = jest.fn(() => null);
                    formFilter.props.toggleLoader = jest.fn();

                    formFilter.submit(event);

                    expect(formFilter.props.toggleLoader).not.toHaveBeenCalled();
                })

                it('props.setParams should be called with correct parameter', () => {
                    const props = defaultProps;
                    const formFilter = new FormFilter(props);
                    const params = {};

                    formFilter._getParams = jest.fn(() => { return params; });

                    formFilter.submit(event);

                    expect(formFilter.props.setParams).toHaveBeenCalledWith(params);
                })
            })

            describe('exportExcel', () => {
                const event = { preventDefault: jest.fn() };
                const fakeReportTitle = "Report Title";

                beforeEach(() => {
                    Service.getReportTitle = jest.fn(() => fakeReportTitle);
                    Service.showErrorMsg = jest.fn();
                })

                afterEach(() => {
                    ReportExcel.mockReset();
                    Service.getReportTitle.mockReset();
                })

                it('_getParams return null - do nothing', () => {
                    const props = { params: { Level: ReportLevel.MAIN } };
                    const formFilter = new FormFilter(props);

                    formFilter._getParams = jest.fn(() => null);
                    formFilter.props.exportExcel = jest.fn();

                    formFilter.exportExcel(event);

                    expect(formFilter.props.exportExcel).not.toHaveBeenCalled();
                })

                describe('_getParams return data ', () => {
                    const fakeResponse = { data: { Data: [1, 2] } };
                    const props = { params: { Level: ReportLevel.CUSTOMER, BaseCurrency: 'USD' }, xsrfToken: 'token', toggleLoader: jest.fn() };
                    let formFilter;

                    beforeEach(() => {
                        formFilter = new FormFilter(props);
                        formFilter._getParams = jest.fn(() => { return {} });
                    })

                    it('action return promise - Report.fetchGridData should be called with correct parameter', () => {
                        const expectedParams = {};
                        Report.fetchGridData = jest.fn(() => Promise.resolve({}));

                        formFilter.exportExcel(event);

                        expect(Report.fetchGridData).toHaveBeenCalledWith(Api.DetailUrl, { xsrfToken: props.xsrfToken, data: props.params  });
                    })

                    it('action return promise - Excel class should be instantiated with correct parameter', () => {
                        const reportExcelMock = jest.fn();
                        ReportExcel.mockImplementation(reportExcelMock);
                        Report.fetchGridData = jest.fn(() => Promise.resolve(fakeResponse));

                        formFilter.exportExcel(event);

                        Promise.resolve().then(() => {
                            expect(reportExcelMock).toHaveBeenCalledWith(fakeResponse.data, fakeReportTitle, true, props.params.BaseCurrency);
                        })
                    })

                    it('action return promise - export method of Excel class should be called', () => {
                        const exportFnMock = jest.fn((callback) => callback());
                        ReportExcel.mockImplementation(() => {
                            return {
                                export: exportFnMock
                            }
                        });
                        Report.fetchGridData = jest.fn(() => Promise.resolve(fakeResponse));

                        formFilter.exportExcel(event);

                        Promise.resolve().then(() => {
                            expect(exportFnMock.mock.calls.length).toBe(1);
                            expect(props.toggleLoader).toHaveBeenCalledWith(false);
                        })
                    })

                    it('action return promise - no data - window.alert should be called with correct parameter', () => {
                        Report.fetchGridData = jest.fn(() => Promise.resolve({ data: { Data: [] } }));

                        window.alert = jest.fn();
                        formFilter.exportExcel(event);

                        Promise.resolve().then(() => {
                            expect(window.alert).toHaveBeenCalledWith("NoInfo");
                            expect(Service.getReportTitle).not.toHaveBeenCalled();

                            window.alert = originalWindowAlert;
                        })
                    })

                    it('get data failed - export data with correct parameter', () => {
                        Report.fetchGridData = jest.fn(() => Promise.reject('error'));
                        
                        formFilter.exportExcel(event);

                        Promise.reject().then().catch((e) => {
                            expect(Service.showErrorMsg).toHaveBeenCalled();
                            expect(props.toggleLoader).toHaveBeenCalledWith(false);
                        });
                    })
                })           
            })
        })
    })
})