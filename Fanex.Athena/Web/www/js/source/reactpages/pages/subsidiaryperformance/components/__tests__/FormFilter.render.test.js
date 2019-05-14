import React from 'react';
import { FormFilter } from '../FormFilter';
import renderer from 'react-test-renderer';
import ShallowRenderer from 'react-test-renderer/shallow';

import LangHelper from '@jsroot/lib/langHelper';
import AppData from '@jsroot/lib/AppData';
import { Service } from '../../lib/service';

import { defaultProps, defaultAppData } from './fakeData';

const { subsidiaryList, productOptions, baseCurrencyList, selectedBaseCurrency, dateRange, dateConstraint } = defaultProps;
const formFilterPropsForRender = { productOptions, baseCurrencyList, selectedBaseCurrency, dateRange };

const multipleSelectComponentPath = '@9softstudio/react-multiselect';
const dateRangeComponentPath = '@jsroot/components/date-range/index';

jest.mock('@jsroot/lib/AppData');

describe('FormFilter ', () => {
    beforeEach(() => {
        Object.assign(AppData, defaultAppData);
        LangHelper.getSingleResource = jest.fn((resource) => resource);
        Service.getReportTitle = jest.fn(() => "Report Title");
    })
    afterEach(() => {
        jest.resetAllMocks();
    })

    describe('render methods', () => {
        beforeAll(() => {
            jest.mock(multipleSelectComponentPath, (props) => (<div {...props}>MultipleSelect</div>));
        })

        afterAll(() => {
            jest.unmock(multipleSelectComponentPath);
        })

        describe('render MultipleSelect components', () => {
            it("_renderSubsidiarySelectList - MultipleSelect props should be correct", () => {
                const formFilter = new FormFilter(formFilterPropsForRender);
                const multipleSelectComponent = formFilter._renderSubsidiarySelectList();

                const expectedResult = {
                    language: "en-US",
                    dataSource: defaultAppData.subsidiaryList,
                    keyField: "Name",
                    valueField: "Name",
                    statusField: "Checked"
                }

                const { language, dataSource, keyField, valueField, statusField} = multipleSelectComponent.props;
                const result = { language, dataSource, keyField, valueField, statusField };

                expect(result).toEqual(expectedResult);
            });

            it("_renderProductSelectList - MultipleSelect props should be correct", () => {
                const formFilter = new FormFilter(formFilterPropsForRender);
                const multipleSelectComponent = formFilter._renderProductSelectList();

                const expectedResult = {
                    language: "en-US",
                    dataSource: defaultAppData.productOptions,
                    keyField: "Code",
                    valueField: "Name",
                    statusField: "Status"
                }

                const { language, dataSource, keyField, valueField, statusField} = multipleSelectComponent.props;
                const result = { language, dataSource, keyField, valueField, statusField };

                expect(result).toEqual(expectedResult);
            });
        })

        describe('Based Currency filter', () => {
            beforeAll(() => {
                jest.mock('react-select', (props) => (<div {...props}>Based Currency Select</div>));
            })
            afterAll(() => {
                jest.unmock('react-select');
            })

            it('_renderBaseCurrencySelectList - component props should be correct', () => {
                const expectedResult = {
                    value: formFilterPropsForRender.selectedBaseCurrency,
                    options: AppData.baseCurrencyList
                }
                const formFilter = new FormFilter(formFilterPropsForRender);
                const baseCurrency = formFilter._renderBaseCurrencySelectList();

                const { value, options } = baseCurrency.props;
                const result = { value, options };

                expect(result).toEqual(expectedResult);
            })

            it("_renderBaseCurrencySelectList - baseCurrencyList is empty - return null", () => {
                AppData.baseCurrencyList = [];
                const formFilter = new FormFilter(formFilterPropsForRender);
                const multipleSelectComponent = formFilter._renderBaseCurrencySelectList();

                expect(multipleSelectComponent).toBe(0);
            });
        })

        describe('Date Range filter', () => {
            beforeAll(() => {
                jest.mock(dateRangeComponentPath, (props) => (<div {...props}>Based Currency Select</div>));
            })
            afterAll(() => {
                jest.unmock(dateRangeComponentPath);
            })

            it('_renderDateRange - component props should be correct', () => {
                const expectedResult = {
                    startDate: formFilterPropsForRender.dateRange.fromDate,
                    endDate: formFilterPropsForRender.dateRange.toDate,
                    minDate: defaultAppData.dateConstraint.minDate,
                    maxDate: defaultAppData.dateConstraint.maxDate,
                    limitedMonthRange: 3
                }

                const formFilter = new FormFilter(formFilterPropsForRender);
                const dateRange = formFilter._renderDateRange();

                const { startDate, endDate, minDate, maxDate, limitedMonthRange } = dateRange.props;
                const result = { startDate, endDate, minDate, maxDate, limitedMonthRange };

                expect(result).toEqual(expectedResult);
            })
        })

        describe('render whole component', () => {
            it('match to snapshot', () => {
                const props = Object.assign({}, formFilterPropsForRender, { convertAll: false });
                const renderer = new ShallowRenderer();
                const result = renderer.render(<FormFilter {...props}/>);

                expect(result).toMatchSnapshot();
            })
        })
    })
})