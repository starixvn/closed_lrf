import React from 'react'
import { DataGrid } from '../DataGrid';
import renderer from 'react-test-renderer';
import ShallowRenderer from 'react-test-renderer/shallow';
import LangHelper from '../../../../lib/langHelper';
import Site from '../../../../lib/site';

const URL = '/api/CasinoTurnoverReport/GetData';

describe('DataGrid ', () => {
    const gridData =  {
        Data: [
            { BetCount: 10, CustomerWL: 100, Date: "2019-01-01T00:00:00", ExternalId: "Ext1", Index: 1, Product: "P1", RowSpan: 2, SystemId: "Sys1", Turnover: 10, ValidBetAmount: 1 },
            { BetCount: 20, CustomerWL: -200, Date: "2019-01-02T00:00:00", ExternalId: "Ext2", Index: 0, Product: "P2", RowSpan: 0, SystemId: "Sys2", Turnover: 20, ValidBetAmount: 2 },
            { BetCount: 30, CustomerWL: -300, Date: "2019-01-03T00:00:00", ExternalId: "Ext3", Index: 2, Product: "P3", RowSpan: 1, SystemId: "Sys3", Turnover: 30, ValidBetAmount: 3 }
        ],
        Total: { BetCount: 60, CustomerWL: -400, Date: "0001-01-01T00:00:00", ExternalId: null, Index: 0, Product: null, RowSpan: 0, SystemId: null, Turnover: 60, ValidBetAmount: 6 }
    }

    beforeAll(() => {
        LangHelper.getSingleResource = jest.fn(text => text);
        Site.resolveClientUrl = jest.fn(url => url);
    })

    describe('No data', () => {
        it('return null when gridData is undefined', () => {
            const dataGrid = new DataGrid({});

            const result = dataGrid.render();

            expect(result).toBeNull();
        })

        it('gridData is null - render null', () => {
            const props = { gridData: { Data: null } };
            const dataGrid = new DataGrid(props);

            const result = dataGrid.render();

            expect(result).toBeNull();
        })

        it('gridData length is 0 - render "NoDataTile"', () => {
            const props = { gridData: { Data: [] } };
            const dataGrid = new DataGrid(props);

            const tree = dataGrid.render();
            const result = tree.type.name;

            expect(result).toBe("NoDataTitle");
        })
    })

    describe('componentDidUpdate', () => {
        it('props changed - update Loader component', () => {
            const currentProps = {
                gridData: {
                    timestamp: 100
                },
                toggleLoader: jest.fn()
            };
            const prevProps = {
                gridData: {
                    timestamp: 99
                },
                toggleLoader: jest.fn()
            };

            const dataGrid = new DataGrid(currentProps);

            dataGrid.componentDidUpdate(prevProps);

            expect(currentProps.toggleLoader).toHaveBeenCalledWith(false);
        })

        it('no props changed - do nothing', () => {
            const currentProps = {
                gridData: {
                    timestamp: 100
                },
                toggleLoader: jest.fn()
            };
            const prevProps = {
                gridData: {
                    timestamp: 100
                },
                toggleLoader: jest.fn()
            };

            const dataGrid = new DataGrid(currentProps);

            dataGrid.componentDidUpdate(prevProps);

            expect(currentProps.toggleLoader).not.toHaveBeenCalled();
        })
    })

    describe('onPaging', () => {
        it('update page info', () => {
            const index = 1, size = 20;
            const props = {
                requestParam: {
                    PageIndex: 0,
                    PageSize: 50,
                    Id: 0
                }
            };
            const expectedParams = {
                PageIndex: index,
                PageSize: size,
                Id: 0
            }

            const dataGrid = new DataGrid(props);
            dataGrid._getData = jest.fn();

            dataGrid.onPaging(index, size);

            expect(dataGrid._getData).toHaveBeenCalledWith(expectedParams);
        })
    })

    describe('_getData', () => {
        it('get data for Grid', () => {
            const index = 1, size = 20;
            const props = {
                toggleLoader: jest.fn(),
                getGridData: jest.fn(),
                setRequestParam: jest.fn()
            };
            const params = {
                PageIndex: 1,
                PageSize: 10,
                Id: 0
            }

            const dataGrid = new DataGrid(props);

            dataGrid._getData(params);

            expect(props.toggleLoader).toHaveBeenCalledWith(true);
            expect(props.getGridData).toHaveBeenCalledWith(URL, params);
            expect(props.setRequestParam).toHaveBeenCalledWith(params);
        })
    })

    describe('_buildHeader', () => {
        it('return correct columns', () => {
            const dataGrid = new DataGrid({});

            const header = renderer.create(dataGrid._buildHeader());
            const result = header.toJSON();

            expect(result).toMatchSnapshot();
        })
    })

    describe('_buildBody', () => {
        it('return correct columns', () => {
            const data = gridData.Data;

            const dataGrid = new DataGrid({});

            const body = renderer.create(<div>{dataGrid._buildBody(data)}</div>);
            const result = body.toJSON();

            expect(result).toMatchSnapshot();
        })
    })

    describe('_buildFooter', () => {
        it('return correct columns', () => {
            const data = gridData.Total;
            const baseCurrency = 'USD';

            const dataGrid = new DataGrid({});

            const footer = renderer.create(dataGrid._buildFooter(data, baseCurrency));
            const result = footer.toJSON();

            expect(result).toMatchSnapshot();
        })
    })

    describe('render', () => {
        it('render correctly', () => {
            const props = {
                gridData: gridData,
                requestParam: { PageIndex: 1, PageSize: 20, BaseCurrency: 'USD' }
            };

            const shallowRenderer = new ShallowRenderer();
            const grid = shallowRenderer.render(<DataGrid {...props} />);

            expect(grid).toMatchSnapshot();
        })
    })
})