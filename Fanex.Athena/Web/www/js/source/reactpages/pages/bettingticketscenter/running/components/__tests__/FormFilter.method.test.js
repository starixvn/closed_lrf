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
import CheckBox from '@jsroot/components/CheckBox';

jest.mock('@jsroot/lib/AppData');

const CurrencyId = 111;
const CurrencyName = "ABC";

describe('FormFilter ', () => {
    beforeAll(() => {
        LangHelper.getSingleResource = jest.fn((resource) => resource);
        Object.assign(AppData, 
            { 
                productOptions: ["SB", "BA"],
                baseCurrencyList: ['EUR'],
                currencyList: [{Id: CurrencyId, Value: CurrencyName}]
            });
    });

    describe('isValidModel ', () => {
        it('selectedProduct is empty - return false' ,() => {
            const props = { selectedProduct: '' };

            const filter = new FormFilter(props);

            expect(filter.isValidModel).toBe(false);
        });

        it('selectedProduct, selectedStatus, selectedCurrency are not empty - return true' ,() => {
            const props = { selectedProduct: '123', selectedStatus: '1', selectedCurrency: '1' };

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
            expect(props.getGridData).toHaveBeenCalledWith(ApiUrl.RUNNING_DATA_URL, params);
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
            expect(DataService.getFile).toHaveBeenCalledWith(ApiUrl.RUNNING_DATA_URL, params);
            Promise.resolve().then(() => {
                expect(Site.downloadFile).toHaveBeenCalledWith(response.data, 'BettingTicketsCenter_Running.xls');
                expect(props.toggleLoader).toHaveBeenCalledWith(false);
            })
        });
    })

    describe('_getParams ', () => {
        it('model is invalid - return null' ,() => {
            const props = { requestParam: {}, selectedCurrency: {} };

            const filter = new FormFilter(props);

            expect(filter._getParams()).toBe(null);
        });

        it('model is valid - return correct result' ,() => {
            const props = {
                selectedProduct: "BA,SB",
                selectedStatus: '1',
                selectedCurrency: {value: 1, label: "abc"},
                requestParam: {
                    PageSize: 1,
                    SortBy: 'col1',
                    SortOrder: 'asc'
                },
                username: "tester",
                selectedBaseCurrency: 'USD',
                isConvertAll: true
            };

            const expected = {
                ProductCodeList: props.selectedProduct,
                PageSize: props.requestParam.PageSize,
                PageIndex: 1,
                Username: props.username,
                CurrencyIdList: props.selectedCurrency,
                BaseCurrency: props.selectedBaseCurrency,
                Status: '1',
                SortBy: props.requestParam.SortBy,
                SortOrder: props.requestParam.SortOrder,
                IsConvertAll: props.isConvertAll
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

    describe('Event handler ', () => {
        
        it('onChange in Product filter - setSelectedProduct should be called with correct parameter', () => {
            const props = {setSelectedProduct: jest.fn()};
            const formFilter = new FormFilter(props);
            
            const productFilter = formFilter._renderProductSelectList();
            productFilter.props.onChange({}, "SB,BA");

            expect(props.setSelectedProduct).toHaveBeenCalledWith("SB,BA");
        })

        it('onSelect AutoComplete input - update username' ,() => {
            const props = { username: 'abc', setUsername: jest.fn(), selectedCurrency: {} };

            const filter = new FormFilter(props);
            const component = renderer.create(filter.render());

            const newValue = 'xyz';
            const autoComplete = component.root.findByType(AutoComplete);
            autoComplete.props.onSelect(newValue);

            expect(props.setUsername).toHaveBeenCalledWith(newValue);
        });

        it('onInput AutoComplete input - update username' ,() => {
            const props = { username: 'abc', setUsername: jest.fn(), selectedCurrency: {} };

            const filter = new FormFilter(props);
            const component = renderer.create(filter.render());

            const newValue = 'xyz';
            const autoComplete = component.root.findByType(AutoComplete);
            autoComplete.props.onInput(newValue);

            expect(props.setUsername).toHaveBeenCalledWith(newValue);
        });

        it('onChangeCurrency - select item "All" - update currency and base currency' ,() => {
            const props = { 
                selectedCurrency: {},
                selectedBaseCurrency: 'EUR', 
                setSelectedCurrency: jest.fn(), 
                setSelectedBaseCurrency: jest.fn()};

            const filter = new FormFilter(props);
            const component = renderer.create(filter.render());
            const currencyIdList = CurrencyId + ",222";

            filter._onChangeCurrency(currencyIdList);

            expect(props.setSelectedCurrency).toHaveBeenCalledWith(currencyIdList);
            expect(props.setSelectedBaseCurrency).toHaveBeenCalledWith('EUR');
        });

        it('_onChangeCurrency - select item "ABC" - update currency and base currency' ,() => {
            const props = { 
                selectedCurrency: {},
                selectedBaseCurrency: 'EUR', 
                setSelectedCurrency: jest.fn(), 
                setSelectedBaseCurrency: jest.fn()};

            const filter = new FormFilter(props);
            const component = renderer.create(filter.render());
            const currencyIdList = CurrencyId.toString();
            filter._onChangeCurrency(currencyIdList);

            expect(props.setSelectedCurrency).toHaveBeenCalledWith(currencyIdList);
            expect(props.setSelectedBaseCurrency).toHaveBeenCalledWith(CurrencyName);
        });

        it('onChange Convert All check box - update value' ,() => {
            const props = { isConvertAll: false, changeIsConvertAll: jest.fn() };

            const filter = new FormFilter(props);
            const component = renderer.create(filter.render());

            const newValue = true;
            const checkBox = component.root.findByType(CheckBox);
            checkBox.props.onChange(newValue);

            expect(props.changeIsConvertAll).toHaveBeenCalledWith(newValue);
        });

        it('onClick submit button - call submit method' ,() => {
            const props = { refno: '1', selectedCurrency: {} };

            const filter = new FormFilter(props);
            filter.submit = jest.fn();
            const component = renderer.create(filter.render());

            const button = component.root.findByProps({ className: 'btn btn-submit' });
            button.props.onClick();

            expect(filter.submit).toHaveBeenCalled();
        });

        it('onClick excel button - call exportExcel method' ,() => {
            const props = { refno: '1', selectedCurrency: {} };

            const filter = new FormFilter(props);
            filter.exportExcel = jest.fn();
            const component = renderer.create(filter.render());

            const button = component.root.findByProps({ className: 'icon-excel right' });
            button.props.onClick();

            expect(filter.exportExcel).toHaveBeenCalled();
        });
    })
});