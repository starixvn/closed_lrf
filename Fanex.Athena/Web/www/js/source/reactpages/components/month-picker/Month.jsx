import React, { Component } from 'react';
import Overlay from '../Overlay';
import LangHelper from '../../lib/langHelper';
import PropTypes from 'prop-types';

class Month extends Component {
    constructor(props, context) {
        super(props, context);

        const shortMonths = LangHelper.getResources(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);
        const fullMonths = LangHelper.getResources(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']);

        this.shortMonths = shortMonths;
        this.fullMonths = fullMonths;

        this.state = { expandYear: props.value.year, showMonthDrop: false };
    }

    static propTypes = {
        label: PropTypes.string,
        value: PropTypes.object.isRequired,
        min: PropTypes.object.isRequired,
        max: PropTypes.object.isRequired,
        onChange: PropTypes.func
    }

    static defaultProps = {
        label: 'View data in month',
        onChange: function() {}
    }

    _onChange(value) { 
        this.props.onChange(value);
        this.setState({showMonthDrop: false});
    }

    _formatString(month, year) {
        return this.shortMonths[month] + ' ' + year;
    }

    _renderOption(min, max, value) {
        let options = [];
        for (let i = min.year; i <= max.year; i++) {
            if (i === this.state.expandYear) {

                options.push(
                    <li key={i} className='year' style={{fontWeight:'bold'}}>
                        <a href='javascript:;'>{i}</a>
                    </li>
                );

                const minMonth = i === min.year ? min.month : 0;
                const maxMonth = i === max.year ? max.month : 11;

                for (let j = minMonth; j <= maxMonth; j++) {
                    const isSelected = i === value.year && j === value.month;
                    const valueItem = { year: i, month: j };

                    options.push(
                        <li key={`${j}${i}`} className='month-option' onClick={() => this._onChange(valueItem) }>
                           <a href='javascript:;' className={`${isSelected ? 'selected' : ''}`}>{this.fullMonths[j]}</a>
                        </li>
                    );
                }
            }
            else {
                options.push(
                    <li key={i} className='year' onClick={() => this.setState({expandYear: i})}>
                        <a href='javascript:;'>{i}</a>
                    </li>
                );
            }
        }

        return options;
    }

    _getNextMonth() {
        let month = this.props.value.month + 1;
        let year = this.props.value.year;

        if (month > 11) {
            month = 0;
            year += 1;
        }

        return { year: year, month: month };
    }

     _getPrevMonth() {
        let month = this.props.value.month - 1;
        let year = this.props.value.year;

        if (month < 0) {
            month = 11;
            year -= 1;
        }

        return { year: year, month: month };
    }

    _checkValidMonth(month, year) {
        const {min,max} = this.props;

        return (year > min.year && year < max.year) || (year === min.year && month >= min.month ) || (year === max.year && month <= max.month);
    }

    _goToMonth(e, value) {
        e.preventDefault();

        if (value.year !== this.state.expandYear) {
            this.setState({expandYear: value.year});
        }

        this.props.onChange(value);
    }

    render() {
        const nexMonth = this._getNextMonth();
        const preMonth = this._getPrevMonth();
        const validNexMonth = this._checkValidMonth(nexMonth.month, nexMonth.year);
        const validPreMonth = this._checkValidMonth(preMonth.month, preMonth.year);
        const value = this.props.value;

        return (
            <div className='month'>
                <label className='label-text'>{this.props.label}</label>
                <div className='month-content'>
                    <div className='month-container'>
                        <div className='month-picked'>
                            <a href='javascript:;' className='prev' onClick={(e) => validPreMonth && this._goToMonth(e, preMonth)}>
                                <span className={`arrow-icon left-arrow ${validPreMonth ? '' : 'disable'}`}></span>
                            </a>
                            <span className='month-label' onClick={() => this.setState({showMonthDrop: true})}>{this._formatString(value.month, value.year)}</span>
                            <a href='javascript:;' className='next' onClick={(e) => validNexMonth && this._goToMonth(e, nexMonth)}>
                                <span className={`arrow-icon right-arrow ${validNexMonth ? '' : 'disable'}`}></span>
                            </a>
                        </div>
                        <Overlay isOpening={this.state.showMonthDrop} onClose={() => this.setState({showMonthDrop: false})}>
                            {
                                this.state.showMonthDrop && 
                                <div className='month-selection-container'>
                                    <ul className='month-selection'>
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

 export default Month;
