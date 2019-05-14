jest.mock('react-redux')
jest.mock('redux')
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../../actions/index.js'

describe('connect ', () => {
    let mapStateToProps, mapDispatchToProps;
    const connectMock = jest.fn();

    beforeAll(() => {
        connect.mockImplementation((mapStateToPropsFunc, mapDispatchToPropsFunc) => {
            mapStateToProps = mapStateToPropsFunc;
            mapDispatchToProps = mapDispatchToPropsFunc;
            return connectMock;
        });
        require('../AppContainer').default;
    });

    afterAll(() => {
        jest.resetAllMocks();
    })

    it('props should be mapped correctly', () => {
        const expectedResult = {
            isLoading: false,
            reportTitle: 'reportTitle'
        };

        const state = {
            reportTitle: 'reportTitle',
            isLoading: false,
            state1: 1,
            state2: 2
        }

        const result = mapStateToProps(state);

        expect(result).toEqual(expectedResult);
    })

    it('returned function of connect should be called with correct parameter', () => {
        const AppContainer = require('../AppContainer').AppContainer;

        expect(connectMock).toHaveBeenCalledWith(AppContainer);
    })

    it('bindActionCreators should be called with correct parameter', () => {
        const mockBindAction = jest.fn();
        bindActionCreators.mockImplementationOnce(mockBindAction);

        const dispatch = {};

        mapDispatchToProps(dispatch);

        expect(mockBindAction).toHaveBeenCalledWith(ActionCreators, dispatch);
    })
})