import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class radio extends Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        id: PropTypes.string.isRequired,
        label: PropTypes.string,
        name: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        checked: PropTypes.bool,
        onChange: PropTypes.func
    }

    static defaultProps = {
        label: '',
        name: '',
        value: 0,
        checked: false
    }

    render() {
        return (
            <span>
                <input type="radio" 
                       value={this.props.value} 
                       checked={this.props.checked} 
                       name={this.props.name} 
                       id={this.props.id}
                       onChange={() => this.props.onChange(this.props.value) } />
                <label htmlFor={this.props.id}>{this.props.label}</label>
            </span>
        );
    }
}