import React from 'react'
import ReportTitle from '../ReportTitle'
import renderer from 'react-test-renderer'

describe('ReportTitle ', () => {
    it('props content is undefined - component render correctly', () => { 
        const props = {};

        const component = renderer.create(<ReportTitle {...props} />);

        const result = component.toJSON(); 
        
        expect(result).toMatchSnapshot(); 
    });

    it('props content is not empty - component render correctly', () => {
        const props = {
            content: "Title"
        };

        const component = renderer.create(<ReportTitle {...props} />); 

        const result = component.toJSON(); 

        expect(result).toMatchSnapshot(); 
    });
})