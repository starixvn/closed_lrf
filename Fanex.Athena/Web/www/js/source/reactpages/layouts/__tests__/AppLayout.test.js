import React from 'react'
import AppLayout from '../AppLayout'
import renderer from 'react-test-renderer'

describe('AppLayout ', () => {
    afterAll(() => {
        jest.resetAllMocks();
    })

    it('component render correctly', () => {
        const component = renderer.create(<AppLayout><div>Content</div></AppLayout>);

        const result = component.toJSON();

        expect(result).toMatchSnapshot();
    });
})