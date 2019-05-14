import React from 'react'
import renderer from 'react-test-renderer'

import CollapsibleRow from '../CollapsibleRow'

describe('CollapsibleRow ', () => {
    describe('render', () => {
        it('isExpand = true - component is expanded', () => { 
            const props = {
                isExpand: false
            };

            const component = renderer.create(<CollapsibleRow {...props} />);

            const result = component.toJSON(); 
        
            expect(result).toMatchSnapshot(); 
        });

        it('isExpand = false - component is collapsed', () => { 
            const props = {
                isExpand: false
            };

            const component = renderer.create(<CollapsibleRow {...props} />);

            const result = component.toJSON(); 
        
            expect(result).toMatchSnapshot(); 
        });

        it('component render subject correctly', () => { 
            const props = {
                subject: '<p>Subject</p>',
            };

            const component = renderer.create(<CollapsibleRow {...props} />);

            const result = component.toJSON(); 
        
            expect(result).toMatchSnapshot();
        });
        
        it('component render content correctly', () => { 
            const props = {
                content: '<p>Content</p>'
            };

            const component = renderer.create(<CollapsibleRow {...props} />);

            const result = component.toJSON(); 
        
            expect(result).toMatchSnapshot();
        });
    });

    describe('onClick', () => {
        it('Class name is changed to show/hide content', () => {
            const props = {
                subject: 'Subject',
                content: 'Content'
            };

            const component = renderer.create(<CollapsibleRow {...props} />);
            
            let tree = component.toJSON();      
            expect(tree).toMatchSnapshot();

            // expand
            tree.children[0].children[1].props.onClick();           
            tree = component.toJSON();      
            expect(tree).toMatchSnapshot();

            // collapse
            tree.children[0].children[1].props.onClick();
            tree = component.toJSON();      
            expect(tree).toMatchSnapshot();
        });

        it('onExpand function is called when expanding', () => {
            const props = {
                subject: 'Subject',
                content: 'Content',
                onExpand: jest.fn(),
                isExpand: true
            };

            const component = renderer.create(<CollapsibleRow {...props} />);
            
            let tree = component.toJSON();      
            expect(tree).toMatchSnapshot();

            // collapse
            tree.children[0].children[1].props.onClick();
            expect(props.onExpand).not.toHaveBeenCalled();

            // expand
            tree.children[0].children[1].props.onClick();
            expect(props.onExpand).toHaveBeenCalled();
        });
    });
});