import React from 'react';
import { AppContainer } from '../AppContainer';
import ShallowRenderer from 'react-test-renderer/shallow';

describe('AppContainer ', () => {
    it('render correctly', () => {
        const renderer = new ShallowRenderer();
        
        const result = renderer.render(<AppContainer isLoading={true} />);

        expect(result).toMatchSnapshot();
    });
});