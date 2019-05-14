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
        require('../FormFilter').default;
    });

    it('props should be mapped correctly', () => {
        const expectedResult = {
            requestParam: '123',
            refno: 321,
            username: 'Test',
            selectedBaseCurrency: 'USD',
            isConvertAll: true
        }

        const state = {
            requestParam: '123',
            refno: 321,
            username: 'Test',
            selectedBaseCurrency: 'USD',
            isConvertAll: true,
            anotherProp: 'not included'
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
        const FormFilter = require('../FormFilter').FormFilter;

        expect(connectMock).toHaveBeenCalledWith(FormFilter);
    })
})