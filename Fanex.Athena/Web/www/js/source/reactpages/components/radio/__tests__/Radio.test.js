import React from 'react'
import renderer from 'react-test-renderer'

import Radio from '../Radio'

describe('Radio ', () => {
    it('render with default props', () => {
        const props = { id: 'default'};
        const component = renderer.create(<Radio {...props} />);

        const result = component.toJSON();

        expect(result).toMatchSnapshot();
    });

    it('render with given props', () => {
        const props = { id: 'R', lable: 'Radio', name: 'inputRadio', value: 0, checked: true};
        const component = renderer.create(<Radio {...props} />);

        const result = component.toJSON();

        expect(result).toMatchSnapshot();
    });

    it('call onChange with correct parameter', () => {
        const props = { id: 'R', lable: 'Radio', name: 'inputRadio', value: 0, checked: false, onChange: jest.fn()};
        const component = renderer.create(<Radio {...props} />);

        const radioInput = component.root.findByProps({ type: 'radio' });
        radioInput.props.onChange();

        expect(props.onChange).toHaveBeenCalledWith(props.value);
    });
});