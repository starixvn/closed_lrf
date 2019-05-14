import React, { Component } from 'react';
import Overlay from '../Overlay';
import PropTypes from 'prop-types';

class Day extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = { showDateDrop: false };
    }

    static propTypes = {
        label: PropTypes.string,
        value: PropTypes.number.isRequired,
        min: PropTypes.number.isRequired,
        max: PropTypes.number.isRequired,
        onChange: PropTypes.func
    }

    static defaultProps = {
        onChange: function() {}
    }

    _renderOption(min, max, value) {
        let options =[];

        for (let i = min; i <= max; i++) {
            options.push(
                <li key={i} onClick={() => this._onChange(i)}>
                    <a href='javascript:;'>{i}</a>
                </li>
            );
        }

        return options;
    }

    _onChange(value) {
        this.props.onChange(parseInt(value, 10));
        this.setState({showDateDrop: false});
    }

    render() {
        const value = this.props.value;

        return (
            <div className='date'>
                <label className='label-text'>{this.props.label}</label>
                <div className='date-content'>
                    <div className='date-container'>
                        <div className='date-picked' onClick={() => this.setState({showDateDrop: true})}>
                            <span className='date-label'>{value}</span>
                            <a href='javascript:;'>
                                <span className='arrow-icon down-arrow'></span>
                            </a>
                        </div>
                        <Overlay isOpening={this.state.showDateDrop} onClose={() => this.setState({showDateDrop: false})}>
                            {
                                this.state.showDateDrop &&
                                <div className='date-selection-container'>
                                    <ul>
                                        {this._renderOption(this.props.min, this.props.max, value)}
                                    </ul>
                                </div>
                            }
                        </Overlay>
                    </div>
                </div>
            </div>
        );
    }
}

export default Day;
