import React from 'react';
import renderer from 'react-test-renderer';
import { DataGrid } from '../DataGrid';
import Service from '../../../lib/resultAmendmentService';
import LangHelper from '../../../../../lib/langHelper';
import Excel from '../../../../../lib/excel';

describe('DataGrid ', () => {
    beforeAll(() => {
        LangHelper.getSingleResource = jest.fn((resource) => resource);
        Service.getReportTitle = jest.fn();
        Excel.downloadFromBolb = jest.fn();
    });

    afterAll(() => {
        jest.resetAllMocks();
    })

    describe('render ', () => {
        it('data is undefined - return null', () => {
            const props = { gridData: {} };
            const dataGrid = renderer.create(<DataGrid {...props} />);

            const result = dataGrid.toJSON();

            expect(result).toBeNull();
        })

        it('no data - render No data title', () => {
            const props = { gridData: { Data: [] } };
            const dataGrid = renderer.create(<DataGrid {...props} />);

            const result = dataGrid.toJSON();

            expect(result).toMatchSnapshot();
        })

        it('has data - render table', () => {
            const props = { 
                gridData: { 
                    Data: [{ DateTime: '2017-01-01T12:00:00', Subject: 'Subject', Content: 'Content', DataFilePath: '' }],
                    Total: 1
                },
                param: {
                    PageIndex: 1,
                    PageSize: 10
                }
            };

            const options = {
                createNodeMock: (element) => {
                    return {
                        offsetHeight: 1,
                        offsetTop: 1
                    };
                }
            };
            const dataGrid = renderer.create(<DataGrid {...props} />, options);

            const result = dataGrid.toJSON();

            expect(result).toMatchSnapshot();
        })
    })
        
    describe('_buildHeader', () => {
        it('renders correct header', () => {
            const props = { 
                gridData: { 
                    Data: [{ DateTime: '2017-01-01T12:00:00', Subject: 'Subject', Content: 'Content', DataFilePath: '' }],
                    Total: 1
                },
                param: {
                    PageIndex: 1,
                    PageSize: 10
                }
            };
            const grid = new DataGrid(props);
            const headerName = {
                index: 'index',
                dateTime: 'dateTime',
                content: 'content',
                ticketList: 'ticketList'
            };
            Service.getHeaderText = jest.fn(() => headerName);

            const header = renderer.create(grid._buildHeader());
            const result = header.toJSON();

            expect(result.children.length).toEqual(Object.keys(headerName).length);
            result.children.forEach((item, index) => {
                expect(item.innerHtml).toEqual(headerName[index]);
            });
        })
    })

    describe('_buildBody', () => {            
        it('DataFilePath does not have value - return empty cell', () => {
            const props = { 
                gridData: { 
                    Data: [{ DateTime: '2017-01-01T12:00:00', Subject: 'Subject', Content: 'Content', DataFilePath: '' }],
                    Total: 1
                },
                param: {
                    PageIndex: 1,
                    PageSize: 10
                }
            };
            const grid = new DataGrid(props);

            const body = renderer.create(grid._buildBody()[0]);
            const result = body.toJSON();

            expect(result.children[3].props).toEqual({});
        })

        it('DataFilePath has value - return export excel cell', () => {
            const props = { 
                gridData: { 
                    Data: [{ DateTime: '2017-01-01T12:00:00', Subject: 'Subject', Content: 'Content', DataFilePath: 'DataFilePath' }],
                    Total: 1
                },
                param: {
                    PageIndex: 1,
                    PageSize: 10
                }
            };
            const grid = new DataGrid(props);

            const body = renderer.create(grid._buildBody()[0]);
            const result = body.toJSON();

            expect(result.children[3].props.title).toBe('ExportToExcel');
        })

        it('on expand row - mark item as read item is unread', () => {
            const props = { 
                gridData: { 
                    Data: [{ DateTime: '2017-01-01T12:00:00', Subject: 'Subject', Content: 'Content', DataFilePath: 'DataFilePath', IsRead: false }],
                    Total: 1
                },
                param: {
                    PageIndex: 1,
                    PageSize: 10
                },
                markItemAsRead: jest.fn()
            };
            const grid = new DataGrid(props);

            const body = renderer.create(grid._buildBody()[0]);
            const result = body.toJSON();

            result.children[2].children[0].children[0].children[1].props.onClick();

            expect(props.markItemAsRead).toHaveBeenCalled();
        })

        it('on expand row - set GridData state with correct data if item is read', () => {
            const props = { 
                gridData: { 
                    Data: [{ DateTime: '2017-01-01T12:00:00', Subject: 'Subject', Content: 'Content', DataFilePath: 'DataFilePath', IsRead: true }],
                    Total: 1
                },
                param: {
                    PageIndex: 1,
                    PageSize: 10
                },
                setGridData: jest.fn()
            };
            const grid = new DataGrid(props);
            const expectedData = [{ DateTime: '2017-01-01T12:00:00', Subject: 'Subject', Content: 'Content', DataFilePath: 'DataFilePath', IsRead: true, IsExpand: true }];

            const body = renderer.create(grid._buildBody()[0]);
            const result = body.toJSON();

            result.children[2].children[0].children[0].children[1].props.onClick();

            expect(props.setGridData).toHaveBeenCalledWith({ Data: expectedData, Total: props.gridData.Total });
        })

        it('on click exporting excel - call exportExcel function with correct parameter', () => {
            const props = { 
                gridData: { 
                    Data: [{ DateTime: '2017-01-01T12:00:00', Subject: 'Subject', Content: 'Content', DataFilePath: 'DataFilePath', IsRead: true }],
                    Total: 1
                },
                param: {
                    PageIndex: 1,
                    PageSize: 10
                }
            };
            let grid = new DataGrid(props);
            grid.exportExcel = jest.fn();
            const expectedParam = props.gridData.Data[0];

            const body = renderer.create(grid._buildBody()[0]);
            const result = body.toJSON();

            result.children[3].children[0].props.onClick();

            expect(grid.exportExcel).toHaveBeenCalledWith(expectedParam);
        })
    })
    
    describe('onPaging', () => {            
        it('calls props functions with correct parameter', () => {
            const props = { 
                gridData: { 
                    Data: [],
                    Total: 0
                },
                param: {
                    PageIndex: 1,
                    PageSize: 10
                },
                toggleLoader: jest.fn(),
                getGridData: jest.fn(),
                setParam: jest.fn()
            };
            const index = 2;
            const pageSize = 50;
            const expectedParam = {
                PageIndex: index,
                PageSize: pageSize
            };

            const grid = new DataGrid(props);
            grid.onPaging(index, pageSize);

            expect(props.toggleLoader).toHaveBeenCalledWith(true);
            expect(props.getGridData).toHaveBeenCalledWith({
                data: expectedParam
            });
            expect(props.setParam).toHaveBeenCalledWith(expectedParam);
        })
    })

    describe('componentDidUpdate', () => {
        it('next grid data is the same with the current - do not call toggleLoader', () => {
            const props = {
                gridData: {},
                dateRange: {},
                toggleLoader: jest.fn()
            };

            const grid = new DataGrid(props);
            grid.componentDidUpdate(props);

            expect(props.toggleLoader).not.toHaveBeenCalledWith();
        })

        it('next grid data is not the same with the current - hide loader', () => {
            const props = {
                gridData: {},
                dateRange: {},
                toggleLoader: jest.fn()
            };
            const prevProps = {
                gridData: {},
                dateRange: {
                    fromDate: '',
                    toDate: ''
                }
            };

            const grid = new DataGrid(props);
            grid.componentDidUpdate(prevProps);

            expect(props.toggleLoader).toHaveBeenCalledWith(false);
        })

        it('next param data is not the same with the current - update title', () => {
            const props = {
                gridData: {},
                dateRange: {},
                param: {
                    FromData: '',
                    ToDate: ''
                },
                toggleLoader: jest.fn()
            };
            const prevProps = {
                gridData: {}
            };

            const grid = new DataGrid(props);
            grid.componentDidUpdate(prevProps);

            expect(Service.getReportTitle).toHaveBeenCalled();
        })

        it('next param data is null - do not update title', () => {
            const props = {
                gridData: {},
                dateRange: {},
                param: null,
                toggleLoader: jest.fn()
            };
            const prevProps = {
                gridData: {},
                param: {
                    FromData: '',
                    ToDate: ''
                }
            };

            const grid = new DataGrid(props);
            grid.componentDidUpdate(prevProps);

            expect(Service.getReportTitle).toHaveBeenCalled();
        })
    })

    describe('exportExcel', () => {
        let dataGrid;
        const props = {
            dateRange: {},
            licenseeName: 'test',
            toggleLoader: jest.fn()
        };

        beforeAll(() => {
            dataGrid = new DataGrid(props);

            window.alert = jest.fn();
        })

        it('no data returned - alert with correct massage', () => {
            const fakeResponse = { status: 204 };
            const promise = Promise.resolve(fakeResponse);
            const item = {
                DataFilePath: 'DataFilePath',
                DateTime: '2017-01-01T12:00:00'
            };

            dataGrid.props.exportAttachment = jest.fn(() => promise);

            dataGrid.exportExcel(item);

            Promise.resolve().then(() => {
                expect(window.alert).toHaveBeenCalledWith('FileIsNotReady');
            });
        });

        it('exportExcel should be called with correct parameter', () => {
            const fakeResponse = { status: 204 };
            const promise = Promise.resolve(fakeResponse);
            const item = {
                DataFilePath: 'DataFilePath',
                DateTime: '2017-01-01T12:00:00'
            };

            const expectedParams = {
                fileName: item.DataFilePath
            };

            dataGrid.props.exportAttachment = jest.fn(() => promise);

            dataGrid.exportExcel(item);

            expect(dataGrid.props.exportAttachment).toHaveBeenCalledWith(expectedParams);
        })

        it('download file with correct file name', () => {
            const fakeResponse = { status: 200, data: {} };
            const promise = Promise.resolve(fakeResponse);
            const item = {
                DataFilePath: 'DataFilePath',
                DateTime: '2017-01-01T12:00:00'
            };

            const expectedName = 'test';

            dataGrid.props.exportAttachment = jest.fn(() => promise);

            dataGrid.exportExcel(item);

            Promise.resolve().then(() => {
                expect(Excel.downloadFromBolb).toHaveBeenCalledWith(fakeResponse.data, expectedName);
            });
        })
    })
})
