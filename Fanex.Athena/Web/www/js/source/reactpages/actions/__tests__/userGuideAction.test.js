import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'

import * as actions from '../userGuideAction'
import * as types from '../types'

import Site from '../../lib/site'
import axios from 'axios'

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('userGuideAction', () => {
    beforeAll(() => {
        Site.resolveClientUrl = jest.fn((url) => url);
        jest.mock('axios');
    });

    afterAll(() => {
        jest.resetAllMocks();
    })

    describe('getUserGuideContent', () => {
        const expectedUrl = 'UserGuide/Index?resourcename=';
        const fakeDataResponse = {
            data: '<div></div>'
        };
        const resourceName = 'resourceName';

        const expectedHeader = {
            'X-Requested-With': 'XMLHttpRequest'
        };

        beforeAll(() => {
            const promise = Promise.resolve(fakeDataResponse);
            axios.get = jest.fn((url, option) => promise);
        })

        it('dispatch correct action', () => {
            const expectedActions = [
                { type: types.USER_GUIDE_CONTENT, data: fakeDataResponse.data }
            ];
            const store = mockStore({ userGuideContent: '' });
            store.dispatch(actions.getUserGuideContent(resourceName));

            Promise.resolve().then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            })
        })

        it('axios.get should be called with correct parameters', () => {
            const store = mockStore({ userGuideContent: '' });
            store.dispatch(actions.getUserGuideContent(resourceName));

            Promise.resolve().then(() => {
                expect(axios.get.mock.calls[0][1]).toEqual({ headers: expectedHeader });
                expect(axios.get.mock.calls[0][0]).toContain(expectedUrl + resourceName + '&_=');
                expect(axios.get).toHaveBeenCalled();
            })
        })
    })

    describe('setUserGuideContent', () => {
        it('create an correct action', () => {
            const data = '<div></div>';
            const expectedAction = {
                type: types.USER_GUIDE_CONTENT,
                data: data
            }

            const result = actions.setUserGuideContent(data);

            expect(result).toEqual(expectedAction);
        })
    })
})