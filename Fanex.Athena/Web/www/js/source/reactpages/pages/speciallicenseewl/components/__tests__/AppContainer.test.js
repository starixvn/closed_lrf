import React from 'react'
import ShallowRenderer from 'react-test-renderer/shallow';

import { AppContainer } from '../AppContainer'

describe('AppContainer ', () => {
	it('render() - match with snapshot', () => {
		const props = {
			isLoading: false,
			reportTitle: 'title'
		};

		const renderer = new ShallowRenderer();
		const result = renderer.render(<AppContainer {...props}/>);
	
		expect(result).toMatchSnapshot();
	})
	
	it('render() - title is null - match with snapshot', () => {
		const props = {
			isLoading: false,
			reportTitle: null
		};

		const renderer = new ShallowRenderer();
		const result = renderer.render(<AppContainer {...props}/>);
	
		expect(result).toMatchSnapshot();
	})
})