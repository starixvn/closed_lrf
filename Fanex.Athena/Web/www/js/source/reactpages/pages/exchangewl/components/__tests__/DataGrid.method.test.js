import React from 'react';
import { DataGrid } from '../DataGrid';
import { Service } from '../../lib/service';
import NumberFormat from '../../../../lib/numberFormat';
import renderer from 'react-test-renderer';
import { ReportLevel, ReportBy } from '../../../../constants/report';
import { Licensee } from '../../../../constants/licensee';
import Report from '../../../../lib/report';
import LangHelper from '../../../../lib/langHelper.js';

describe('DataGrid methods ', () => {
    beforeAll(() => {
        Service.getReportTitle = jest.fn(() => 'ExchangeWinLoss');
    });

    describe('componentDidUpdate ', () => {
        it('params update - update drill down params', () => {
            const level = ReportLevel.MAIN;
            const dataGridProps = { 
                gridData: { level: level },                
                toggleLoader: jest.fn(),
                params : { FromDate: '01/01/2017', ToDate: '02/01/2017', BaseCurrency: 'EUR', CurrencyName: 'USD', CurrencyId: 0 }
            };
            const prevProps = {
                params : { FromDate: '01/01/2017', ToDate: '02/01/2017', BaseCurrency: 'USD', CurrencyName: 'USD', CurrencyId: 0 },
                gridData: dataGridProps.gridData
            };

            const dataGrid = new DataGrid(dataGridProps);
            dataGrid.drillDownParams = [prevProps.params];

            dataGrid.componentDidUpdate(prevProps);

            expect(dataGrid.drillDownParams[ReportLevel.MAIN]).toEqual(dataGridProps.params);
        })

        it('params do not update - do not update drill down params', () => {
            const level = ReportLevel.LICENSEE;
            const dataGridProps = { 
                gridData: { level: level },                
                toggleLoader: jest.fn(),
                params: { FromDate: '01/01/2017', ToDate: '02/01/2017', BaseCurrency: '', CurrencyName: 'USD', CurrencyId: 0 }
            };

            const dataGrid = new DataGrid(dataGridProps);
            dataGrid.drillDownParams = [dataGridProps.params, dataGridProps.params];

            dataGrid.componentDidUpdate(dataGridProps);

            expect(dataGrid.drillDownParams[ReportLevel.MAIN]).toEqual(dataGridProps.params);
        })

        it('gridData do not update - do not call toggleLoader', () => {
            const dataGridProps = { 
                gridData: { level: 0, data: { DataList: [] } },
                toggleLoader: jest.fn() 
            };
            const dataGrid = new DataGrid(dataGridProps);

            dataGrid.componentDidUpdate(dataGridProps);

            expect(dataGrid.props.toggleLoader).not.toHaveBeenCalled();
        })

        it('gridData update - call toggleLoader', () => {
            const dataGridProps = { 
                gridData: { level: 0, data: { DataList: [] } },
                params: [{ FromDate: '01/01/2017', ToDate: '02/01/2017', CurrencyName: 'USD', CurrencyId: 0 }, {}],
                toggleLoader: jest.fn() 
            };
            const dataGrid = new DataGrid(dataGridProps);

            dataGridProps.gridData = {};
            dataGrid.componentDidUpdate({});

            expect(dataGrid.props.toggleLoader).toHaveBeenCalledWith(false);
        })
    })

    describe('_getDrillDownParams ', () => {
        it('Main level params is invalid - return null', () => {
            const props = {
                params: []
            };

            const dataGrid = new DataGrid(props);

            const result = dataGrid._getDrillDownParams();

            expect(result).toBeNull();
        })

        it('drill down to next level - report by daily - FromDate/ToDate is the same with drill down date', () => {
            const mainParam = {
                ReportBy: ReportBy.DAILY,
                FromDate: '01/01/2017',
                ToDate: '02/01/2017'
            };
            const props = {
                params: mainParam,
            };
            const level = 1, 
                currencyId = 1, 
                currencyName = 'USD', 
                custId = 2, 
                drillDownDate = '01/25/2017';
            const expectedResult = {
                ...mainParam,
                CurrencyId: currencyId,
                CurrencyName: currencyName,
                FromDate: drillDownDate,
                ToDate: drillDownDate,
                Level: level,
                CustId: custId
            };

            const dataGrid = new DataGrid(props);
            dataGrid.drillDownParams[ReportLevel.MAIN] = mainParam;

            const result = dataGrid._getDrillDownParams(level, drillDownDate, currencyId, currencyName, custId);

            expect(result.data).toEqual(expectedResult);
        })

        it('drill down to next level - report by monthly - FromDate/ToDate is calculated correctly', () => {
            const mainParam = {
                ReportBy: ReportBy.MONTHLY,
                FromDate: '01/01/2017',
                ToDate: '02/10/2017'
            };
            const props = {
                params: mainParam,
            };
            const level = 1, 
                currencyId = 1, 
                currencyName = 'USD', 
                custId = 2, 
                drillDownDate = '02/05/2017';
            const expectedResult = {
                ...mainParam,
                CurrencyId: currencyId,
                CurrencyName: currencyName,
                FromDate: '02/01/2017',
                ToDate: mainParam.ToDate,
                Level: level,
                CustId: custId
            };

            const dataGrid = new DataGrid(props);
            dataGrid.drillDownParams[ReportLevel.MAIN] = mainParam;

            const result = dataGrid._getDrillDownParams(level, drillDownDate, currencyId, currencyName, custId);

            expect(result.data).toEqual(expectedResult);
        })

        it('drill down to next level - report by monthly - FromDate/ToDate is calculated correctly(2)', () => {
            const mainParam = {
                ReportBy: ReportBy.MONTHLY,
                FromDate: '01/15/2017',
                ToDate: '02/10/2017'
            };
            const props = {
                params: mainParam,
            };
            const level = 1, 
                currencyId = 1, 
                currencyName = 'USD', 
                custId = 2, 
                drillDownDate = '01/20/2017';
            const expectedResult = {
                ...mainParam,
                    CurrencyId: currencyId,
                CurrencyName: currencyName,
                FromDate: mainParam.FromDate,
                ToDate: '01/31/2017',
                Level: level,
                CustId: custId
            };

            const dataGrid = new DataGrid(props);
            dataGrid.drillDownParams[ReportLevel.MAIN] = mainParam;

            const result = dataGrid._getDrillDownParams(level, drillDownDate, currencyId, currencyName, custId);

            expect(result.data).toEqual(expectedResult);
        })

        it('drill down to next level - update drill down params', () => {
            const mainParam = {
                ReportBy: ReportBy.DAILY,
                FromDate: '01/15/2017',
                ToDate: '02/10/2017'
            };
            const props = {
                params: mainParam,
            };
            const level = 1, 
                currencyId = 1, 
                currencyName = 'USD', 
                custId = 2, 
                drillDownDate = '01/20/2017';
            const expectedResult = {
                ...mainParam,
                CurrencyId: currencyId,
                CurrencyName: currencyName,
                FromDate: drillDownDate,
                ToDate: drillDownDate,
                Level: level,
                CustId: custId
            };
            const expectedParam = [mainParam, expectedResult];
                        
            const dataGrid = new DataGrid(props);
            dataGrid.drillDownParams[ReportLevel.MAIN] = mainParam;

            const result = dataGrid._getDrillDownParams(level, drillDownDate, currencyId, currencyName, custId);

            expect(dataGrid.drillDownParams).toEqual(expectedParam);
        })
    })

    describe('_drillDownData ', () => {
        it('drill down level is current level - do notthing', () => {
            const level = 1;
            const props = {
                gridData: { level: level },
                toggleLoader: jest.fn()
            };

            const dataGrid = new DataGrid(props);
            dataGrid._drillDownData(level);

            expect(props.toggleLoader).not.toHaveBeenCalled();
        })

        it('drill down level is greater than Customer level - do notthing', () => {
            const level = ReportLevel.CUSTOMER + 1;
            const props = {
                gridData: { level: level },
                toggleLoader: jest.fn()
            };

            const dataGrid = new DataGrid(props);
            dataGrid._drillDownData(level);

            expect(props.toggleLoader).not.toHaveBeenCalled();
        })

        it('drill down level is less than Main level - do notthing', () => {
            const level = ReportLevel.MAIN - 1;
            const props = {
                gridData: { level: level },
                toggleLoader: jest.fn()
            };

            const dataGrid = new DataGrid(props);
            dataGrid._drillDownData(level);

            expect(props.toggleLoader).not.toHaveBeenCalled();
        })

        it('drill down to previous level - get data of previous level for Grid data - data is invalid - do nothing', () => {
            const level = 0;
            const props = {
                gridData: { level: level + 1 },
                toggleLoader: jest.fn(),
                setGridData: jest.fn(),
                levelGridData: []
            };

            const dataGrid = new DataGrid(props);
            dataGrid._drillDownData(level);

            expect(props.setGridData).not.toHaveBeenCalled();
        })

        it('drill down to previous level - get data of previous level for Grid data', () => {
            const level = 0;
            const previousData = { index: 1 };
            const props = {
                gridData: { level: level + 1 },
                toggleLoader: jest.fn(),
                setGridData: jest.fn(),                
            };

            const dataGrid = new DataGrid(props);
            dataGrid.levelGridData = [previousData];
            dataGrid._drillDownData(level);

            expect(props.setGridData).toHaveBeenCalledWith({
                data: previousData,
                level: level
            });
        })

        it('drill down to next level - call getGridData - params is invalid - do nothing', () => {
            const level = 1;
            const props = {
                gridData: { level: level - 1 },
                toggleLoader: jest.fn()
            };

            const dataGrid = new DataGrid(props);
            dataGrid._getDrillDownParams = jest.fn(() => { return null; });

            dataGrid._drillDownData(level);

            expect(props.toggleLoader).not.toHaveBeenCalled();
        })

        it('drill down to next level - save current Grid data', () => {
            const level = 1;
            const currentData = { index: 1 };
            const props = {
                gridData: { level: level - 1, data: currentData },
                toggleLoader: jest.fn(),
                getGridData: jest.fn()
            };

            const dataGrid = new DataGrid(props);
            dataGrid._getDrillDownParams = jest.fn(() => { return { level: level }; });

            dataGrid._drillDownData(level);

            expect(dataGrid.levelGridData).toEqual([currentData]);
        })

        it('drill down to next level - call getGridData', () => {
            const level = 1;           
            const props = {
                gridData: { level: level - 1, data: { index: 1 } },
                toggleLoader: jest.fn(),
                getGridData: jest.fn()
            };

            const dataGrid = new DataGrid(props);
            const params = { level: level };
            dataGrid._getDrillDownParams = jest.fn(() => { return params; });

            dataGrid._drillDownData(level);
            const actualParams = props.getGridData.mock.calls[0][0];

            expect(props.getGridData).toHaveBeenCalled();
            expect(actualParams).toEqual(params);
        })

        it('drill down to next level - alert error when getting data failed', () => {
            const level = 1;           
            const props = {
                gridData: { level: level - 1, data: { index: 1 } },
                toggleLoader: jest.fn(),
                getGridData: jest.fn()
            };
            Service.showErrorMsg = jest.fn();

            const dataGrid = new DataGrid(props);
            const params = { level: level };
            dataGrid._getDrillDownParams = jest.fn(() => { return params; });

            dataGrid._drillDownData(level);
            const errorHandler = props.getGridData.mock.calls[0][1];
            errorHandler();

            expect(Service.showErrorMsg).toHaveBeenCalled();
            expect(props.toggleLoader).toHaveBeenCalledWith(false);
        })
    })

    describe('closeBetListPopup', () => {
        it('reset state of bet list', () => {
            const props = {
                gridData: { level: 1 },
                toggleLoader: jest.fn()
            };

            const dataGrid = new DataGrid(props);
            dataGrid.setState = jest.fn() ;

            dataGrid.closeBetListPopup();

            expect(dataGrid.setState).toHaveBeenCalledWith({ showBetList: false, betListData: null });
        })
    })

    describe('showBetListPopup', () => {
        const betListData = [1, 2];
        let dataGrid;
        const drillDownParam = { CurrencyId : 1, BaseCurrency : "", FromDate : '01/01/2018', ToDate : '01/02/2018', CurrencyName : "USD", ExcludeTestData : false };            
        const custId = 2, externalId = 'external', systemId = 'system';

        beforeAll(() => {
            const fakeReportLib = {
                then: (func) => { func({ data : betListData}); return {catch: (func) => { func('Error'); }}; }
            }

            Report.fetchGridData = jest.fn(() => fakeReportLib);

            Service.showErrorMsg = jest.fn();

            LangHelper.getSingleResource = jest.fn((str) => { return str === 'Viewin' ? 'Viewin {0}' : str; });

            const props = {
                gridData: { level: 1 },
                toggleLoader: jest.fn()
            };

            dataGrid = new DataGrid(props);
            dataGrid.drillDownParams = [{}, {}, drillDownParam];
            dataGrid.setState = jest.fn();
        })

        it('update bet list params', () => {
            dataGrid.showBetListPopup(externalId, systemId, custId );

            expect(dataGrid.betlistParams).toEqual({ 
                CustId : custId, 
                CurrencyId : drillDownParam.CurrencyId, 
                BaseCurrency : drillDownParam.BaseCurrency, 
                FromDate : drillDownParam.FromDate, 
                ToDate : drillDownParam.ToDate, 
                ExcludeTestData : drillDownParam.ExcludeTestData });
        })

        it('update bet list title - View in base currency', () => {
            const drillDownParamBaseUsd = { ...drillDownParam, BaseCurrency : 'USD', CurrencyName : 'EUR' };

            dataGrid.drillDownParams[ReportLevel.CUSTOMER] = drillDownParamBaseUsd;
            dataGrid.showBetListPopup(externalId, systemId, custId );
 
            expect(dataGrid.betlistTitle.props.children.join('')).toContain('CustomerBetList 01/01/2018 → 01/02/2018 - external(system) -');
            expect(dataGrid.betlistTitle.props.children[dataGrid.betlistTitle.props.children.length - 1].props.children).toContain('Viewin USD');
        })

        it('update bet list title - View in selected currency', () => {
            const drillDownParamBaseUsd = { ...drillDownParam, BaseCurrency : '', CurrencyName : 'EUR' };

            dataGrid.drillDownParams[ReportLevel.CUSTOMER] = drillDownParamBaseUsd;
            dataGrid.showBetListPopup(externalId, systemId, custId );

            expect(dataGrid.betlistTitle.props.children[dataGrid.betlistTitle.props.children.length - 1].props.children).toContain("Viewin EUR");
        })

        it('Call Report.fetchGridData - update state when calling successfully', () => {
            dataGrid.showBetListPopup(externalId, systemId, custId );

            expect(dataGrid.setState).toHaveBeenCalledWith({ showBetList: true, betListData: betListData });
        })

         it('Call Report.fetchGridData - show error when calling failed', () => {
            dataGrid.showBetListPopup(externalId, systemId, custId );

            expect(Service.showErrorMsg).toHaveBeenCalled();
        })
    })
});