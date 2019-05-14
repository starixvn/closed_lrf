import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import axios from 'axios'

import Overlay from '../Overlay'
import SuggestionList from './SuggestionList'
import Timer from '../utils/timer'

const DELAY_TIME_MILLISECOND = 300;

export default class AutoComplete extends Component {
    constructor(props) {
        super(props);

        this.state = {
            suggestions: null,
            selectedIndex: -1
        }

        this.input = null;
        this.cacheData = {};

        this.onChange = Timer.debounce(this._onChange, DELAY_TIME_MILLISECOND).bind(this);
    }

    static propTypes = {
        url: PropTypes.string,
        onSelect: PropTypes.func,
        onInput: PropTypes.func,
        responseDataField: PropTypes.string,
        cache: PropTypes.bool,
        queryParamName: PropTypes.string,
        htmlAttributes: PropTypes.object
    }

    static defaultProps = {
        url: null,
        responseDataField: "suggestions",
        cache: true,
        queryParamName: "query"
    }

    get isShowSuggestionList() {
        return this.state.suggestions && this.state.suggestions.length > 0;
    }

    _onKeyDown = (event) => {
        if (!this.isShowSuggestionList) {
            return;
        }

        const selectedIndex = this.state.selectedIndex;
        switch (event.keyCode) {
            case 38: //up
                if (selectedIndex > 0) {
                    this.setState({ selectedIndex: selectedIndex - 1 });
                }
                break;
            case 40: //down
                if (selectedIndex < this.state.suggestions.length - 1) {
                    this.setState({ selectedIndex: selectedIndex + 1 });
                }
                break;
            case 13: //enter
                if (selectedIndex > -1) {
                    const selectedItem = this.state.suggestions[selectedIndex];
                    this._onSelect(selectedItem);
                }
                break;
        }
    }

    _setStateWithCaching(value, suggestionList) {
        if (this.props.cache) {
            const cacheKey = value.toLowerCase();
            this.cacheData[cacheKey] = suggestionList;
        }

        this.setState({
            suggestions: suggestionList
        });
    }

    _clearState = () => {
        this.setState({ suggestions: null, selectedIndex: -1 });
    }

    _onSelect = (selectedItem) => {
        const { onSelect } = this.props;
        onSelect && onSelect(selectedItem);
        this.input.value = typeof (selectedItem) === "object" ? selectedItem.value : selectedItem;

        this._clearState();
    }

    _getDataByUrl(url, value) {
        const { responseDataField, queryParamName } = this.props;
        const apiUrl = `${url}?${queryParamName}=${value}`;

        axios.get(apiUrl, {
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
        }).then((response) => {
            var data = responseDataField ? response.data[responseDataField] : response.data;
            this._setStateWithCaching(value, data);
        });
    }

    _onChange = (event) => {
        const value = (this.input.value || "").trim();
        
        const { onInput } = this.props;
        onInput && onInput(value);

        if (value.length < 3) {
            this._clearState();
            return;
        }

        const cachedData = this.cacheData[value];
        if (cachedData) {
            this.setState({ suggestions: cachedData });
            return;
        }

        const { url } = this.props;
        if (url) {
            this._getDataByUrl(url, value);
        }
    }

    render() {
        return (
            <div className="ac-container">
                <input type="text" className="input-text" {...this.props.htmlAttributes}
                    onChange={this.onChange} onKeyDown={this._onKeyDown}
                    ref={(element) => this.input = element} />

                {this.isShowSuggestionList &&
                    <Overlay isOpening={true} onClose={this._clearState}>
                        <SuggestionList selectedIndex={this.state.selectedIndex}
                            width={this.input.clientWidth}
                            dataList={this.state.suggestions}
                            onSelect={this._onSelect} />
                    </Overlay>}
            </div>
        );
    }
}