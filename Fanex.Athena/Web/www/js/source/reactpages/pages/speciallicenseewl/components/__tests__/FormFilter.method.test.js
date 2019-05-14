import React from 'react';
import renderer from 'react-test-renderer';
import AppData from '@jsroot/lib/AppData';
import { FormFilter } from '../FormFilter';
import LangHelper from '@jsroot/lib/langHelper';
import Site from '@jsroot/lib/site';
import MonthPicker from '@jsroot/components/month-picker/index';
import { Service } from '../../lib/service';
import Report from '@jsroot/lib/report';
import ReportExcel from '../../lib/reportExcel';
import { defaultAppData, defaultFilterProps } from './TestData';

jest.mock('@jsroot/lib/AppData');
jest.mock('../../lib/reportExcel');

describe('FormFilter ', () => {
    beforeEach(() => {
        Object.assign(AppData, defaultAppData);
        LangHelper.getSingleResource = jest.fn((resource) => resource);
        Site.convertDateToString = jest.fn((date) => date);
        Service.showErrorMsg = jest.fn();
    })

    describe('isValidModel', () => {
        it('selectedProduct is empty - return false', () => {
            const props = { selectedProduct: '' };

            const formFilter = new FormFilter(props);
            
            expect(formFilter.isValidModel).toBe(false);
        })

        it('selectedProduct is not empty - return true', () => {
            const props = { selectedProduct: '1,2' };

            const formFilter = new FormFilter(props);
            
            expect(formFilter.isValidModel).toBe(true);
        })
    })

    describe('submit', () => {
        const event = { preventDefault: jest.fn() };

        it('invalid model - return', () => {
            const props = { selectedProduct: '' };

            const formFilter = new FormFilter(props);
            formFilter._getParams = jest.fn();

            formFilter.submit(event);
            
            expect(formFilter._getParams).not.toHaveBeenCalled();
        })

        it('params is null - return', () => {
            const props = { selectedProduct: '1,2', setParams: jest.fn() };

            const formFilter = new FormFilter(props);
            formFilter._getParams = jest.fn(() => { return null; });

            formFilter.submit(event);
            
            expect(formFilter._getParams).toHaveBeenCalled();
            expect(props.setParams).not.toHaveBeenCalled();
        })

        it('call successfully - update params', () => {
            const props = { selectedProduct: '1,2', setParams: jest.fn() };

            const formFilter = new FormFilter(props);
            formFilter._getParams = jest.fn(() => { return { id: 1 }; });

            formFilter.submit(event);
            
            expect(formFilter._getParams).toHaveBeenCalled();
            expect(props.setParams).toHaveBeenCalled();
        })
    })

    describe('exportExcel', () => {
        const event = { preventDefault: jest.fn() };
        const fakeResponse = { data: [] };
        const fakeReportLib = {
            then: (func) => { func(fakeResponse); return {catch: (func) => { func('Error'); }}; }
        }

        beforeEach(()=>{
            Report.fetchGridData = jest.fn(() => fakeReportLib);
        })

        afterEach(()=>{
            jest.resetAllMocks();
        })

        it('params is null - return', () => {
            const props = { toggleLoader: jest.fn() };

            const formFilter = new FormFilter(props);
            formFilter._getParams = jest.fn(() => { return null; });

            formFilter.exportExcel(event);

            expect(props.toggleLoader).not.toHaveBeenCalled();
        })

        it('get report data successfully - call _doExportExcel', () => {
            const props = { toggleLoader: jest.fn(), xsrfToken: '123' };
            const params = { id: 1 };

            const formFilter = new FormFilter(props);
            formFilter._getParams = jest.fn(() => { return params; });
            formFilter._doExportExcel = jest.fn();

            formFilter.exportExcel(event);

            expect(formFilter._doExportExcel).toHaveBeenCalledWith(params, fakeResponse.data);
        })

        it('get report data failed - show error', () => {
            const props = { toggleLoader: jest.fn(), xsrfToken: '123' };
            const params = { id: 1 };

            const formFilter = new FormFilter(props);
            formFilter._getParams = jest.fn(() => { return params; });
            formFilter._doExportExcel = jest.fn();

            formFilter.exportExcel(event);

            expect(Service.showErrorMsg).toHaveBeenCalled();
        })
    })

    describe('_doExportExcel', () => {
        const alert = window.alert;
        const exportFnMock = jest.fn((callback) => callback());

        beforeAll(()=>{
            window.alert = jest.fn();
            Service.sort = jest.fn();
            Service.getReportTitle = jest.fn();
        })

        beforeEach(()=>{
            ReportExcel.mockImplementation(() => {
                return {
                    export: exportFnMock
                }
            });
        })

        afterEach(()=>{
            exportFnMock.mockReset();
            window.alert = alert;
        })

        it('data is empty - alert', () => {
            const props = { toggleLoader: jest.fn() };

            const formFilter = new FormFilter(props);
            const gridData = { Data: [] };

            formFilter._doExportExcel({}, gridData);

            expect(window.alert).toHaveBeenCalledWith('NoInfo');
        })

        it('data has more than 1 item - sort data', () => {
            const props = { toggleLoader: jest.fn() };
            const gridData = { Data: [{ Id: 1 }, { Id: 2 }] };
            const params = { SortBy: 'col1', SortOrder: 'asc' }        
            
            const formFilter = new FormFilter(props); 
            formFilter._doExportExcel(params, gridData);

            expect(Service.sort).toHaveBeenCalledWith(gridData.Data, params.SortBy, params.SortOrder);
        })

        it('action return promise - export method of Excel class should be called', () => {
            const fakeResponse = { data: { Data: [1, 2] } };
            Report.fetchGridData = jest.fn(() => Promise.resolve(fakeResponse));

            const props = { toggleLoader: jest.fn() };
            
            const formFilter = new FormFilter(props);
            formFilter._getParams = jest.fn(() => { return { Id: 1 }; });
            formFilter.exportExcel({ preventDefault: jest.fn() });

            Promise.resolve().then(() => {
                expect(exportFnMock.mock.calls.length).toBe(1);
            })
        })

        it('data is not empty - call export function', () => {
            const props = { toggleLoader: jest.fn() };
            const gridData = { Data: [{ Id: 1 }] };
            const params = { SortBy: 'col1', SortOrder: 'asc' }        
            
            const formFilter = new FormFilter(props); 
            formFilter._doExportExcel(params, gridData);

            expect(exportFnMock).toHaveBeenCalled();
        })
    })

    describe('_getParams', () => {
        it('xsrfToken is null - return null', () => {
            const props = { xsrfToken: null };

            const formFilter = new FormFilter(props);
            const result = formFilter._getParams();
       
            expect(result).toBe(null);
        })

        it('when call - return correct data', () => {
            const props = Object.assign({}, defaultFilterProps, { params: { SortBy: 'col1', SortOrder: 'asc' } });

            const formFilter = new FormFilter(props);
            const result = formFilter._getParams();
            
            expect(result.FromDate).toEqual(props.dateRange.fromDate);
            expect(result.ToDate).toEqual(props.dateRange.toDate);
            expect(result.CurrencyName).toEqual(props.selectedCurrency.label);
            expect(result.CurrencyId).toEqual(props.selectedCurrency.value);
            expect(result.BaseCurrency).toEqual(props.selectedCurrency.baseCurrency);
            expect(result.ProductCodeList).toEqual(props.selectedProduct.split(','));
            expect(result.ReportBy).toEqual(props.selectedReportBy);
            expect(result.SortBy).toEqual(props.params.SortBy);
            expect(result.SortOrder).toEqual(props.params.SortOrder);
        })
    })

    describe('productChangeHandler', () => {
        it('when product is changed - update data for props', () => {
            const props = Object.assign({}, defaultFilterProps, { setSelectedProduct: jest.fn() });

            const formFilter = renderer.create(<FormFilter {...props} />);
            const product = formFilter.root.findByProps({ id: 'ProductList'});
            const selectedProduct = 'p2';     

            product.props.onChange(1, selectedProduct);
       
            expect(props.setSelectedProduct).toHaveBeenCalledWith(selectedProduct);
        })
    })

    describe('_monthPickerHandle', () => {
        it('when month is changed - update data for props', () => {
            const props = Object.assign({}, defaultFilterProps, { setDateRange: jest.fn() });

            const formFilter = renderer.create(<FormFilter {...props} />);
            const month = formFilter.root.findByType(MonthPicker);
            const dateRange = { fromDate: '01/02/2018', toDate: '01/03/2018' };     

            month.props.onChange(dateRange);
       
            expect(props.setDateRange).toHaveBeenCalledWith(dateRange);
        })
    })
    
    describe('ReportByOptionHandle', () => {
        it('when ReportByOption is changed - update data for props', () => {
            const props = Object.assign({}, defaultFilterProps, { setSelectedReportBy: jest.fn() });

            const formFilter = renderer.create(<FormFilter {...props} />);
            const reportBy_0 = formFilter.root.findByProps({ id: 'ReportBy0' });
            const event = { target: { value: props.reportByList[0].value } };

            reportBy_0.props.onChange(event);
       
            expect(props.setSelectedReportBy).toHaveBeenCalledWith(event.target.value);
        })
    })

    describe('CurrencySelectListHandle', () => {
        it('when Currency is changed - update data for props', () => {
            const props = Object.assign({}, defaultFilterProps, { setSelectedCurrency: jest.fn() });

            const formFilter = renderer.create(<FormFilter {...props} />);
            const currency = formFilter.root.findByProps({ instanceId: 'ddlCurrency' });
            const selectedCurrency = { value: 'c3', label: 'cur 3' };

            currency.props.onChange(selectedCurrency);
       
            expect(props.setSelectedCurrency).toHaveBeenCalledWith(selectedCurrency);
        })
    })
    
})