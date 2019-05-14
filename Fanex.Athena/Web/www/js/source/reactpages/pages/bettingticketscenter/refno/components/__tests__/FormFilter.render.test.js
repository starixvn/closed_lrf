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

describe('FormFilter ', () => {
    beforeAll(() => {
        LangHelper.getSingleResource = jest.fn((resource) => resource);
        Object.assign(AppData, { baseCurrencyList: ['EUR'] });
    });

    describe('isValidModel ', () => {
        it('refno is empty - return false' ,() => {
            const props = { refno: '' };

            const filter = new FormFilter(props);

            expect(filter.isValidModel).toBe(false);
        });

        it('refno is not empty - return true' ,() => {
            const props = { refno: '123' };

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
            expect(props.getGridData).toHaveBeenCalledWith(ApiUrl.REFNO_DATA_URL, params);
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
            
            var params = { refno: '123' }
            filter._getParams = jest.fn(() => params);

            filter.exportExcel(event);

            expect(params.IsExport).toBe(true);
            expect(props.toggleLoader).toHaveBeenCalledWith(true);
            expect(DataService.getFile).toHaveBeenCalledWith(ApiUrl.REFNO_DATA_URL, params);
            Promise.resolve().then(() => {
                expect(Site.downloadFile).toHaveBeenCalledWith(response.data, 'BettingTicketsCenter_RefNo.xls');
                expect(props.toggleLoader).toHaveBeenCalledWith(false);
            })
        });
    })

    describe('_getParams ', () => {
        it('model is invalid - return null' ,() => {
            const props = { refno: '' };

            const filter = new FormFilter(props);

            expect(filter._getParams()).toBe(null);
        });

        it('model is valid - is convert all - return correct base currency' ,() => {
            const props = {
                refno: '123',
                requestParam: {
                    PageSize: 1,
                    SortBy: 'col1',
                    SortOrder: 'asc'
                },
                username: 'abc',
                isConvertAll: true,
                selectedBaseCurrency: 'USD',
            };

            const expected = {
                PageSize: props.requestParam.PageSize,
                PageIndex: 1,
                Refno: props.refno,
                Username: props.username,
                BaseCurrency: props.selectedBaseCurrency,
                IsConvertAll: props.isConvertAll,
                SortBy: props.requestParam.SortBy,
                SortOrder: props.requestParam.SortOrder
            }

            const filter = new FormFilter(props);

            expect(filter._getParams()).toEqual(expected);
        });

        it('model is valid - is not convert all - return empty base currency' ,() => {
            const props = {
                refno: '123',
                requestParam: {
                    PageSize: 1,
                    SortBy: 'col1',
                    SortOrder: 'asc'
                },
                username: 'abc',
                isConvertAll: false,
                selectedBaseCurrency: 'USD',
            };

            const expected = {
                PageSize: props.requestParam.PageSize,
                PageIndex: 1,
                Refno: props.refno,
                Username: props.username,
                BaseCurrency: '',
                IsConvertAll: props.isConvertAll,
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

    describe('render ', () => {
        it('onChange refno input - update setRefno' ,() => {
            const props = { refno: '123', setRefno: jest.fn() };

            const filter = new FormFilter(props);
            const component = renderer.create(filter.render());

            const newValue = { target: { value: '456' } };
            const refno = component.root.findByProps({ id: 'RefNo' });
            refno.props.onChange(newValue);

            expect(props.setRefno).toHaveBeenCalledWith(newValue.target.value);
        });

        it('onSelect AutoComplete input - update username' ,() => {
            const props = { username: 'abc', setUsername: jest.fn() };

            const filter = new FormFilter(props);
            const component = renderer.create(filter.render());

            const newValue = 'xyz';
            const autoComplete = component.root.findByType(AutoComplete);
            autoComplete.props.onSelect(newValue);

            expect(props.setUsername).toHaveBeenCalledWith(newValue);
        });

        it('onInput AutoComplete input - update username' ,() => {
            const props = { username: 'abc', setUsername: jest.fn() };

            const filter = new FormFilter(props);
            const component = renderer.create(filter.render());

            const newValue = 'xyz';
            const autoComplete = component.root.findByType(AutoComplete);
            autoComplete.props.onInput(newValue);

            expect(props.setUsername).toHaveBeenCalledWith(newValue);
        });

        it('onChange IsConvertAll check box - update IsConvertAll' ,() => {
            const props = { isConvertAll: false, changeIsConvertAll: jest.fn() };

            const filter = new FormFilter(props);
            const component = renderer.create(filter.render());

            const newValue = true;
            const isConvertAll = component.root.findByProps({ id: 'IsConvertAll' });
            isConvertAll.props.onChange(newValue);

            expect(props.changeIsConvertAll).toHaveBeenCalledWith(newValue);
        });

        it('onClick submit button - call submit method' ,() => {
            const props = { refno: '1' };

            const filter = new FormFilter(props);
            filter.submit = jest.fn();
            const component = renderer.create(filter.render());

            const button = component.root.findByProps({ className: 'btn btn-submit' });
            button.props.onClick();

            expect(filter.submit).toHaveBeenCalled();
        });

        it('onClick excel button - call exportExcel method' ,() => {
            const props = { refno: '1' };

            const filter = new FormFilter(props);
            filter.exportExcel = jest.fn();
            const component = renderer.create(filter.render());

            const button = component.root.findByProps({ className: 'icon-excel right' });
            button.props.onClick();

            expect(filter.exportExcel).toHaveBeenCalled();
        });
    })
});