import React from 'react';
import renderer from 'react-test-renderer';
import { DataGrid } from '../DataGrid';
import { Service } from '../../lib/service';
import Report from '@jsroot/lib/report';
import LangHelper from '@jsroot/lib/langHelper';
import { defaultGridProps, gridData } from './TestData';

describe('DataGrid ', () => {
    beforeEach(() => {
        Service.sort = jest.fn();
        Service.showErrorMsg = jest.fn();
        Service.getReportTitle = jest.fn();
        LangHelper.getSingleResource = jest.fn((resource) => resource);
    })

    describe('componentDidUpdate', () => {
        it('previous timestamp is difference from the current one - call _getGridData', () => {
            const props = { params: { Timestamp: 1 } };
            const prevProps = { params: { Timestamp: 2 } };

            const dataGrid = new DataGrid(props);
            dataGrid._getGridData = jest.fn();
            dataGrid.componentDidUpdate(prevProps);
            
            expect(dataGrid._getGridData).toHaveBeenCalled();
        })

        it('previous timestamp is the same with the current one - do not call _getGridData', () => {
            const props = { params: { Timestamp: 1 } };
            const prevProps = { params: { Timestamp: 1 } };

            const dataGrid = new DataGrid(props);
            dataGrid._getGridData = jest.fn();
            dataGrid.componentDidUpdate(prevProps);
            
            expect(dataGrid._getGridData).not.toHaveBeenCalled();
        })
    })

    describe('_getGridData', () => {
        it('fetch data successfully - response data has one row - do not call sort function', () => {
            const props = { params: { SortBy: 'Id', SortOrder: 'asc' }, xsrfToken: '123', setReportTitle: jest.fn(), ...defaultGridProps };
            const fakeResponse = { data: { Data: [{ Id: 1 }]} };
            const promise = Promise.resolve(fakeResponse);
            Report.fetchGridData = jest.fn(() => promise);

            const dataGrid = new DataGrid(props);
            dataGrid.setState = jest.fn();

            dataGrid._getGridData();
            
            Promise.resolve().then(()=>{
                expect(Service.sort).not.toHaveBeenCalled();
                expect(props.setReportTitle).toHaveBeenCalled(); 
            });
        })

        it('fetch data successfully - response data has one row - call sort function', () => {
            const props = { params: { SortBy: 'Id', SortOrder: 'asc' }, xsrfToken: '123', setReportTitle: jest.fn(), ...defaultGridProps };
            const fakeResponse = { data: { Data: [{ Id: 1 }, { Id: 2 }]} };
            const promise = Promise.resolve(fakeResponse);
            Report.fetchGridData = jest.fn(() => promise);

            const dataGrid = new DataGrid(props);
            dataGrid.setState = jest.fn();

            dataGrid._getGridData();
            
            Promise.resolve().then(()=>{
                expect(Service.sort).toHaveBeenCalled();
                expect(props.setReportTitle).toHaveBeenCalled();
            });
        })

        it('fetch data failed - show error', () => {
            const props = { params: { SortBy: 'Id', SortOrder: 'asc' }, xsrfToken: '123', ...defaultGridProps };
            const promise = Promise.reject('fetch data failed - show error');
           
            Report.fetchGridData = jest.fn(() => promise);

            const dataGrid = new DataGrid(props);
            dataGrid.setState = jest.fn();

            dataGrid._getGridData();

            Promise.resolve().then().catch((err)=>{
                expect(Service.showErrorMsg).toHaveBeenCalled();
            });
        })
    })

    describe('_onExpandTurnOverColumn', () => {
        it('when call - update state', () => {
            const dataGrid = new DataGrid(defaultGridProps);
            dataGrid.setState = jest.fn((callback) => callback(true));
            dataGrid._onExpandTurnOverColumn({ stopPropagation: jest.fn })

            expect(dataGrid.setState).toHaveBeenCalled();
            expect(dataGrid.state.expandTurnover).toBe(false);
        })
    })

    describe('_onExpandLicenseeColumn', () => {
        it('when call - update state', () => {
            const dataGrid = new DataGrid(defaultGridProps);
            dataGrid.setState = jest.fn((callback) => callback(true));
            dataGrid._onExpandLicenseeColumn({ stopPropagation: jest.fn })

            expect(dataGrid.setState).toHaveBeenCalled();
            expect(dataGrid.state.expandLicensee).toBe(false);
        })
    })

    describe('_sort', () => {
        
        it('when call - update SortBy, SortOrder for param', () => {
            const sortBy = 'col1';
            const sortOrder = 'asc';
            const props = { params: { }, ...defaultGridProps };

            const dataGrid = new DataGrid(props);
            dataGrid._sort(sortBy, sortOrder);
            
            expect(props.setParams).toHaveBeenCalledWith({ SortBy: sortBy, SortOrder: sortOrder });
        })

        it('no data - do not call sort function', () => {
            const sortBy = 'col1';
            const props = { params: { SortBy: sortBy, SortOrder: 'desc' }, ...defaultGridProps };

            const dataGrid = new DataGrid(props);
            dataGrid._sort(sortBy);
            
            expect(Service.sort).not.toHaveBeenCalled();
        })

        it('griddata has more than 1 row - call sort function', () => {
            const sortBy = 'col1';
            const props = { params: { SortBy: sortBy, SortOrder: 'desc' }, ...defaultGridProps };

            const dataGrid = new DataGrid(props);
            dataGrid.setState = jest.fn((data) => { dataGrid.state.gridData = data });
            
            const fakeResponse = { data: { Data: [{ Id: 1 }, { Id: 2 } ]} };
            const promise = Promise.resolve(fakeResponse);
            Report.fetchGridData = jest.fn(() => promise);

            dataGrid._getGridData();
            
            Promise.resolve().then(()=>{
                dataGrid._sort(sortBy);
                expect(Service.sort).toHaveBeenCalled();
            }).catch(()=>{});
        })
    })
})