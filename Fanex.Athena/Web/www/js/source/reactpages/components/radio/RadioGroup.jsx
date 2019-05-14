import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Item from './Radio';

export default class RadioGroup extends Component {
    constructor(props) {
        super(props);

        this.state = { value: props.value };
    }

    static propTypes = {
        label: PropTypes.string,
        name: PropTypes.string,
        options: PropTypes.arrayOf(PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        })).isRequired,
        onChange: PropTypes.func,
        value: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    }

    static defaultProps = {
        label: '',
        name: '',
        value: 0,
        onChange: function() {}
    }

    onChange(value) {
        if (this.state.value === value) {
            return;
        }

        this.setState({ value : value });

        this.props.onChange(value);
    }

    _renderItem() {
        const { options, name } = this.props;
        let radios = [];

        for (let i = 0; i< options.length; i++) {
            const item = options[i];
            const isChecked = item.value === this.state.value;
            const id = `${name}-${item.value}`;

            radios.push(
                <Item key={id}
                    value={item.value}
                    checked={isChecked}
                    name={name}
                    id={id}
                    label={item.label}
                    onChange={(value) => this.onChange(value)} />
            );
        }

        return radios;
    }

    render() {
        return (
            <div className='radio-group'>
                <label className='label-text'>{this.props.label}</label>
                {this._renderItem()}
            </div>    
        );
    }
}
