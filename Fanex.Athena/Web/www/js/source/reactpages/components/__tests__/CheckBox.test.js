import React from 'react'
import renderer from 'react-test-renderer'

import CheckBox from '../CheckBox'

describe('CheckBox ', () => {
    it('render with default props', () => {
        const props = { id: 'default'};
        const component = renderer.create(<CheckBox {...props} />);

        const result = component.toJSON();

        expect(result).toMatchSnapshot();
    });

    it('render with given props', () => {
        const props = { id: 'C', lable: 'CheckBox', checked: true, disable: false};
        const component = renderer.create(<CheckBox {...props} />);

        const result = component.toJSON();

        expect(result).toMatchSnapshot();
    });

    it('call onChange with correct parameter', () => {
        const props = { id: 'C', lable: 'CheckBox', checked: true, disable: false, onChange: jest.fn()};
        const component = renderer.create(<CheckBox {...props} />);

        const checkboxInput = component.root.findByProps({ type: 'checkbox' });
        checkboxInput.props.onChange();

        expect(props.onChange).toHaveBeenCalledWith(!props.checked);
    });
});