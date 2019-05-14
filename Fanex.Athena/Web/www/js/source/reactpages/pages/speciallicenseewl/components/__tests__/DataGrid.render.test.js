import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import renderer from 'react-test-renderer';
import { DataGrid  } from '../DataGrid';
import LangHelper from '@jsroot/lib/langHelper';
import Report from '@jsroot/lib/report';
import { Service } from '../../lib/service';

import { defaultGridProps, gridData } from './TestData';

describe('DataGrid  ', () => {
    beforeEach(() => {
        LangHelper.getSingleResource = jest.fn((resource) => resource);
        Service.sort = jest.fn();
        Service.getReportTitle = jest.fn();
    })

    it('data is null - return null', () => {
        const renderer = new ShallowRenderer();
        const result = renderer.render(<DataGrid />);
	
        expect(result).toBe(null);
    })

    it('gridData length is 0 - render no content', () => {
        const fakeResponse = { data: { Data: [] } };
        const promise = Promise.resolve(fakeResponse);
        Report.fetchGridData = jest.fn(() => promise);

        const props = { params: { Timestamp: 1 }, ...defaultGridProps };
        const dataGrid = renderer.create(<DataGrid {...props} />);

        const nextProps = { params: { Timestamp: 2 }, ...defaultGridProps };
        dataGrid.update(<DataGrid {...nextProps} />);

        Promise.resolve().then(()=>{
            const result = dataGrid.toJSON();
            expect(result).toMatchSnapshot();
        });
    })

    it('gridData length is greater than 0 - have 1 product only - render grid without expandable columns', () => {
        const fakeResponse = { data: gridData };
        const promise = Promise.resolve(fakeResponse);
        Report.fetchGridData = jest.fn(() => promise);

        const props = { params: { Timestamp: 1 }, ...defaultGridProps };
        const dataGrid = renderer.create(<DataGrid {...props} />);

        const nextProps = { params: { Timestamp: 2, ProductCodeList: ['SB'] }, ...defaultGridProps };
        dataGrid.update(<DataGrid {...nextProps} />);

        Promise.resolve().then(()=>{
            const result = dataGrid.toJSON();
            expect(result).toMatchSnapshot();
        });
    })

    it('gridData length is greater than 0 - have more than 1 product - render grid with expandable columns', () => {
        const fakeResponse = { data: gridData };
        const promise = Promise.resolve(fakeResponse);
        Report.fetchGridData = jest.fn(() => promise);

        const props = { params: { Timestamp: 1 }, ...defaultGridProps };
        const dataGrid = renderer.create(<DataGrid {...props} />);

        const nextProps = { params: { Timestamp: 2, ProductCodeList: ['SB', 'NG'] }, ...defaultGridProps };
        dataGrid.update(<DataGrid {...nextProps} />);

        Promise.resolve().then(()=>{
            const result = dataGrid.toJSON();
            expect(result).toMatchSnapshot();
        });
    })

    it('gridData length is greater than 0 - expand turnover columns - render correctly', () => {
        const fakeResponse = { data: gridData };
        const promise = Promise.resolve(fakeResponse);
        Report.fetchGridData = jest.fn(() => promise);

        const props = { params: { Timestamp: 1 }, ...defaultGridProps };
        const dataGrid = renderer.create(<DataGrid {...props} />);

        dataGrid.root.instance.setState({ expandTurnover: true });

        const nextProps = { params: { Timestamp: 2, ProductCodeList: ['SB', 'NG'] }, ...defaultGridProps };
        dataGrid.update(<DataGrid {...nextProps} />);

        Promise.resolve().then(()=>{
            const result = dataGrid.toJSON();
            expect(result).toMatchSnapshot();
        });
    })

    it('gridData length is greater than 0 - expand licensee wl columns - render correctly', () => {
        const fakeResponse = { data: gridData };
        const promise = Promise.resolve(fakeResponse);
        Report.fetchGridData = jest.fn(() => promise);

        const props = { params: { Timestamp: 1 }, ...defaultGridProps };
        const dataGrid = renderer.create(<DataGrid {...props} />);

        dataGrid.root.instance.setState({ expandLicensee: true });

        const nextProps = { params: { Timestamp: 2, ProductCodeList: ['SB', 'NG'] }, ...defaultGridProps };
        dataGrid.update(<DataGrid {...nextProps} />);

        Promise.resolve().then(()=>{
            const result = dataGrid.toJSON();
            expect(result).toMatchSnapshot();
        });
    })

})