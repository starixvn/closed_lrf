import React from 'react';
import { DataGrid } from '../DataGrid';
import { Service } from '../../lib/service';
import NumberFormat from '../../../../lib/numberFormat';
import renderer from 'react-test-renderer';
import { ReportLevel, ReportBy } from '../../../../constants/report';
import { Licensee } from '../../../../constants/licensee';
import LangHelper from '../../../../lib/langHelper';

describe('Render DataGrid components ', () => {
    describe('Render Bread crumb', () => {
        const breadcrumbText = {
            main: 'Main',
            licensee: 'Licensee',
            customer: 'Customer',
        };

        beforeAll(() => {
            LangHelper.getSingleResource = jest.fn((resource) => {
                return resource;
            });
        });

        it('licensee is 12Bet - build customer level link', () => {
            const props = { 
                licenseeId: Licensee.ONE_TWO_BET,
                gridData: {
                    level: ReportLevel.CUSTOMER
                }
            };
            const expectedResult = [{
                label: breadcrumbText.main,
                value: ReportLevel.MAIN,
            },{
                label: breadcrumbText.licensee,
                value: ReportLevel.LICENSEE,
            },{
                label: breadcrumbText.customer,
                value: ReportLevel.CUSTOMER,
            }];

            const dataGrid = new DataGrid(props);
            const breadCrumb = dataGrid._renderBreadcrumb();

            const result = breadCrumb.props.items;

            expect(result).toEqual(expectedResult);
        })

        it('licensee is 12Bet - only build 2 level', () => {
            const props = { 
                isAllowedCustomerComm: false,
                licenseeId: 0,
                gridData: {
                    level: ReportLevel.CUSTOMER
                }
            };
            const expectedResult = [{
                label: breadcrumbText.main,
                value: ReportLevel.MAIN,
            },{
                label: breadcrumbText.customer,
                value: ReportLevel.CUSTOMER,
            }];

            const dataGrid = new DataGrid(props);
            const breadCrumb = dataGrid._renderBreadcrumb();

            const result = breadCrumb.props.items;

            expect(result).toEqual(expectedResult);
        })

        it('onChange - call _drillDownData method', () => {
            const props = { 
                isAllowedCustomerComm: false,
                licenseeId: 0,
                gridData: {
                    level: ReportLevel.CUSTOMER
                }
            };
            const changedItem = {
                label: breadcrumbText.main,
                value: ReportLevel.MAIN
            };

            const dataGrid = new DataGrid(props);
            dataGrid._drillDownData = jest.fn();
            const breadCrumb = dataGrid._renderBreadcrumb();

            const result = breadCrumb.props.onChange(changedItem);

            expect(dataGrid._drillDownData).toHaveBeenCalledWith(changedItem.value);
        })
    });

    describe('Render grid', () => {
        beforeAll(() => {
            NumberFormat.formatDecimal = jest.fn((value) => value);
            NumberFormat.format = jest.fn((value) => value);
            Service.getReportTitle = jest.fn((date, currencyName, isAll) => date.fromDate + ' ' + date.toDate + ' ' + currencyName + ' ' + isAll);
        });

        describe('No data', () => {
            it('return null when gridData is undefined', () => {          
                const props = { gridData: undefined };
                const dataGrid = renderer.create(<DataGrid {...props} />);

                const result = dataGrid.toJSON();

                expect(result).toBeNull();
            })


            it('gridData length is 0 - render correct content', () => {
                const props = { 
                    gridData: { level: 0, data: { DataList: [] } },
                    params: { FromDate: '2018/01/01', ToDate: '2018/01/01', BaseCurrency: 'All', CurrencyName: 'EUR', CurrencyId: 0 },
                    toggleLoader: jest.fn() };

                const dataGrid = new DataGrid(props);
                dataGrid.drillDownParams[ReportLevel.MAIN] = props.params;

                const content = dataGrid.render();

                const options = {
                    createNodeMock: (element) => {
                        return {
                            offsetHeight: 1,
                            offsetTop: 1
                        };
                    }
                };
                const result = renderer.create(content, options).toJSON();

                expect(result).toMatchSnapshot();
            })
        });

        describe('Has data', () => {
            const dataItem = {
                Date: '2017-01-01T12:00:00',
                ExternalId: 'ExternalId',
                SystemId: 'SystemId',
                CurrencyName: 'CurrencyName',
                CurrencyId: 1,
                Turnover: 'Turnover',
                NetTurnover: 'NetTurnover',
                TotalTransaction: 'TotalTransaction',
                CustomerWL: 'CustomerWL',
                CustomerComm: 'CustomerComm',
                CustomerWLTotal: 'CustomerWLTotal',
                LicenseeWL: 'LicenseeWL',
                AmountDueTo: 'AmountDueTo',
                LicenseeComm: 'LicenseeComm',
                LicenseeWLTotal: 'LicenseeWLTotal'
            };

            const gridData = {
                DataList: [dataItem],
                TotalDataList: [dataItem],
                SummaryTotal: {
                    'Currency': dataItem
                }
            };

            const headerName = {
                index: '#',
                date: 'Date',
                month: 'Month',
                externalId: 'ExternalId',
                systemId: 'SystemId',
                currency: 'Currency',
                turnover: 'Turnover',
                netTurnover: 'NetTurnover',
                totalTransaction: 'TotalTransaction',
                customer: 'Customer',
                customerWL: 'CustomerW_L',
                customerComm: 'CustomerComm',
                total: 'Total',
                licensee: 'Licensee',
                licenseeWL: 'LicenseeW_L',
                amountDueTo: 'AmountDueTo',
                licenseeComm: 'LicenseeComm',
            };  

            it('grid data should be rendered correctly',() => {
                const props = { 
                    isAllowedCustomerComm: false,
                    licenseeId: 2,
                    gridData: { level: ReportLevel.MAIN, data: gridData },
                    params: { ReportBy: ReportBy.DAILY }
                };

                const dataGrid = new DataGrid(props);
                dataGrid.drillDownParams[ReportLevel.MAIN] = props.params;

                const content = dataGrid.render();

                const options = {
                    createNodeMock: (element) => {
                        return {
                            offsetHeight: 1,
                            offsetTop: 1
                        };
                    }
                };
                const result = renderer.create(content, options).toJSON();

                expect(result).toMatchSnapshot();
            });

            describe('_buildHeader', () => {              
                it('level MAIN - render header with Date column', () => {
                    const props = {
                        isAllowedCustomerComm: false,
                        licenseeId: 1
                    };
                    const grid = new DataGrid(props);

                    const header = renderer.create(<div>{grid._buildHeader(ReportLevel.MAIN, ReportBy.DAILY)}</div>);
                    const result = header.toJSON().children[0];

                    expect(result.children[1].props.title).toEqual(headerName.date);
                    expect(result.children[2].props.title).toEqual(headerName.currency);
                });

                it('level MAIN & report by MONTHLY - render header with Month column', () => {
                    const props = {
                        isAllowedCustomerComm: false,
                        licenseeId: 1
                    };
                    const grid = new DataGrid(props);

                    const header = renderer.create(<div>{grid._buildHeader(ReportLevel.MAIN, ReportBy.MONTHLY)}</div>);
                    const result = header.toJSON().children[0];

                    expect(result.children[1].props.title).toEqual(headerName.month);
                    expect(result.children[2].props.title).toEqual(headerName.currency);
                });

                it('level LICENSEE - render header with SystemId column', () => {
                    const props = {
                        isAllowedCustomerComm: false,
                        licenseeId: 1
                    };
                    const grid = new DataGrid(props);

                    const header = renderer.create(<div>{grid._buildHeader(ReportLevel.LICENSEE, ReportBy.DAILY)}</div>);
                    const result = header.toJSON().children[0];

                    expect(result.children[1].props.title).toEqual(headerName.systemId);
                    expect(result.children[2].props.title).toEqual(headerName.currency);
                });

                it('level CUSTOMER - render header with SystemId & ExternalId column', () => {
                    const props = {
                        isAllowedCustomerComm: false,
                        licenseeId: 1
                    };
                    const grid = new DataGrid(props);

                    const header = renderer.create(<div>{grid._buildHeader(ReportLevel.CUSTOMER, ReportBy.DAILY)}</div>);
                    const result = header.toJSON().children[0];

                    expect(result.children[1].props.title).toEqual(headerName.externalId);
                    expect(result.children[2].props.title).toEqual(headerName.systemId);
                    expect(result.children[3].props.title).toEqual(headerName.currency);
                });

                it('is allowed Customer Comm - render customer columns', () => {
                    const props = {
                        isAllowedCustomerComm: true,
                        licenseeId: 1
                    };
                    const grid = new DataGrid(props);

                    const header = renderer.create(<div>{grid._buildHeader(ReportLevel.LICENSEE, ReportBy.DAILY)}</div>);
                    const result = header.toJSON();

                    expect(result.children[0].children[6].props.title).toEqual(headerName.customer);
                    expect(result.children[1].children[0].props.title).toEqual(headerName.customerWL);
                    expect(result.children[1].children[1].props.title).toEqual(headerName.customerComm);
                    expect(result.children[1].children[2].props.title).toEqual(headerName.total);
                });

                it('is not allowedCustomerComm - do not render customer columns', () => {
                    const props = {
                        isAllowedCustomerComm: false,
                        licenseeId: 1
                    };
                    const grid = new DataGrid(props);

                    const header = renderer.create(<div>{grid._buildHeader(ReportLevel.LICENSEE, ReportBy.DAILY)}</div>);
                    const result = header.toJSON();

                    expect(result.children[0].children[6].props.title).toEqual(headerName.customerWL);
                    expect(result.children[1].children[0].props.title).toEqual(headerName.licenseeWL);
                });
            });

            describe('_buildBody', () => {
                const drillDownLink = '<a>Drill down link</a>';
                const betListLink = '<a>Bet list link</a>';
                const cells = '<td>cell</td>';
                const data = gridData;

                it('level MAIN - render body with Date column', () => {
                    const props = {
                        isAllowedCustomerComm: false,
                        licenseeId: 1,
                        gridData: { data: data }
                    };
                    const grid = new DataGrid(props);
                    grid._renderDrillDownLink = jest.fn( () => drillDownLink );
                    grid._buildCell = jest.fn( () => cells );
                    const expectedDate = '01/01/2017';

                    const body = renderer.create(<div>{grid._buildBody(ReportLevel.MAIN, ReportBy.DAILY)}</div>);
                    const result = body.toJSON().children[0];

                    expect(result.children[1].props.title).toEqual(expectedDate);
                    expect(result.children[2].props.title).toEqual(data.DataList[0].CurrencyName);
                    expect(result.children[2].children[0].toString()).toEqual(drillDownLink);
                });

                it('level MAIN & report by MONTHLY - render header with Month column', () => {
                    const props = {
                        isAllowedCustomerComm: false,
                        licenseeId: 1,
                        gridData: { data: data }
                    };
                    const grid = new DataGrid(props);
                    grid._renderDrillDownLink = jest.fn( () => drillDownLink );
                    grid._buildCell = jest.fn( () => cells );
                    const expectedMonth = '01/2017';

                    const body = renderer.create(<div>{grid._buildBody(ReportLevel.MAIN, ReportBy.MONTHLY)}</div>);
                    const result = body.toJSON().children[0];

                    expect(result.children[1].props.title).toEqual(expectedMonth);
                    expect(result.children[2].props.title).toEqual(data.DataList[0].CurrencyName);
                    expect(result.children[2].children[0].toString()).toEqual(drillDownLink);
                });

                it('level LICENSEE - render header with SystemId column', () => {
                    const props = {
                        isAllowedCustomerComm: false,
                        licenseeId: 1,
                        gridData: { data: data }
                    };
                    const grid = new DataGrid(props);
                    grid._renderDrillDownLink = jest.fn( () => drillDownLink );
                    grid._buildCell = jest.fn( () => cells );

                    const body = renderer.create(<div>{grid._buildBody(ReportLevel.LICENSEE, ReportBy.DAILY)}</div>);
                    const result = body.toJSON().children[0];

                    expect(result.children[1].props.title).toEqual(data.DataList[0].SystemId);
                    expect(result.children[1].children[0].toString()).toEqual(drillDownLink);
                    expect(result.children[2].props.title).toEqual(data.DataList[0].CurrencyName);                    
                });

                it('level CUSTOMER - render header with SystemId & ExternalId column', () => {
                    const props = {
                        isAllowedCustomerComm: false,
                        licenseeId: 1,
                        gridData: { data: data }
                    };
                    const grid = new DataGrid(props);
                    grid._renderBetListLink = jest.fn( () => betListLink );
                    grid._buildCell = jest.fn( () => cells );

                    const body = renderer.create(<div>{grid._buildBody(ReportLevel.CUSTOMER, ReportBy.DAILY)}</div>);
                    const result = body.toJSON().children[0];

                    expect(result.children[1].props.title).toEqual(data.DataList[0].ExternalId);
                    expect(result.children[2].props.title).toEqual(data.DataList[0].SystemId);
                    expect(result.children[3].props.title).toEqual(data.DataList[0].CurrencyName);  
                });
            });

            describe('_buildFooter', () => {
                const cells = '<td>cell</td>';
                const data = gridData;

                const totalText = {
                    total: 'Total',
                    totalIn: 'Totalin'
                };

                it('render with correct text', () => {
                    const props = {
                        licenseeId: 1,
                        gridData: { data: data }
                    };
                    const grid = new DataGrid(props);
                    grid._buildCell = jest.fn( () => cells );
                    const expectedTotalText = totalText.total;
                    const expectedSummaryColSpan = totalText.totalIn + ' ' + Object.keys(data.SummaryTotal)[0];

                    const footer = renderer.create(<div>{grid._buildFooter(ReportLevel.MAIN)}</div>);
                    const result = footer.toJSON();

                    const firstCellOfTotalRow = result.children[0].children[0];
                    const firstCellOfSummaryRow = result.children[1].children[0];

                    expect(firstCellOfTotalRow.props.title).toEqual(expectedTotalText);
                    expect(firstCellOfSummaryRow.props.title).toEqual(expectedSummaryColSpan);
                });

                it('level MAIN - render with correct colSpan', () => {
                    const props = {
                        licenseeId: 1,
                        gridData: { data: data }
                    };
                    const grid = new DataGrid(props);
                    grid._buildCell = jest.fn( () => cells );
                    const expectedTotalColSpan = 2;
                    const expectedSummaryColSpan = 3;

                    const footer = renderer.create(<div>{grid._buildFooter(ReportLevel.MAIN)}</div>);
                    const result = footer.toJSON();

                    const firstCellOfTotalRow = result.children[0].children[0];
                    const firstCellOfSummaryRow = result.children[1].children[0];

                    expect(firstCellOfTotalRow.props.colSpan).toEqual(expectedTotalColSpan);
                    expect(firstCellOfSummaryRow.props.colSpan).toEqual(expectedSummaryColSpan);
                });

                it('level LICENSEE - render with correct colSpan', () => {
                    const props = {
                        licenseeId: 1,
                        gridData: { data: data }
                    };
                    const grid = new DataGrid(props);
                    grid._buildCell = jest.fn( () => cells );
                    const expectedTotalColSpan = 2;
                    const expectedSummaryColSpan = 3;

                    const footer = renderer.create(<div>{grid._buildFooter(ReportLevel.LICENSEE)}</div>);
                    const result = footer.toJSON();

                    const firstCellOfTotalRow = result.children[0].children[0];
                    const firstCellOfSummaryRow = result.children[1].children[0];

                    expect(firstCellOfTotalRow.props.colSpan).toEqual(expectedTotalColSpan);
                    expect(firstCellOfSummaryRow.props.colSpan).toEqual(expectedSummaryColSpan);
                });

                it('level CUSTOMER - render with correct colSpan', () => {
                    const props = {
                        licenseeId: 1,
                        gridData: { data: data }
                    };
                    const grid = new DataGrid(props);
                    grid._buildCell = jest.fn( () => cells );
                    const expectedTotalColSpan = 3;
                    const expectedSummaryColSpan = 4;

                    const footer = renderer.create(<div>{grid._buildFooter(ReportLevel.CUSTOMER)}</div>);
                    const result = footer.toJSON();

                    const firstCellOfTotalRow = result.children[0].children[0];
                    const firstCellOfSummaryRow = result.children[1].children[0];

                    expect(firstCellOfTotalRow.props.colSpan).toEqual(expectedTotalColSpan);
                    expect(firstCellOfSummaryRow.props.colSpan).toEqual(expectedSummaryColSpan);
                });

                it('level is invalid - render with correct colSpan', () => {
                    const props = {
                        licenseeId: 1,
                        gridData: { data: data }
                    };
                    const grid = new DataGrid(props);
                    grid._buildCell = jest.fn( () => cells );
                    const expectedTotalColSpan = 2;
                    const expectedSummaryColSpan = 3;

                    const footer = renderer.create(<div>{grid._buildFooter(100)}</div>);
                    const result = footer.toJSON();

                    const firstCellOfTotalRow = result.children[0].children[0];
                    const firstCellOfSummaryRow = result.children[1].children[0];

                    expect(firstCellOfTotalRow.props.colSpan).toEqual(expectedTotalColSpan);
                    expect(firstCellOfSummaryRow.props.colSpan).toEqual(expectedSummaryColSpan);
                });

                it('build total rows - return correct merged column', () => {
                    const props = {
                        licenseeId: 1,
                        gridData: {
                            data: {
                                TotalDataList: [data.DataList[0], data.DataList[0]],
                                SummaryTotal: {}
                            }
                        }
                    };
                    const grid = new DataGrid(props);
                    grid._buildCell = jest.fn( () => cells );
                    const expectedRowSpan = 2;

                    const footer = renderer.create(<div>{grid._buildFooter(0)}</div>);
                    const result = footer.toJSON();

                    const firstCellOffirstRow = result.children[0].children[0];
                    const firstCellOfSecondRow = result.children[1].children[0];

                    expect(firstCellOffirstRow.props.rowSpan).toEqual(expectedRowSpan);
                    expect(firstCellOffirstRow.props.title).toEqual(totalText.total);
                    expect(firstCellOfSecondRow.props.title).toEqual(props.gridData.data.TotalDataList[1].CurrencyName);
                });
            });

            describe('_buildCell', () => {
                const item = gridData.DataList[0];

                it('is allowed Customer Comm - render customer columns', () => {
                    const props = {
                        isAllowedCustomerComm: true,
                        licenseeId: 1
                    };
                    const grid = new DataGrid(props);

                    const body = renderer.create(<div>{grid._buildCell(item)}</div>);
                    const result = body.toJSON();

                    expect(result.children[3].props.title).toEqual(item.CustomerWL);
                    expect(result.children[4].props.title).toEqual(item.CustomerComm);
                    expect(result.children[5].props.title).toEqual(item.CustomerWLTotal);
                    expect(result.children[6].props.title).toEqual(item.LicenseeWL);
                });

                it('is not allowedCustomerComm - do not render customer columns', () => {
                    const props = {
                        isAllowedCustomerComm: false,
                        licenseeId: 1
                    };
                    const grid = new DataGrid(props);

                    const body = renderer.create(<div>{grid._buildCell(item)}</div>);
                    const result = body.toJSON();

                    expect(result.children[3].props.title).toEqual(item.CustomerWL);
                    expect(result.children[4].props.title).toEqual(item.LicenseeWL);
                });

                it('LicenseeWL value < 0 - render negative number', () => {
                    const props = {
                        isAllowedCustomerComm: false,
                        licenseeId: 1
                    };
                    const grid = new DataGrid(props);
                    const cell = { ...item, LicenseeWL: -1 };

                    const body = renderer.create(<div>{grid._buildCell(cell)}</div>);
                    const result = body.toJSON();

                    expect(result.children[4].props.title).toEqual(cell.LicenseeWL);
                    expect(result.children[4].props.className).toEqual('right-align negative');
                });

                it('LicenseeWL value > 0 - do not render negative number', () => {
                    const props = {
                        isAllowedCustomerComm: false,
                        licenseeId: 1
                    };
                    const grid = new DataGrid(props);
                    const cell = { ...item, LicenseeWL: 1 };

                    const body = renderer.create(<div>{grid._buildCell(cell)}</div>);
                    const result = body.toJSON();

                    expect(result.children[4].props.title).toEqual(cell.LicenseeWL);
                    expect(result.children[4].props.className).toEqual('right-align ');
                });

                it('LicenseeWLTotal value < 0 - render negative number', () => {
                    const props = {
                        isAllowedCustomerComm: false,
                        licenseeId: 1
                    };
                    const grid = new DataGrid(props);
                    const cell = { ...item, LicenseeWLTotal: -1 };

                    const body = renderer.create(<div>{grid._buildCell(cell)}</div>);
                    const result = body.toJSON();

                    expect(result.children[7].props.title).toEqual(cell.LicenseeWLTotal);
                    expect(result.children[7].props.className).toEqual('right-align negative');
                    });

                    it('LicenseeWLTotal value > 0 - do not render negative number', () => {
                    const props = {
                        isAllowedCustomerComm: false,
                        licenseeId: 1
                    };
                    const grid = new DataGrid(props);
                    const cell = { ...item, LicenseeWLTotal: 1 };

                    const body = renderer.create(<div>{grid._buildCell(cell)}</div>);
                    const result = body.toJSON();

                    expect(result.children[7].props.title).toEqual(cell.LicenseeWLTotal);
                    expect(result.children[7].props.className).toEqual('right-align ');
                });
            });

            describe('_renderDrillDownLink', () => {
                const text = 'text',
                    level = 1,
                    date = '01/01/2017',
                    currencyId = 1,
                    currencyName = 'USD',
                    custId = 1;
                const drillDownOnClickHandle = jest.fn();

                let drillDownLink = {};

                beforeAll(() => {
                    const props = {
                        isAllowedCustomerComm: true,
                        licenseeId: 1
                    };
                    const grid = new DataGrid(props);
                    grid._drillDownData = drillDownOnClickHandle;

                    drillDownLink = renderer.create(grid._renderDrillDownLink(text, level, date, currencyId, currencyName, custId)).toJSON();
                });

                it('return correct content', () => {
                    expect(drillDownLink.children[0].toString()).toEqual(text);
                });

                it('onClick - call drill down method', () => {
                    drillDownLink.props.onClick();

                    expect(drillDownOnClickHandle).toHaveBeenCalledWith(level, date, currencyId, currencyName, custId);
                });
            });

            describe('_renderBetListLink', () => {
                const text = 'text',
                    externalId = 'externalId',
                    systemId = 'systemId',
                    custId = 1;
                const showBetListPopup = jest.fn();

                let betListLink = {};

                beforeAll(() => {
                    const props = {
                        isAllowedCustomerComm: true,
                        licenseeId: 1
                    };
                    const grid = new DataGrid(props);
                    grid.showBetListPopup = showBetListPopup;

                    betListLink = renderer.create(grid._renderBetListLink(text, externalId, systemId, custId)).toJSON();
                });

                it('return correct content', () => {
                    expect(betListLink.children[0].toString()).toEqual(text);
                });

                it('onClick - call drill down method', () => {
                    betListLink.props.onClick();

                    expect(showBetListPopup).toHaveBeenCalledWith(externalId, systemId, custId);
                });
            });
        });
    });
});