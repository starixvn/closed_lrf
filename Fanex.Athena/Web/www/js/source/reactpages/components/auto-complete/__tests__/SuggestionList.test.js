import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import renderer from 'react-test-renderer';
import axios from 'axios';
import SuggestionList from '../SuggestionList';

describe('SuggestionList', () => {
    it('render correctly', () => {
        const props = { 
            width: 100,
            selectedIndex: 1,
            dataList: [ 1, 2, { value: 3 } ]
        }; 

        const shallowRenderer = new ShallowRenderer();
        const result = shallowRenderer.render(<SuggestionList {...props} />);
            
        expect(result).toMatchSnapshot();
    })

    it('on click in a item of suggestion list - call props.onSelect', () => {
        const props = { 
            width: 100,
            selectedIndex: 1,
            dataList: [ 1, 2, { value: 3 } ],
            onSelect: jest.fn()
        }; 
        const component = renderer.create(<SuggestionList {...props} />);
        const item0 = component.root.findAllByProps({ className: 'ac-item' })[0];

        item0.props.onClick();
            
        expect(props.onSelect).toHaveBeenCalledWith(props.dataList[0]);
        expect(component.toJSON()).toMatchSnapshot();
    })
})