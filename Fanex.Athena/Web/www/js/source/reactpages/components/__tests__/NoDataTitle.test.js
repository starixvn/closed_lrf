import React from 'react'
import NoDataTitle from '../NoDataTitle'
import renderer from 'react-test-renderer'
import langHelper from '../../lib/langHelper';

describe('NoDataTitle ', () => {
    afterAll(() => {
        jest.resetAllMocks();
    })

    it('component render correctly', () => {
        langHelper.getSingleResource = jest.fn().mockReturnValueOnce("No Data");

        const component = renderer.create(<NoDataTitle />);

        const result = component.toJSON();

        expect(result).toMatchSnapshot();
    });
})