jest.mock('react-redux')
jest.mock('redux')
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../../actions/index.js'

describe('connect ', () => {
    let mapStateToProps, mapDispatchToProps;
    const connectMock = jest.fn();

    beforeAll(() => {
        connect.mockImplementationOnce((mapStateToPropsFunc, mapDispatchToPropsFunc) => {
            mapStateToProps = mapStateToPropsFunc;
            mapDispatchToProps = mapDispatchToPropsFunc;
            return connectMock;
        });
        require('../DataGrid').default;
    });

    it('props should be mapped correctly', () => {
        const expectedResult = {
            xsrfToken: 'token',
            params: { fromDate: "1/1/2018", toDate: "1/2/2018" }
        }

        const state = {
            xsrfToken: 'token',
            params: { fromDate: "1/1/2018", toDate: "1/2/2018" },
            selectedBaseCurrency: "EUR",
            isLoading: false,
            anotherProp: "Not included"
        }

        const result = mapStateToProps(state);

        expect(result).toEqual(expectedResult);
    })

    it('bindActionCreators should be called with correct parameter', () => {
        const mockBindAction = jest.fn();
        bindActionCreators.mockImplementationOnce(mockBindAction);
        const expectedActionCreator = {
            toggleLoader: ActionCreators.toggleLoader,
            setParams: ActionCreators.setParams
        }

        const dispatch = {};
        mapDispatchToProps(dispatch);

        expect(mockBindAction).toHaveBeenCalledWith(expectedActionCreator, dispatch);
    })

    it('returned function of connect should be called with correct parameter', () => {
        const DataGrid = require('../DataGrid').DataGrid;

        expect(connectMock).toHaveBeenCalledWith(DataGrid);
    })
})