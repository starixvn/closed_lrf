jest.mock('react-redux')
jest.mock('redux')
import { connect } from 'react-redux'

describe('connect ', () => {
    let mapStateToProps;
    const connectMock = jest.fn();

    beforeAll(() => {
        connect.mockImplementation((mapStateToPropsFunc) => {
            mapStateToProps = mapStateToPropsFunc;
            return connectMock;
        });
        require('../AppContainer').default;
    });

    afterAll(() => {
        jest.resetAllMocks();
    })

    it('props should be mapped correctly', () => {
        const expectedResult = {
            isLoading: false
        }

        const state = {
            anotherState: 123,
            isLoading: false
        }

        const result = mapStateToProps(state);

        expect(result).toEqual(expectedResult);
    })

    it('returned function of connect should be called with correct parameter', () => {
        const AppContainer = require('../AppContainer').AppContainer;

        expect(connectMock).toHaveBeenCalledWith(AppContainer);
    })
})