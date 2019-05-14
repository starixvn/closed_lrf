import React from 'react'
import Loader from '../Loader'
import renderer from 'react-test-renderer'

describe('Loader ', () => {
    it('isLoading = false - component render correctly', () => { 
        const props = {
            isLoading: false
        };

        const component = renderer.create(<Loader {...props} />);

        const result = component.toJSON(); 
        
        expect(result).toMatchSnapshot(); 
    });

    it('isLoading = true - component render correctly', () => {
        const props = {
            isLoading: true
        };

        const component = renderer.create(<Loader {...props} />); 

        const result = component.toJSON(); 

        expect(result).toMatchSnapshot(); 
    });
})