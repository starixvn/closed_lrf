import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

export default class CollapsibleRow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isCollapse : !this.props.isExpand
        };
    };

    static propTypes = {
        isExpand: PropTypes.bool,
        subject: PropTypes.string,
        content: PropTypes.string,
        onExpand: PropTypes.func
    }
    
    onClick = () => {
        const newState = !this.state.isCollapse;

        this.setState({ isCollapse : newState });

        if (!newState) {
            this.props.onExpand && this.props.onExpand();
        }
    }

    render() {
        const { subject, content } = this.props;

        return <div className={this.state.isCollapse ? "collapse-item collapse" : "collapse-item"}>
                    <div className="subject-item">
                        <span dangerouslySetInnerHTML={{ __html: subject }} />
                        <i className="icon-arrow" onClick={this.onClick}></i>
                    </div>
                        <div className="content-item" dangerouslySetInnerHTML={{ __html: content }} />
               </div>
    }
};