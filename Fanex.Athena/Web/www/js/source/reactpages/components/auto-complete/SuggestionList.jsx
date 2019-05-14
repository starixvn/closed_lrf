import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

export default class SuggestionList extends Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        dataList: PropTypes.array.isRequired,
        onSelect: PropTypes.func,
        width: PropTypes.number,
        selectedIndex: PropTypes.number
    }

    onSelect(selectedItem) {
        const { onSelect } = this.props;

        onSelect && onSelect(selectedItem);
    }

    _renderDataList() {
        return this.props.dataList.map((item, index) => {
            const className = index === this.props.selectedIndex ? "ac-item ac-item-active" : "ac-item";
            return (
                <li key={`ac-item-${index}`} className={className} onClick={this.onSelect.bind(this, item)}>
                    {item && typeof (item) === "object" ? item.value : item}
                </li>
            )
        })
    }

    render() {
        const style = { width: this.props.width };
        return (
            <ul className="suggestion-list" style={style}>
                {this._renderDataList()}
            </ul >
        )
    }
}