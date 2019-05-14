import React from 'react';
import { DataGrid } from '../DataGrid';
import renderer from 'react-test-renderer';
import ShallowRenderer from 'react-test-renderer/shallow';
import AppData from '@jsroot/lib/AppData';
import LangHelper from '@jsroot/lib/langHelper';
import ApiUrl from '../../../common/constants/apiUrl';

jest.mock('@jsroot/lib/AppData');

describe('DataGrid ', () => {
    const DefaultProps = { toggleLoader: jest.fn(), gridData: [], requestParam: '' };

    beforeAll(() => {
        LangHelper.getSingleResource = jest.fn((resource) => resource);
    });

    describe('componentDidUpdate ', () => {
        it('previous props and current props are different - call toggleLoader', () => {
            const props = { gridData: [1,2,3], toggleLoader: jest.fn() };
            const grid = new DataGrid(props);
            
            const preProps = { gridData: [] };
            grid.componentDidUpdate(preProps, props);

            expect(props.toggleLoader).toHaveBeenCalledWith(false);
        });

        it('previous props and current props are same - not call toggleLoader', () => {
            const props = { gridData: [1,2,3], toggleLoader: jest.fn() };
            const grid = new DataGrid(props);
         
            const preProps = { gridData: props.gridData };
            grid.componentDidUpdate(preProps, props);

            expect(props.toggleLoader).not.toHaveBeenCalled();
        });
    });

    it('dataUrl - return correctly', () => {
        const grid = new DataGrid(DefaultProps);

        expect(grid.dataUrl).toBe(ApiUrl.MULTICUSTOMER_DATA_URL);
    });

    describe('_buildHeader ', () => {
        it('isAllowedCustomerComm is true - render correctly', () => {
            Object.assign(AppData, { isAllowedCustomerComm: true });

            const grid = new DataGrid(DefaultProps);
            const renderer = new ShallowRenderer();
            const result = renderer.render(grid._buildHeader());
            
            expect(result).toMatchSnapshot();
        });

        it('isAllowedCustomerComm is false - render correctly', () => {
            Object.assign(AppData, { isAllowedCustomerComm: false });

            const grid = new DataGrid(DefaultProps);
            const renderer = new ShallowRenderer();
            const result = renderer.render(grid._buildHeader());
            
            expect(result).toMatchSnapshot();
        });
    });

    describe('_buildFooter ', () => {
        it('render correctly', () => {
            const props = {
                gridData: { Total: {SumStake: '2232.23', SumLicenseeWL: '-1231' }},
                requestParam: { BaseCurrency: 'USD' }
            };
            const grid = new DataGrid(props);
            
            const result = renderer.create(grid._buildFooter());
            
            expect(result).toMatchSnapshot();
        });
    });
});