import React from 'react';
import AutoComplete from '../AutoComplete';
import ShallowRenderer from 'react-test-renderer/shallow';
import renderer from 'react-test-renderer';
import axios from 'axios';
import SuggestionList from '../SuggestionList';

describe('AutoComplete', () => {
    describe('render', () => {
        it('render with default props', () => {
            const shallowRenderer = new ShallowRenderer();
            const result = shallowRenderer.render(<AutoComplete />);
            
            expect(result).toMatchSnapshot();
        })

        it('render with custom props', () => {
            const httmAttr = { id: 'test', className: 'test' }

            const shallowRenderer = new ShallowRenderer();
            const result = shallowRenderer.render(<AutoComplete htmlAttributes={httmAttr} />);
            
            expect(result).toMatchSnapshot();
        })

        it('input is changed - call onChange', () => {
            const autoComplete = new AutoComplete({ htmlAttributes: { id: 'test' } });
            autoComplete.onChange = jest.fn();

            const component = renderer.create(autoComplete.render());
            const input = component.root.findByProps({ className: "input-text" });

            input.props.onChange();
            
            expect(autoComplete.onChange).toHaveBeenCalled();
        })

        it('key down on input - call _onKeyDown', () => {
            const autoComplete = new AutoComplete({ htmlAttributes: { id: 'test' } });
            autoComplete._onKeyDown = jest.fn();

            const component = renderer.create(autoComplete.render());
            const input = component.root.findByProps({ className: "input-text" });

            input.props.onKeyDown();
            
            expect(autoComplete._onKeyDown).toHaveBeenCalled();
        })

        it('select on suggestion list - call _onSelect', () => {
            const autoComplete = new AutoComplete({ htmlAttributes: { id: 'test' } });
            autoComplete.state.suggestions = ['1', '2', '3'];
            autoComplete.input = { clientWidth: 100 };
            autoComplete._onSelect = jest.fn();

            const component = renderer.create(autoComplete.render());
            const selection = component.root.findByType(SuggestionList);

            selection.props.onSelect();
            
            expect(autoComplete._onSelect).toHaveBeenCalled();
        })
    })

    describe('isShowSuggestionList', () => {
        it('suggestions list is empty - not return true', () => {
            const autoComplete = new AutoComplete();

            expect(autoComplete.isShowSuggestionList).not.toBe(true);
        })

        it('suggestions list is not empty - return true', () => {
            const autoComplete = new AutoComplete();
            autoComplete.state.suggestions = ['1', '2', '3'];

            expect(autoComplete.isShowSuggestionList).toBe(true);
        })
    })

    describe('_onKeyDown', () => {
        it('isShowSuggestionList is false - do nothing', () => {
            const autoComplete = new AutoComplete();
            autoComplete.setState = jest.fn();

            autoComplete._onKeyDown();

            expect(autoComplete.setState).not.toHaveBeenCalled();
        })

        it('keyCode is 38 and index is less than zero - do nothing', () => {
            const autoComplete = new AutoComplete();
            autoComplete.setState = jest.fn();
            autoComplete.state.suggestions = ['1', '2', '3'];

            const event = { keyCode: 38 };

            autoComplete._onKeyDown(event);

            expect(autoComplete.isShowSuggestionList).toBe(true);
            expect(autoComplete.setState).not.toHaveBeenCalled();
        })

        it('keyCode is 38 - subtract 1 from index', () => {
            const autoComplete = new AutoComplete();
            autoComplete.setState = jest.fn();
            autoComplete.state.suggestions = ['1', '2', '3'];
            autoComplete.state.selectedIndex = 1;

            const event = { keyCode: 38 };

            autoComplete._onKeyDown(event);

            expect(autoComplete.isShowSuggestionList).toBe(true);
            expect(autoComplete.setState).toHaveBeenCalledWith({ selectedIndex: autoComplete.state.selectedIndex - 1 });
        })

        it('keyCode is 40 and index is bigger than suggestion list length - do nothing', () => {
            const autoComplete = new AutoComplete();
            autoComplete.setState = jest.fn();
            autoComplete.state.suggestions = ['1', '2', '3'];
            autoComplete.state.selectedIndex = 4;

            const event = { keyCode: 40 };

            autoComplete._onKeyDown(event);

            expect(autoComplete.isShowSuggestionList).toBe(true);
            expect(autoComplete.setState).not.toHaveBeenCalled();
        })

        it('keyCode is 40 - add 1 to index', () => {
            const autoComplete = new AutoComplete();
            autoComplete.setState = jest.fn();
            autoComplete.state.suggestions = ['1', '2', '3'];
            autoComplete.state.selectedIndex = 1;

            const event = { keyCode: 40 };

            autoComplete._onKeyDown(event);

            expect(autoComplete.isShowSuggestionList).toBe(true);
            expect(autoComplete.setState).toHaveBeenCalledWith({ selectedIndex: autoComplete.state.selectedIndex + 1 });
        })

        it('keyCode is 13 and index is -1 - do nothing', () => {
            const autoComplete = new AutoComplete();
            autoComplete.setState = jest.fn();
            autoComplete.state.suggestions = ['1', '2', '3'];

            const event = { keyCode: 13 };

            autoComplete._onKeyDown(event);

            expect(autoComplete.isShowSuggestionList).toBe(true);
            expect(autoComplete.setState).not.toHaveBeenCalled();
        })

        it('keyCode is 40 - call _onSelect', () => {
            const autoComplete = new AutoComplete();
            autoComplete.setState = jest.fn();
            autoComplete.state.suggestions = ['1', '2', '3'];
            autoComplete.state.selectedIndex = 1;
            autoComplete._onSelect = jest.fn();

            const event = { keyCode: 13 };

            autoComplete._onKeyDown(event);

            expect(autoComplete.isShowSuggestionList).toBe(true);
            expect(autoComplete._onSelect).toHaveBeenCalledWith(autoComplete.state.suggestions[autoComplete.state.selectedIndex]);
        })
    })

    describe('_setStateWithCaching', () => {
        it('allow cache - update cache for suggestionList', () => {
            const autoComplete = new AutoComplete({ cache: true });
            autoComplete.setState = jest.fn();
            const cacheValue = 'cache';
            const suggestionList = ['1', '2', '3'];

            autoComplete._setStateWithCaching(cacheValue, suggestionList)

            expect(autoComplete.cacheData[cacheValue.toLowerCase()]).toBe(suggestionList);
            expect(autoComplete.setState).toHaveBeenCalledWith({ suggestions: suggestionList });
        })

        it('update state', () => {
            const autoComplete = new AutoComplete({ cache: false });
            autoComplete.setState = jest.fn();
            const cacheValue = 'cache';
            const suggestionList = ['1', '2', '3'];

            autoComplete._setStateWithCaching(cacheValue, suggestionList)

            expect(autoComplete.setState).toHaveBeenCalledWith({ suggestions: suggestionList });
        })
    })

    describe('_onSelect', () => {
        it('selected item is object - call props.onSelect, change input value to selectedItem.value and clear state', () => {
            const props = { onSelect: jest.fn() };
            const autoComplete = new AutoComplete(props);
            autoComplete._clearState = jest.fn();
            autoComplete.input = { value: 2 };
            const selectedItem = { value: 1 };

            autoComplete._onSelect(selectedItem)

            expect(props.onSelect).toHaveBeenCalledWith(selectedItem);
            expect(autoComplete.input.value).toBe(selectedItem.value);
            expect(autoComplete._clearState).toHaveBeenCalled();
        })

        it('selected item is not object - call props.onSelect, change input value to selectedItem and clear state', () => {
            const props = { onSelect: jest.fn() };
            const autoComplete = new AutoComplete(props);
            autoComplete._clearState = jest.fn();
            autoComplete.input = { value: 2 };
            const selectedItem = 1;

            autoComplete._onSelect(selectedItem)

            expect(props.onSelect).toHaveBeenCalledWith(selectedItem);
            expect(autoComplete.input.value).toBe(selectedItem);
            expect(autoComplete._clearState).toHaveBeenCalled();
        })
    })

    it('_clearState - reset state', () => {
        const autoComplete = new AutoComplete();
        autoComplete.setState = jest.fn();

        autoComplete._clearState()

        expect(autoComplete.setState).toHaveBeenCalledWith({ suggestions: null, selectedIndex: -1 });
    })

    describe('_getDataByUrl', () => {
        it('responseDataField is null - _setStateWithCaching is called with correct data', () => {
            jest.mock('axios');

            const response = { data: ['1', '2'] };
            const promise = Promise.resolve(response);
            axios.get = jest.fn(() => promise);

            const responseDataField = null;
            const queryParamName = 'param';
            const autoComplete = new AutoComplete({ responseDataField, queryParamName });
            autoComplete._setStateWithCaching = jest.fn();

            const url = 'test.com';
            const value = 'test';

            autoComplete._getDataByUrl(url, value);

            expect(axios.get).toHaveBeenCalledWith(`${url}?${queryParamName}=${value}`,  {
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });
            Promise.resolve().then(() => {
                expect(autoComplete._setStateWithCaching).toHaveBeenCalledWith(value, response.data)
            });
        })

        it('responseDataField is not null - _setStateWithCaching is called with correct data', () => {
            jest.mock('axios');

            const response = { data: { field1: 1 } };
            const promise = Promise.resolve(response);
            axios.get = jest.fn(() => promise);

            const responseDataField = 'field1';
            const queryParamName = 'param';
            const autoComplete = new AutoComplete({ responseDataField, queryParamName });
            autoComplete._setStateWithCaching = jest.fn();

            const url = 'test.com';
            const value = 'test';

            autoComplete._getDataByUrl(url, value);

            expect(axios.get).toHaveBeenCalledWith(`${url}?${queryParamName}=${value}`,  {
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });
            Promise.resolve().then(() => {
                expect(autoComplete._setStateWithCaching).toHaveBeenCalledWith(value, response.data.field1)
            });
        })
    })

    describe('_onChange', () => {
        it('input value is less than 3 character - call onInput and clear state', () => {
            const props = { onInput: jest.fn() };
            const autoComplete = new AutoComplete(props);
            autoComplete._clearState = jest.fn();
            autoComplete.input = { value: '  xx  ' };

            autoComplete._onChange();

            expect(props.onInput).toHaveBeenCalledWith(autoComplete.input.value.trim());
            expect(autoComplete._clearState).toHaveBeenCalled();
        })

        it('input value is not empty cachedData exists - call onInput and set state with cache data', () => {
            const props = { onInput: jest.fn() };
            const autoComplete = new AutoComplete(props);
            autoComplete._clearState = jest.fn();
            autoComplete.setState = jest.fn();
            autoComplete.input = { value: 'vv1' };
            autoComplete.cacheData = { vv1: '1' };

            autoComplete._onChange();

            expect(props.onInput).toHaveBeenCalledWith(autoComplete.input.value);
            expect(autoComplete.setState).toHaveBeenCalledWith({ suggestions: autoComplete.cacheData[autoComplete.input.value] });
            expect(autoComplete._clearState).not.toHaveBeenCalled();
        })

        it('input value is not empty cachedData does not exist and url exists - call onInput and _getDataByUrl', () => {
            const props = { onInput: jest.fn(), url: 'test.com' };
            const autoComplete = new AutoComplete(props);
            autoComplete._getDataByUrl = jest.fn();
            autoComplete._clearState = jest.fn();
            autoComplete.setState = jest.fn();
            autoComplete.input = { value: 'vv1' };
            autoComplete.cacheData = { v2: '1' };

            autoComplete._onChange();

            expect(props.onInput).toHaveBeenCalledWith(autoComplete.input.value);
            expect(autoComplete._getDataByUrl).toHaveBeenCalledWith(props.url, autoComplete.input.value);
            expect(autoComplete.setState).not.toHaveBeenCalled();
            expect(autoComplete._clearState).not.toHaveBeenCalled();
        })

        it('input value is valid, cachedData does not exist and url does not exist - call onInput only', () => {
            const props = { onInput: jest.fn() };
            const autoComplete = new AutoComplete(props);
            autoComplete._getDataByUrl = jest.fn();
            autoComplete._clearState = jest.fn();
            autoComplete.setState = jest.fn();
            autoComplete.input = { value: 'xxxx' };
            autoComplete.cacheData = { };

            autoComplete._onChange();

            expect(props.onInput).toHaveBeenCalledWith(autoComplete.input.value);
            expect(autoComplete._getDataByUrl).not.toHaveBeenCalled();
            expect(autoComplete.setState).not.toHaveBeenCalled();
            expect(autoComplete._clearState).not.toHaveBeenCalled();
        })
    })   
});
