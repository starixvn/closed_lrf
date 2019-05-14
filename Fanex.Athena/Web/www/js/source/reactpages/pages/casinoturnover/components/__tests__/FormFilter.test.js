import React from 'react'
import { FormFilter } from '../FormFilter';
import LangHelper from '@jsroot/lib/langHelper';
import Site from '@jsroot/lib/site';
import { Service } from '../../lib/service';
import ReportExcel from '../../lib/reportExcel';
import DataService from '@jsroot/lib/DataService.js';
import Renderer from 'react-test-renderer';
import ShallowRenderer from 'react-test-renderer/shallow';
import AppData from '@jsroot/lib/AppData';

jest.mock('@jsroot/lib/AppData');
jest.mock('../../lib/reportExcel');

const EXCEL_DATA_URL = "/api/CasinoTurnoverReport/GetData";
const URL = "/api/CasinoTurnoverReport/GetData";

describe('FormFilter ', () => {
    beforeAll(() => {
        LangHelper.getSingleResource = jest.fn(text => text);
        Site.convertDateToString = jest.fn(date => date);
        Service.getReportTitle = jest.fn();
    });

    describe('render', () => {
        it('render with correct props', () => {
            Object.assign(AppData, {
                dateConstraint: { maxDate: '01/01/2010', minDate: '10/10/2030' },
                currencyList: [{value: 0, label: 'All'}, {value: 1, label: 'C1'}, {value: 2, label: 'C2'}],     
                baseCurrencyList: [{value: 'EUR', label: 'EUR'}, {value: 'USD', label: 'USD'}],
                productOptions: [{Code: '1', Name: 'P1', Status: true}, {Code: '2', Name: 'P2', Status: false}],
                statusList: [{Code: 1, Name: 'Won', Status: true}, {Code: 2, Name: 'Lose', Status: true}, {Code: 3, Name: 'Draw', Status: false}] 
            });
            const props = { 
                dateRange: {
                    fromDate: '01/01/2019',
                    toDate: '01/02/2019',
                },
                selectedCurrency: {value: 0, label: 'All'},
                selectedBaseCurrency: {value: 'EUR', label: 'EUR'},
                isConvertAll: false,
                selectedProduct: 'P1',
                selectedStatus: 'Won'
            };
            const shallowRenderer = new ShallowRenderer();

            const result = shallowRenderer.render(<FormFilter {...props} />);
    
            expect(result).toMatchSnapshot();
        });
        
        it('render with empty source - do not render invalid component', () => {
            Object.assign(AppData, {
                dateConstraint: { maxDate: '01/01/2010', minDate: '10/10/2030' },
                currencyList: [],     
                baseCurrencyList: [],
                productOptions: [],
                statusList: [] 
            });
            const props = { 
                dateRange: {
                    fromDate: '01/01/2019',
                    toDate: '01/02/2019',
                },
                selectedCurrency: null,
                selectedBaseCurrency: null,
                isConvertAll: false,
                selectedProduct: '',
                selectedStatus: ''
            };
            const shallowRenderer = new ShallowRenderer();

            const result = shallowRenderer.render(<FormFilter {...props} />);
    
            expect(result).toMatchSnapshot();
        });
    });

    describe('event handle', () => {
        beforeAll(() => {
            Object.assign(AppData, {
                dateConstraint: { maxDate: '01/01/2010', minDate: '10/10/2030' },
                currencyList: [{value: 0, label: 'All'}, {value: 1, label: 'C1'}, {value: 2, label: 'C2'}],     
                baseCurrencyList: [{value: 'EUR', label: 'EUR'}, {value: 'USD', label: 'USD'}],
                productOptions: [{Code: '1', Name: 'P1', Status: true}, {Code: '2', Name: 'P2', Status: false}],
                statusList: [{Code: 1, Name: 'Won', Status: true}, {Code: 2, Name: 'Lose', Status: true}, {Code: 3, Name: 'Draw', Status: false}] 
            });
        });

        describe('DateRange ', () => {
            it('onChange - valid month range - update DateRange value', () => {          
                const props = { 
                    dateRange: {
                        fromDate: '01/01/2019',
                        toDate: '01/02/2019'
                    },
                    setDateRange: jest.fn()
                };
                const newValue = { fromDate: '01/01/2019', toDate: '01/03/2019' };

                const filter = new FormFilter(props);
                const dateRange = filter._renderDateRange();

                dateRange.props.onChange(newValue);
    
                expect(props.setDateRange).toHaveBeenCalledWith(newValue);
            });
        
            it('onChange - invalid month range - show error', () => {          
                const props = { 
                    dateRange: {
                        fromDate: '01/01/2019',
                        toDate: '01/02/2019'
                    },
                    setDateRange: jest.fn()
                };
                const newValue = { fromDate: '01/01/2019', toDate: '01/03/2019' };

                const filter = new FormFilter(props);
                const dateRange = filter._renderDateRange();
                window.alert = jest.fn();

                dateRange.props.onChange(newValue, false);
    
                expect(props.setDateRange).not.toHaveBeenCalled();
                expect(LangHelper.getSingleResource).toHaveBeenCalledWith('DateRangeExceedMsg');
            });
        });

        describe('Currency ', () => {
            it('onChange - update Currency value', () => {          
                const props = { 
                    selectedCurrency: {value: 0, label: 'All'},
                    setSelectedCurrency: jest.fn()
                };
                const newValue = {value: 1, label: 'C1'};

                const filter = new FormFilter(props);
                const currency = filter._renderCurrency();

                currency.props.onChange(newValue);
    
                expect(props.setSelectedCurrency).toHaveBeenCalledWith(newValue);
            });
        });

        describe('BaseCurrency', () => {
            it('onChange - update Base Currency value', () => {          
                const props = { 
                    selectedBaseCurrency: null,
                    setSelectedBaseCurrency: jest.fn()
                };
                const newValue = {value: 'EUR', label: 'EUR'};

                const filter = new FormFilter(props);
                const baseCurrency = filter._renderBaseCurrency();

                baseCurrency.props.onChange(newValue);
    
                expect(props.setSelectedBaseCurrency).toHaveBeenCalledWith(newValue.value);
            });
        });

        describe('ConvertAll check box', () => {
            it('onChange - update ConvertAll value', () => {          
                const props = { 
                    isConvertAll: false,
                    changeIsConvertAll: jest.fn()
                };
                const newValue = true;

                const filter = new FormFilter(props);
                const checkBox = filter._renderConvertAll();

                checkBox.props.onChange(newValue);
    
                expect(props.changeIsConvertAll).toHaveBeenCalledWith(newValue);
            });
        });

        describe('Product', () => {
            it('onChange - update Product value', () => {          
                const props = { 
                    setSelectedProduct: jest.fn()
                };
                const newValue = 'P1, P2';

                const filter = new FormFilter(props);
                const product = filter._renderProduct();

                product.props.onChange('', newValue);
    
                expect(props.setSelectedProduct).toHaveBeenCalledWith(newValue);
            });
        });

        describe('UserName', () => {
            it('onSelect - update UserName value', () => {          
                const props = { 
                    setUsername: jest.fn()
                };
                const newValue = 'N1';

                const filter = new FormFilter(props);
                const userName = filter._renderUserName();

                userName.props.onSelect(newValue);
    
                expect(props.setUsername).toHaveBeenCalledWith(newValue);
            });

            it('onInput - update UserName value', () => {          
                const props = { 
                    setUsername: jest.fn()
                };
                const newValue = 'N2';

                const filter = new FormFilter(props);
                const userName = filter._renderUserName();

                userName.props.onInput(newValue);
    
                expect(props.setUsername).toHaveBeenCalledWith(newValue);
            });
        });

        describe('Status', () => {
            it('onChange - update Status value', () => {          
                const props = { 
                    setSelectedStatus: jest.fn()
                };
                const newValue = 'Won';

                const filter = new FormFilter(props);
                const status = filter._renderStatus();

                status.props.onChange('', newValue);
    
                expect(props.setSelectedStatus).toHaveBeenCalledWith(newValue);
            });
        });
    });

    describe('_getParams', () => {
        it('return correctly', () => {
            const props = { 
                dateRange: {
                    fromDate: '01/01/2019',
                    toDate: '01/02/2019',
                },
                selectedCurrency: { label: 'C1', value: 1 },
                selectedBaseCurrency: null,
                isConvertAll: false,
                selectedProduct: 'P1,P2',
                selectedStatus: 'Won,Lose',
                username: 'u1',
                requestParam: { PageSize: 20 }
            };
            const expected = {
                FromDate: props.dateRange.fromDate,
                ToDate: props.dateRange.toDate,
                CurrencyId: props.selectedCurrency.value,
                CurrencyName: props.selectedCurrency.label,
                BaseCurrency: props.selectedBaseCurrency,
                IsConvertAll: props.isConvertAll,
                ProductCode: ['P1', 'P2'],
                UserName: props.username,
                Status: ['Won', 'Lose'],
                PageIndex: 1,
                PageSize: props.requestParam.PageSize
            };

            const filter = new FormFilter(props);
            const actual = filter._getParams();

            expect(actual).toEqual(expected);
        });
    });

    describe('isValidModel', () => {
        it('selectedProduct is empty - return false', () => {
            const props = { 
                selectedProduct: '',
                selectedStatus: 'Won,Lose'
            };

            const filter = new FormFilter(props);
            const actual = filter.isValidModel;

            expect(actual).not.toBe(true);
        });

        it('selectedStatus is empty - return false', () => {
            const props = { 
                selectedProduct: 'P1',
                selectedStatus: ''
            };

            const filter = new FormFilter(props);
            const actual = filter.isValidModel;

            expect(actual).not.toBe(true);
        });

        it('valid data - return true', () => {
            const props = { 
                selectedProduct: 'P1',
                selectedStatus: 'Won'
            };

            const filter = new FormFilter(props);
            const actual = filter.isValidModel;

            expect(actual).not.toBe(false);
        });
    });

    describe('onSubmit', () => {
        it('invalid model - do nothing', () => {
            const props = { 
                selectedProduct: '',
                selectedStatus: 'Won,Lose',
                toggleLoader: jest.fn()
            };

            const filter = new FormFilter(props);
            filter.onSubmit();

            expect(props.toggleLoader).not.toHaveBeenCalled();
        });

        it('valid model - update grid data', () => {
            const props = { 
                selectedProduct: 'P1',
                selectedStatus: 'Won',
                toggleLoader: jest.fn(),
                setReportTitle: jest.fn(),
                setRequestParam: jest.fn(),
                getGridData: jest.fn(),
            };
            const params = { FromDate: '01-01-2019', ToDate: '01-02-2019', CurrencyName: 'C1', BaseCurrency: 'EUR' };

            const filter = new FormFilter(props);
            filter._getParams = jest.fn(() => params);

            filter.onSubmit();

            expect(props.toggleLoader).toHaveBeenCalledWith(true);
            expect(Service.getReportTitle).toHaveBeenCalledWith(params.FromDate, params.ToDate, params.CurrencyName, params.BaseCurrency);
            expect(props.setReportTitle).toHaveBeenCalled();
            expect(props.setRequestParam).toHaveBeenCalledWith(params);
            expect(props.getGridData).toHaveBeenCalledWith(URL, params);
        });
    });
    
    describe('exportExcel', () => {
        afterEach(() => {
            ReportExcel.mockReset();
            LangHelper.getSingleResource.mockClear();
        });

        it('response data is empty - show message', () => {
            const exportFnMock = jest.fn();
            window.alert = jest.fn();
            ReportExcel.mockImplementation(() => {
                return {
                    export: exportFnMock
                }
            });

            const response = { data: { Data: [] } };
            DataService.postData = jest.fn((url, param) => { 
                return {
                    then: (callback) => { callback(response); } 
                };
            });

            const props = { 
                toggleLoader: jest.fn()
            };           
            const params = { FromDate: '01-01-2019', ToDate: '01-02-2019', CurrencyName: 'C2', BaseCurrency: 'EUR', IsExportExcel: true  };
            
            const filter = new FormFilter(props);
            filter._getParams = jest.fn(() => params);
            
            filter.exportExcel();

            expect(LangHelper.getSingleResource).toHaveBeenCalledWith('NoInfo');
            expect(DataService.postData).toHaveBeenCalledWith(EXCEL_DATA_URL, params);
            expect(Service.getReportTitle).not.toHaveBeenCalledWith(params.FromDate, params.ToDate, params.CurrencyName, params.BaseCurrency);
            expect(exportFnMock).not.toHaveBeenCalled();
        });

        it('response data is not empty - export excel', () => {
            const exportFnMock = jest.fn();
            ReportExcel.mockImplementation(() => {
                return {
                    export: exportFnMock
                }
            });

            const response = { data: { Data: [{ Id: 0 }] } };
            DataService.postData = jest.fn((url, param) => { 
                return {
                    then: (callback) => { callback(response); } 
                };
            });

            const props = { 
                toggleLoader: jest.fn()
            };           
            const params = { FromDate: '01-01-2019', ToDate: '01-03-2019', CurrencyName: 'C3', BaseCurrency: 'EUR', IsExportExcel: true  };
            
            const filter = new FormFilter(props);
            filter._getParams = jest.fn(() => params);
            
            filter.exportExcel();

            expect(LangHelper.getSingleResource).not.toHaveBeenCalledWith('NoInfo');
            expect(DataService.postData).toHaveBeenCalledWith(EXCEL_DATA_URL, params);
            expect(Service.getReportTitle).toHaveBeenCalledWith(params.FromDate, params.ToDate, params.CurrencyName, params.BaseCurrency);
            expect(exportFnMock).toHaveBeenCalled();
        });
    });
});