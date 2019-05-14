import React from 'react';
import { FormFilter } from '../FormFilter';
import AppData from '@jsroot/lib/AppData';
import LangHelper from '@jsroot/lib/langHelper';
import DataService from '@jsroot/lib/DataService.js';
import ApiUrl from '../../../common/constants/apiUrl';
import Site from '@jsroot/lib/site';
import Service from '../../../common/lib/Service';
import renderer from 'react-test-renderer';
import Select from 'react-select';
import AutoComplete from '@jsroot/components/auto-complete';

jest.mock('@jsroot/lib/AppData');

const DateRange = { fromDate: '06/01/2018', toDate: '07/27/2018'};

describe('FormFilter ', () => {
    beforeAll(() => {
        LangHelper.getSingleResource = jest.fn((resource) => resource);
        Object.assign(AppData, 
            { 
                statusList: ["Win", "Lose", "Draw"],
                platformList: ["Asia", "China", "US"],
                liveStatusList: [{"Id":0,"Value":"Non-Live","Status":true}],
                productOptions: ["SB", "BA"],
                baseCurrencyList: ['EUR'],
                dateConstraint: { minDate: '06/01/2012', maxDate: '07/27/2018', limitedMonthRange: 3 }
            });
    });

    describe('isValidModel ', () => {
        it('selectedProduct is empty - return false' ,() => {
            const props = { selectedProduct: '' };

            const filter = new FormFilter(props);

            expect(filter.isValidModel).toBe(false);
        });

        it('required filter not empty - return true' ,() => {
            const props = { username: 'abc', selectedProduct: '123', selectedStatus: 'test', selectedLiveStatus: '34' };

            const filter = new FormFilter(props);

            expect(filter.isValidModel).toBe(true);
        });
    })

    describe('submit ', () => {
        it('parameter is null - do nothing' ,() => {
            const event = { preventDefault: jest.fn() };

            const props = { toggleLoader: jest.fn() };
            const filter = new FormFilter(props);
            filter._getParams = jest.fn(() => null);

            filter.submit(event);

            expect(props.toggleLoader).not.toHaveBeenCalled();
        });

        it('parameter is valid - update store' ,() => {
            const event = { preventDefault: jest.fn() };

            const title = 'title';
            Service.getTitle = jest.fn(() => title);

            const props = { 
                toggleLoader: jest.fn(),
                setReportTitle: jest.fn(),
                setRequestParam: jest.fn(),
                getGridData: jest.fn()
            };
            const filter = new FormFilter(props);
            
            var params = { refno: '123', BaseCurrency: 'USD' }
            filter._getParams = jest.fn(() => params);

            filter.submit(event);

            expect(props.setReportTitle).toHaveBeenCalledWith(title);
            expect(props.setRequestParam).toHaveBeenCalledWith(params);
            expect(props.toggleLoader).toHaveBeenCalledWith(true);
            expect(props.getGridData).toHaveBeenCalledWith(ApiUrl.SINGLECUSTOMER_DATA_URL, params);
        });
    })

    describe('exportExcel ', () => {
        it('parameter is null - do nothing' ,() => {
            const event = { preventDefault: jest.fn() };

            const props = { toggleLoader: jest.fn() };
            const filter = new FormFilter(props);
            filter._getParams = jest.fn(() => null);

            filter.exportExcel(event);

            expect(props.toggleLoader).not.toHaveBeenCalled();
        });

        it('parameter is valid - call service to download excel file' ,() => {
            const event = { preventDefault: jest.fn() };

            const response = { data: 'excel' };
            const promise = Promise.resolve(response);
            DataService.getFile = jest.fn(() => promise);
            Site.downloadFile = jest.fn();

            const props = { toggleLoader: jest.fn() };
            const filter = new FormFilter(props);
            
            var params = { }
            filter._getParams = jest.fn(() => params);

            filter.exportExcel(event);

            expect(params.IsExport).toBe(true);
            expect(props.toggleLoader).toHaveBeenCalledWith(true);
            expect(DataService.getFile).toHaveBeenCalledWith(ApiUrl.SINGLECUSTOMER_DATA_URL, params);
            Promise.resolve().then(() => {
                expect(Site.downloadFile).toHaveBeenCalledWith(response.data, 'BettingTicketsCenter_SingleCustomer.xls');
                expect(props.toggleLoader).toHaveBeenCalledWith(false);
            })
        });
    })

    describe('_getParams ', () => {
        it('model is invalid - return null' ,() => {
            const props = { dateRange: DateRange, requestParam: {}, selectedCurrency: {} };

            const filter = new FormFilter(props);

            expect(filter._getParams()).toBe(null);
        });

        it('model is valid - return correct result' ,() => {
            const props = {
                isConvertAll: true,
                selectedProduct: "BA,SB",
                dateRange: DateRange,
                requestParam: {
                    PageSize: 1,
                    SortBy: 'col1',
                    SortOrder: 'asc'
                },
                username: "tester",
                selectedBaseCurrency: 'USD',
                selectedStatus: "All",
                selectedLiveStatus: "Live",
                selectedPlatform: "EU"
            };

            const expected = {
                ProductCodeList: props.selectedProduct,
                FromDate: Site.convertDateToString(DateRange.fromDate),
                ToDate: Site.convertDateToString(DateRange.toDate),
                PageSize: props.requestParam.PageSize,
                PageIndex: 1,
                Username: props.username,
                BaseCurrency: props.selectedBaseCurrency,
                Status: props.selectedStatus,
                LiveStatus: props.selectedLiveStatus,
                Platform: props.selectedPlatform,
                SortBy: props.requestParam.SortBy,
                SortOrder: props.requestParam.SortOrder
            }

            const filter = new FormFilter(props);

            expect(filter._getParams()).toEqual(expected);
        });
    })

    describe('_renderBaseCurrencySelectList ', () => {
        it('onChange - update setSelectedBaseCurrency' ,() => {
            const props = { selectedBaseCurrency: 'EUR', setSelectedBaseCurrency: jest.fn() };

            const filter = new FormFilter(props);
            const selectComponent = renderer.create(filter._renderBaseCurrencySelectList());

            const newValue = { value: 'USD' }
            const selectedInstance = selectComponent.root.findByType(Select);
            selectedInstance.props.onChange(newValue);

            expect(props.setSelectedBaseCurrency).toHaveBeenCalledWith(newValue.value);
        });
    })

    describe('_renderDateRange', () => {
        it('component props should be correct', () => {
            const props = { dateRange: DateRange, setDateRange: jest.fn() };
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
            const props = { dateRange: DateRange, setDateRange: jest.fn() };
            const formFilter = new FormFilter(props);
            const expecteMessage = 'DateRangeExceedMsg';

            const dateRange = formFilter._renderDateRange();
            dateRange.props.onChange({}, false);

            expect(window.alert).toHaveBeenCalledWith(expecteMessage);
        })

        it('onChange - is valid month range - change date range state', () => {
            const props = { dateRange: DateRange, setDateRange: jest.fn() };
            const formFilter = new FormFilter(props);
            const newDate = { fromDate: '02/02/2017', toDate: '12/12/2017' };

            const dateRange = formFilter._renderDateRange();
            dateRange.props.onChange(newDate);

            expect(props.setDateRange).toHaveBeenCalledWith(newDate);
        })
    })

    describe('Event handler ', () => {
        
        it('onChange in Product filter - setSelectedProduct should be called with correct parameter', () => {
            const props = {setSelectedProduct: jest.fn()};
            const formFilter = new FormFilter(props);
            
            const productFilter = formFilter._renderProductSelectList();
            productFilter.props.onChange({}, "SB,BA");

            expect(props.setSelectedProduct).toHaveBeenCalledWith("SB,BA");
        });

        it('onChange in Status filter - setSelectedStatus should be called with correct parameter', () => {
            const props = {setSelectedStatus: jest.fn()};
            const formFilter = new FormFilter(props);
            
            const selectList = formFilter._renderStatusSelectList();
            selectList.props.onChange("oldItem", "newItem");

            expect(props.setSelectedStatus).toHaveBeenCalledWith("newItem");
        });

        it('onChange in Platform filter - setSelectedStatus should be called with correct parameter', () => {
            const props = {setSelectedPlatform: jest.fn()};
            const formFilter = new FormFilter(props);
            
            const selectList = formFilter._renderPlatformSelectList();
            selectList.props.onChange({value: "123"});

            expect(props.setSelectedPlatform).toHaveBeenCalledWith("123");
        });

        it('onChange in LiveStatus filter - setSelectedLiveStatus should be called with correct parameter', () => {
            const props = {setSelectedLiveStatus: jest.fn()};
            const formFilter = new FormFilter(props);
            
            const selectList = formFilter._renderLiveStatusSelectList();
            selectList.props.onChange(null, "123");

            expect(props.setSelectedLiveStatus).toHaveBeenCalledWith("123");
        });

        it('onSelect AutoComplete input - update username' ,() => {
            const props = { username: 'abc', setUsername: jest.fn(), dateRange: DateRange, selectedCurrency: {} };

            const filter = new FormFilter(props);
            const component = renderer.create(filter.render());

            const newValue = 'xyz';
            const autoComplete = component.root.findByType(AutoComplete);
            autoComplete.props.onSelect(newValue);

            expect(props.setUsername).toHaveBeenCalledWith(newValue);
        });

        it('onInput AutoComplete input - update username' ,() => {
            const props = { username: 'abc', setUsername: jest.fn(), dateRange: DateRange, selectedCurrency: {} };

            const filter = new FormFilter(props);
            const component = renderer.create(filter.render());

            const newValue = 'xyz';
            const autoComplete = component.root.findByType(AutoComplete);
            autoComplete.props.onInput(newValue);

            expect(props.setUsername).toHaveBeenCalledWith(newValue);
        });

        it('onClick submit button - call submit method' ,() => {
            const props = { refno: '1', dateRange: DateRange, selectedCurrency: {} };

            const filter = new FormFilter(props);
            filter.submit = jest.fn();
            const component = renderer.create(filter.render());

            const button = component.root.findByProps({ className: 'btn btn-submit' });
            button.props.onClick();

            expect(filter.submit).toHaveBeenCalled();
        });

        it('onClick excel button - call exportExcel method' ,() => {
            const props = { refno: '1', dateRange: DateRange, selectedCurrency: {} };

            const filter = new FormFilter(props);
            filter.exportExcel = jest.fn();
            const component = renderer.create(filter.render());

            const button = component.root.findByProps({ className: 'icon-excel right' });
            button.props.onClick();

            expect(filter.exportExcel).toHaveBeenCalled();
        });
    })
});