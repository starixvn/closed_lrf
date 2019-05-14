import React from 'react'
import renderer from 'react-test-renderer'

import RadioGroup from '../RadioGroup'
import Radio from '../Radio'

describe('RadioGroup ', () => {
    it('render with default props', () => {
        const props = { options: [{ label: 'Radio1', value: 1 }] };
        const component = renderer.create(<RadioGroup {...props} />);

        const result = component.toJSON();

        expect(result).toMatchSnapshot();
    });

    it('render with given props', () => {
        const props = { 
            label: 'Radio group', 
            name: 'RadioGroup',
            options: [{ label: 'Radio1', value: 1 }, {lable: 'Radio2', value: 2}],
            value: 2
        };
        const component = renderer.create(<RadioGroup {...props} />);

        const result = component.toJSON();

        expect(result).toMatchSnapshot();
    });

    it('call onChange with correct parameter', () => {
        const props = { 
            label: 'Radio group', 
            name: 'RadioGroup',
            options: [{ label: 'Radio1', value: 1 }, {lable: 'Radio2', value: 2}],
            value: 2,
            onChange: jest.fn()
        };

        let currentValue = props.value;
        const component = renderer.create(<RadioGroup {...props} />);

        const radio1 = component.root.findAllByType(Radio)[0];     
        radio1.props.onChange(radio1.props.value);        

        expect(props.onChange).toHaveBeenCalledWith(radio1.props.value);
    });

    it('onChange - return if new value is the same with state', () => {
        const props = { 
            label: 'Radio group', 
            name: 'RadioGroup',
            options: [{ label: 'Radio1', value: 1 }, {lable: 'Radio2', value: 2}],
            value: 2,
            onChange: jest.fn()
        };

        let currentValue = props.value;
        const component = renderer.create(<RadioGroup {...props} />);

        const radio1 = component.root.findAllByType(Radio)[1];     
        radio1.props.onChange(radio1.props.value);        

        expect(props.onChange).not.toHaveBeenCalled();
        });
});