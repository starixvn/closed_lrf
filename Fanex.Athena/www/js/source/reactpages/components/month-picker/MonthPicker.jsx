import React, { Component } from 'react';
import Month from './Month';
import Day from './Day';
import moment from 'moment';
import PropTypes from 'prop-types';

class MonthPicker extends Component {
    constructor(props) {
        super(props);

        const format = 'MM/DD/YYYY';

        const minDate = moment(props.minDate, format);
        const maxDate = moment(props.maxDate, format);

        const min = { year: minDate.year(), month: minDate.month(), date: minDate.date() };
        const max = { year: maxDate.year(), month: maxDate.month(), date: maxDate.date() };
        this.min = min;
        this.max = max;

        const fromDate = moment(props.fromDate, format);
        const toDate = moment(props.toDate, format);

        const currentMonth = { year: fromDate.year(), month: fromDate.month() };

        this.state = {
            month: currentMonth,
            from: fromDate.date(),
            to: toDate.date()
        }
    }

    static propTypes = {
        monthOption: PropTypes.object.isRequired,
        onChange: PropTypes.func,

        minDate: PropTypes.string.isRequired,
        maxDate: PropTypes.string.isRequired,
        fromDate: PropTypes.string.isRequired,
        toDate: PropTypes.string.isRequired,

        showDate: PropTypes.bool
    }

    static defaultProps = {
        label: 'View data in month',
        onChange: function() {},
        fromDateOption: {
            label: 'From'
        },
        toDateOption: {
            label: 'To'
        },
        showDate: true
    }

    _onMonthChange = (value)  => {
        const minDate = value.year === this.min.year && value.month === this.min.month ? this.min.date : 1;
        const maxDate = value.year === this.max.year && value.month === this.max.month ? this.max.date : moment({ year: value.year, month: value.month}).daysInMonth();
      
        this.setState({
            month: value,
            minDate: minDate,
            maxDate: maxDate,
            from: minDate,
            to: maxDate
        });

        this.props.onChange({
            fromDate: this._formatDate(minDate, value.month, value.year),
            toDate: this._formatDate(maxDate, value.month, value.year)
        });
    }

    _formatDate(date, month, year) {
        return `${month < 9 ? '0'+ (month + 1) : month + 1}/${date < 10 ? '0'+ date : date}/${year}`;
    }

    _onFromDateChange = (value) => {
        this.setState({ from: value });

        this.props.onChange({
            fromDate: this._formatDate(value, this.state.month.month, this.state.month.year),
            toDate: this._formatDate(this.state.to, this.state.month.month, this.state.month.year)
        });
    }

    _onToDateChange = (value) => {
        this.setState({ to: value });

        this.props.onChange({
            fromDate: this._formatDate(this.state.from, this.state.month.month, this.state.month.year),
            toDate: this._formatDate(value, this.state.month.month, this.state.month.year)
        });
    }

    render() {
        const { month, from, to } = this.state;
        const daysInMonth = moment({ year: month.year, month: month.month}).daysInMonth();

        const startDate = month.year === this.min.year && month.month === this.min.month ? this.min.date : 1;
        const endDate = month.year === this.max.year && month.month === this.max.month ? this.max.date : daysInMonth;

        return (
            <div className={`month-picker ${this.props.showDate ? '' : 'month-only'}`}>
                <Month min={this.min} max={this.max} value={month}  {...this.props.monthOption} onChange={this._onMonthChange}/>
                {
                    this.props.showDate && <Day min = {startDate} max={endDate > to ? to : endDate} value={from} { ...this.props.fromDateOption } onChange={this._onFromDateChange} />
                }
                {
                    this.props.showDate && <Day min = {startDate < from ? from : startDate} max={endDate} value={to} { ...this.props.toDateOption } onChange={this._onToDateChange}/>
                }            
            </div>
       );
    }
}

export default MonthPicker;
