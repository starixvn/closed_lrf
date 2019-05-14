import React from 'react'

import { Service } from '../../lib/service'
import { AppContainer } from '../AppContainer'
import { ReportLevel } from '../../../../constants/report'

const defaultProps = {
    isLoading: false,
    reportTitle: ''
};

describe('AppContainer ', () => {
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

        it("reportTitle is null - do not render report title", () => {
            const appContainer = new AppContainer(defaultProps);
            const tree = appContainer.render();

            const resultContainer = tree.props.children[2];
            const reportTitle = resultContainer.props.children[0];

            expect(reportTitle).toBe(undefined);
        })

        it("reportTitle has value - first child in result container should be ReportTitle component with correct prop", () => {
            const props = {
                isLoading: false,
                reportTitle: 'Title'
            };
            const appContainer = new AppContainer(props);
            const tree = appContainer.render();

            const resultContainer = tree.props.children[2];
            const reportTitle = resultContainer.props.children;
            const content = reportTitle.props.content;

            expect(content).toBe(props.reportTitle);
        })

        it("DataGrid should has correct type", () => {
            const appContainer = new AppContainer(defaultProps);
            const tree = appContainer.render();

            const dataGrid = tree.props.children[3];

            const result = dataGrid.type.displayName;

            expect(result).toBe("Connect(DataGrid)");
        })
    })
})