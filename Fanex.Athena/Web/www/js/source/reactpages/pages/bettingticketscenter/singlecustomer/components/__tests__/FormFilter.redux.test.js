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
        const state = {
            dateRange: {}, 
            requestParam: "123", 
            isConvertAll: true,
            selectedBaseCurrency: "USD",
            selectedProduct: "BA", 
            username: "Test",
            selectedStatus: "status",
            selectedPlatform: "Asia",
            selectedLiveStatus: "Live",
            anotherProp: 'not included'
        };
        
        const expectedProps = {
            dateRange: {}, 
            requestParam: "123", 
            isConvertAll: true,
            selectedBaseCurrency: "USD",
            selectedProduct: "BA", 
            username: "Test",
            selectedStatus: "status",
            selectedPlatform: "Asia",
            selectedLiveStatus: "Live"
        };

        const result = mapStateToProps(state);

        expect(result).toEqual(expectedProps);
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