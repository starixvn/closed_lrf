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
            requestParam: '123',
            dateRange: {},
            selectedProduct: 'BA',
            sportList: "1234",
            selectedSport: 1,
            selectedBettype: 2,
            bettypeList: 3,
            selectedLeague: "5",
            leagueList: 6546,
            selectedMatch: 5,
            matchList: 987,
            selectedCurrency: "sd",
            baseCurrencyList: "sdfsdfsdfsdf",
            selectedBaseCurrency: 'USD',
            selectedStatus: 'status',
            selectedLiveStatus: 'Live',
            otherProps: 'xxxxxxxxxxxxxxxxxxxx'
        }
        
        const expectedProps = { 
            requestParam: '123',
            dateRange: {},
            selectedProduct: 'BA',
            sportList: "1234",
            selectedSport: 1,
            selectedBettype: 2,
            bettypeList: 3,
            selectedLeague: "5",
            leagueList: 6546,
            selectedMatch: 5,
            matchList: 987,
            selectedCurrency: "sd",
            baseCurrencyList: "sdfsdfsdfsdf",
            selectedBaseCurrency: 'USD',
            selectedStatus: 'status',
            selectedLiveStatus: 'Live' }

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