jest.mock('react-redux')
jest.mock('redux')
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../action.js'

describe('connect ', () => {
    let mapStateToProps, mapDispatchToProps;
    const connectMock = jest.fn();

    beforeAll(() => {
        connect.mockImplementationOnce((mapStateToPropsFunc, mapDispatchToPropsFunc) => {
            mapStateToProps = mapStateToPropsFunc;
            mapDispatchToProps = mapDispatchToPropsFunc;
            return connectMock;
        });
        require('../PageLayout').default;
    });

    it('props should be mapped correctly', () => {
        const expectedResult = {
            isConvertAll: true,
            selectedBaseCurrency: 'GBP'
        }

        const state = {
            isConvertAll: true,
            selectedBaseCurrency: 'GBP',
            anotherProp: 'Not included'
        }

        const result = mapStateToProps(state);

        expect(result).toEqual(expectedResult);
    })

    it('bindActionCreators should be called with correct parameter', () => {
        const mockBindAction = jest.fn();
        bindActionCreators.mockImplementationOnce(mockBindAction);

        const dispatch = {};
        mapDispatchToProps(dispatch);

        expect(mockBindAction).toHaveBeenCalledWith(ActionCreators, dispatch);
    })

    it('returned function of connect should be called with correct parameter', () => {
        const PageLayout = require('../PageLayout').PageLayout;

        expect(connectMock).toHaveBeenCalledWith(PageLayout);
    })
})