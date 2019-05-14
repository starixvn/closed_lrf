import React from 'react'
import { DataGrid } from '../datagrid';
import service from '../../lib/service';
import renderer from 'react-test-renderer';

import { defaultProps, totalData, bodyData } from './fakeData';
import { SettingConst } from '../../constants/settingConst';

const Data = [], Total = [];
const { gridData, dateRange, selectedBaseCurrency, selectedCurrency, toggleLoader } = defaultProps;
const dataGridProps = {
    gridData,
    dateRange,
    selectedCurrency,
    selectedBaseCurrency,
    toggleLoader
}

describe('DataGrid', () => {
    afterEach(() => {
        jest.resetAllMocks();
    })

    describe('No data', () => {
        it('return null when gridData is undefined', () => {
            const props = { gridData: {} };
            const dataGrid = renderer.create(<DataGrid {...props} />);

            const result = dataGrid.toJSON();

            expect(result).toBeNull();
        })

        it('gridData length is 0 - render correct content', () => {
            const dataGrid = renderer.create(<DataGrid {...dataGridProps} />);

            const result = dataGrid.toJSON();

            expect(result).toMatchSnapshot();
        })
    })

    describe('Data is not empty', () => {
        const headerText = {
            subsidiary: "Subsidiary",
            currency: "Currency",
            product: "Product",
            betCount: "BetCount",
            turnover: "Turnover",
            customerWL: "CustomerW_L",
            subsidiaryWL_comm: "SubsidiaryWL/ Comm"
        }

        it('_buildHeader - render correct header content', () => {
            service.getHeaderText = jest.fn(() => headerText);

            const dataGrid = new DataGrid(dataGridProps);
            const header = renderer.create(dataGrid._buildHeader());

            const result = header.toJSON();

            expect(result).toMatchSnapshot();
        })

        it('_buildHeader - ReportBySummary - render correct header content', () => {
            service.getHeaderText = jest.fn(() => headerText);

            const dataGrid = new DataGrid(dataGridProps);
            dataGrid.selectedReportBy = SettingConst.GroupByProduct;
            const header = renderer.create(dataGrid._buildHeader());

            const result = header.toJSON();

            expect(result).toMatchSnapshot();
        })

        it('_buildBody - ReportBySummary - render correct body content', () => {
            const props = Object.assign({}, dataGridProps, { gridData: { ...dataGridProps.gridData, Data: bodyData } });
            const dataGrid = new DataGrid(props);
            dataGrid.selectedReportBy = SettingConst.ReportBySummary;
            const bodyWrapper = (<div>{dataGrid._buildBody()}</div>);
            const content = renderer.create(bodyWrapper);

            const result = content.toJSON();

            expect(result).toMatchSnapshot();
        })

        it('_buildBody - GroupByProduct - render correct body content', () => {
            const props = Object.assign({}, dataGridProps, { gridData: { ...dataGridProps.gridData, Data: bodyData } });
            const dataGrid = new DataGrid(props);
            dataGrid.groupBy = SettingConst.GroupByProduct;
            const bodyWrapper = (<div>{dataGrid._buildBody()}</div>);
            const content = renderer.create(bodyWrapper);

            const result = content.toJSON();

            expect(result).toMatchSnapshot();
        })

        it('_buildBody - ReportByDaily - render correct body content', () => {
            const props = Object.assign({}, dataGridProps, { gridData: { ...dataGridProps.gridData, Data: bodyData } });
            const dataGrid = new DataGrid(props);
            dataGrid.selectedReportBy = SettingConst.ReportByDaily;
            const bodyWrapper = (<div>{dataGrid._buildBody()}</div>);
            const content = renderer.create(bodyWrapper);

            const result = content.toJSON();

            expect(result).toMatchSnapshot();
        })

        it('_buildBody - ReportBySummary - Contain negetive value - render correct body content', () => {
            const extendBodyData = {
                "ReportBy": "0001-01-01T00:00:00",
                "GroupBy": "Sportsbook",
                "BetCount": 50,
                "Turnover": 26761.0000,
                "CustomerComm": 960.0000,
                "LicenseeWinLoss": -23646.1700,
                "LicenseeComm": 72.0000,
                "LicenseeNetWinLoss": -22758.1700,
                "Margin": 85.04230036246777026269571391
            };

            const newBodyData = [...bodyData, extendBodyData];
            const props = Object.assign({}, dataGridProps, { gridData: { ...dataGridProps.gridData, Data: newBodyData } });
            const dataGrid = new DataGrid(props);
            dataGrid.selectedReportBy = SettingConst.ReportByDaily;
            const bodyWrapper = (<div>{dataGrid._buildBody()}</div>);
            const content = renderer.create(bodyWrapper);

            const result = content.toJSON();

            expect(result).toMatchSnapshot();
        })

        it('_buildFooter - ReportByDaily - render correct footer content', () => {
            const props = Object.assign({}, dataGridProps, { gridData: { ...dataGridProps.gridData, Total: totalData } });
            const dataGrid = new DataGrid(props);
            dataGrid.selectedReportBy = SettingConst.ReportByDaily;
            dataGrid._buildGrandTotal = jest.fn(() => "Grand Total");
            const totalWrapper = (<div>{dataGrid._buildFooter()}</div>);
            const content = renderer.create(totalWrapper);

            const result = content.toJSON();

            expect(result).toMatchSnapshot();
        })

        it('_buildFooter - ReportBySummary - render correct footer content', () => {
            const props = Object.assign({}, dataGridProps, { gridData: { ...dataGridProps.gridData, Total: totalData } });
            const dataGrid = new DataGrid(props);
            dataGrid.selectedReportBy = SettingConst.ReportBySummary;
            dataGrid._buildGrandTotal = jest.fn(() => "Grand Total");
            const totalWrapper = (<div>{dataGrid._buildFooter()}</div>);
            const content = renderer.create(totalWrapper);

            const result = content.toJSON();

            expect(result).toMatchSnapshot();
        })

        it('_buildFooter - Data contain negative value - render correct footer content', () => {
            const totalData = {
                "ReportBy": "0001-01-01T00:00:00",
                "GroupBy": null,
                "BetCount": 50,
                "Turnover": 130685.73784,
                "CustomerComm": 4688.1024,
                "LicenseeWinLoss": -115474.6524248,
                "LicenseeComm": 351.60768,
                "LicenseeNetWinLoss": -111138.1577048,
                "Margin": 85.04230036246777026269571391
            }
            const props = Object.assign({}, dataGridProps, { gridData: { ...dataGridProps.gridData, Total: totalData } });
            const dataGrid = new DataGrid(props);
            dataGrid.selectedReportBy = SettingConst.ReportBySummary;
            dataGrid._buildGrandTotal = jest.fn(() => "Grand Total");
            const totalWrapper = (<div>{dataGrid._buildFooter()}</div>);
            const content = renderer.create(totalWrapper);

            const result = content.toJSON();

            expect(result).toMatchSnapshot();
        })

        it('grid data should be rendered correctly', () => {
            service.getHeaderText = jest.fn(() => headerText);

            const gridData = { Data: bodyData, Total: totalData };
            const props = Object.assign({}, dataGridProps, { gridData: { ...gridData } });

            const dataGrid = new DataGrid(props);
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
    })

    describe('componentDidUpdate ', () => {
        it('gridData update - toggleLoader function should be called with correct parameter', () => {
            const props = Object.assign({}, dataGridProps);
            const dataGrid = new DataGrid(props);

            props.gridData = { Data: { ...bodyData } } ;
            dataGrid.componentDidUpdate(dataGridProps);

            expect(dataGrid.props.toggleLoader).toHaveBeenCalledWith(false);
        })

        it('gridData do not update - toggleLoader function should not be called', () => {
            const dataGrid = new DataGrid(dataGridProps);

            dataGrid.componentDidUpdate(dataGridProps);

            expect(dataGrid.props.toggleLoader).not.toHaveBeenCalled();
        })
    })
})