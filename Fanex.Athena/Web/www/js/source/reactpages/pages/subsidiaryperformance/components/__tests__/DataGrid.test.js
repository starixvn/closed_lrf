import React from 'react'
import { DataGrid } from '../DataGrid';
import { Service, Api } from '../../lib/service';
import renderer from 'react-test-renderer';
import Report from '../../../../lib/report'
import { ReportLevel } from '../../../../constants/report'
import LangHelper from '../../../../lib/langHelper'

import { defaultProps, totalData, bodyData, grandTotalData, bodyDetailData, totalDetailData } from './fakeData';

const { toggleLoader, setParams } = defaultProps;

describe('DataGrid ', () => {
    beforeAll(() => {
        LangHelper.getSingleResource = jest.fn((text) => text);
        Service.showErrorMsg = jest.fn();
    })

    describe('No data', () => {
        it('return null when gridData is undefined', () => {
            const dataGrid = renderer.create(<DataGrid />);

            const result = dataGrid.toJSON();

            expect(result).toBeNull();
        })

        it('gridData length is 0 - render correct content', () => {
            const fakeResponse = { data: { Data: [] } };
            const promise = Promise.resolve(fakeResponse);
            Report.fetchGridData = jest.fn(() => promise);

            const props = { params: { Timestamp: 1 }, toggleLoader };
            const dataGrid = renderer.create(<DataGrid {...props} />);

            const nextProps = { params: { Timestamp: 2 }, toggleLoader };
            dataGrid.update(<DataGrid {...nextProps} />);

            Promise.resolve().then(()=>{
                const result = dataGrid.toJSON();
                expect(result).toMatchSnapshot();
            });
        })
    })

    describe('Data is not empty', () => {
        describe('Level MAIN', () => {
            it('render correct content', () => {
                const fakeResponse = { data: { Data: bodyData, Total: totalData, GrandTotal: grandTotalData } };
                const promise = Promise.resolve(fakeResponse);
                Report.fetchGridData = jest.fn(() => promise);

                const props = { params: { Timestamp: 1, Level: ReportLevel.MAIN }, toggleLoader };
                const dataGrid = renderer.create(<DataGrid {...props} />);

                const nextProps = { params: { Timestamp: 2, Level: ReportLevel.MAIN }, toggleLoader };
                dataGrid.update(<DataGrid {...nextProps} />);

                Promise.resolve().then(()=>{
                    const result = dataGrid.toJSON();
                    expect(result).toMatchSnapshot();
                });
            })
        })

        describe('Level CUSTOMER', () => {
            it('render correct content', () => {
                const fakeResponse = { data: { Data: bodyDetailData, Total: totalDetailData, GrandTotal: grandTotalData } };
                const promise = Promise.resolve(fakeResponse);
                Report.fetchGridData = jest.fn(() => promise);

                const props = { params: { Timestamp: 1, Level: ReportLevel.MAIN }, toggleLoader, setParams };
                const dataGrid = renderer.create(<DataGrid {...props} />);

                dataGrid.getInstance()._drillDown('1');

                Promise.resolve().then(()=>{
                    const result = dataGrid.toJSON();
                    expect(result).toMatchSnapshot();
                });
            })
        })
    })

    describe('componentDidUpdate ', () => {
        it('params updated - _getGridData function should be called with correct parameter', () => {
            const props = { params: { Timestamp: 1, BaseCurrency: 'EUR' } };
            const dataGrid = new DataGrid(props);
            dataGrid._getGridData = jest.fn();
            const prevProps = { params: { Timestamp: 2, BaseCurrency: 'EUR' } };

            dataGrid.componentDidUpdate(prevProps);

            expect(dataGrid._getGridData).toHaveBeenCalledWith(Api.Url, props.params);
        })

        it('params are not updated - _getGridData function should not be called', () => {
            const props = { params: { Timestamp: 1, BaseCurrency: 'EUR' } };
            const dataGrid = new DataGrid(props);
            dataGrid._getGridData = jest.fn();

            dataGrid.componentDidUpdate(props);

            expect(dataGrid._getGridData).not.toHaveBeenCalled();
        })
    })

    describe('_getGridData ', () => {
        it('update state when fetching data successfully', () => {
            const params = { Timestamp: 1, BaseCurrency: 'EUR' };
            const url = 'url';
            const props = { xsrfToken: 'token', toggleLoader };
            const dataGrid = new DataGrid(props);
            dataGrid.setState = jest.fn();

            const fakeResponse = { data: { Data: [] } };
            const promise = Promise.resolve(fakeResponse);
            Report.fetchGridData = jest.fn(() => promise);

            dataGrid._getGridData(url, params);

            Promise.resolve().then(()=>{
                expect(props.toggleLoader).toHaveBeenCalledWith(false);
                expect(dataGrid.setState).toHaveBeenCalledWith({ gridData: fakeResponse.data });
                expect(Report.fetchGridData).toHaveBeenCalledWith(url, { xsrfToken: props.xsrfToken, data: params });
            });
        })

        it('show error when fetching data failed', () => {
            const params = { Timestamp: 1, BaseCurrency: 'EUR' };
            const url = 'url';
            const props = { xsrfToken: 'token', toggleLoader };
            const dataGrid = new DataGrid(props);
            dataGrid.setState = jest.fn();

            Report.fetchGridData = jest.fn(() => Promise.reject('error'));

            dataGrid._getGridData(url, params);

            Promise.reject().then().catch(()=>{
                expect(props.toggleLoader).toHaveBeenCalledWith(false);
                expect(Service.showErrorMsg).toHaveBeenCalled();
            });
        })
    })
})