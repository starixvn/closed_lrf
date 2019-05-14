import React from 'react'

import { Service } from '../../lib/service'
import { AppContainer } from '../AppContainer'
import { ReportLevel } from '../../../../constants/report'

const defaultProps = {
    isLoading: false,
    params: { Timestamp: 1, Level: ReportLevel.MAIN },
    selectedBaseCurrency: "UUS"
};

describe('AppContainer ', () => {
    it('reportTitle should be null after constructing', () => {
        const appContainer = new AppContainer(defaultProps);

        expect(appContainer.reportTitle).toBe(null);
    })

    describe('componentDidUpdate', () => {
        it('params is not changed - do nothing', () => {
            Service.getReportTitle = jest.fn();
            const appContainer = new AppContainer(defaultProps);

            const prevProps = Object.assign({}, defaultProps, { params: { Timestamp: 1 } });
            appContainer.componentDidUpdate(prevProps);

            expect(Service.getReportTitle).not.toHaveBeenCalled();
        })

        it('params is changed - Service.getReportTitle should be called with correct parameter', () => {
            Service.getReportTitle = jest.fn();
            const props = Object.assign({}, defaultProps, { Timestamp: 1, FromDate: '01/01/2018', ToDate: '01/02/2018', BaseCurrency: 'USD' });
            const appContainer = new AppContainer(props);

            const prevProps = Object.assign({}, defaultProps, { Timestamp: 2 });
            appContainer.componentDidUpdate(prevProps);

            expect(Service.getReportTitle).not.toHaveBeenCalledWith(props.FromDate, props.ToDate, props.BaseCurrency);
        })
    })

    describe('render', () => {
        it('Loader should has correct prop', () => {
            const appContainer = new AppContainer(defaultProps);
            const tree = appContainer.render();

            const loader = tree.props.children[0];
            const result = loader.props.isLoading;

            expect(result).toBe(false);
        })

        it('FormFilter should has correct type', () => {
            const appContainer = new AppContainer(defaultProps);
            const tree = appContainer.render();

            const formFilter = tree.props.children[1];
            const result = formFilter.type.displayName;

            expect(result).toBe("Connect(FormFilter)");
        })

        it('result container with class "result-content" should be existed with correct index', () => {
            const appContainer = new AppContainer(defaultProps);
            const tree = appContainer.render();

            const resultContainer = tree.props.children[2];
            const result = resultContainer.props.className;

            expect(result).toBe("result-content");
        })

        it('Breadcrumb should has correct value', () => {
            const appContainer = new AppContainer(defaultProps);
            const tree = appContainer.render();

            const resultContainer = tree.props.children[2];
            const breadcrumb = resultContainer.props.children[0];

            expect(breadcrumb.props.value).toBe(defaultProps.params.Level);
        })

        it('Breadcrumb - onChange - update params correctly', () => {
            let actual = { };
            const props = { 
                params: { Level: ReportLevel.CUSTOMER }, 
                setParams: jest.fn((params) => { actual = params; })
            };
            const appContainer = new AppContainer(props);
            const tree = appContainer.render();

            const resultContainer = tree.props.children[2];
            const breadcrumb = resultContainer.props.children[0];
            breadcrumb.props.onChange();

            expect(actual.Level).toBe(ReportLevel.MAIN);
            expect(actual.SubsidiaryId).toBe(0);
        })

        it("reportTitle is null - first child in result container should be null", () => {
            const appContainer = new AppContainer(defaultProps);
            const tree = appContainer.render();

            const resultContainer = tree.props.children[2];
            const reportTitle = resultContainer.props.children[1];

            expect(reportTitle).toBe(null);
        })

        it("reportTitle has value - first child in result container should be ReportTitle component with correct prop", () => {
            const expectedReportTitleContent = "Title";
            const appContainer = new AppContainer(defaultProps);
            appContainer.reportTitle = expectedReportTitleContent;
            const tree = appContainer.render();

            const resultContainer = tree.props.children[2];
            const reportTitle = resultContainer.props.children[1];
            const content = reportTitle.props.content;

            expect(reportTitle).not.toBe(null);
            expect(content).toBe(expectedReportTitleContent);
        })

        it("third child in result container should be DataGrid", () => {
            const appContainer = new AppContainer(defaultProps);
            const tree = appContainer.render();

            const resultContainer = tree.props.children[2];
            const dataGrid = resultContainer.props.children[2];

            const result = dataGrid.type.displayName;

            expect(result).toBe("Connect(DataGrid)");
        })
    })
})