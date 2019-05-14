import React from 'react';
import ReactDOM from 'react-dom';
import Popup from './popup/Popup';
import PropTypes from 'prop-types';

export default class UserGuide extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isShow: false
        }
    };

    static propTypes = {
        title: PropTypes.string,
        className: PropTypes.string,
        content: PropTypes.string,
        contentTitle: PropTypes.string
    }

    static defaultProps = {
        className: 'icon-book right',
        content: ''
    }

    onClickHandler = () => {
        this.setState({
            isShow: true
        });

        this.props.onClick && this.props.onClick();
    }

    onCloseHandler = () => {
        this.setState({
            isShow: false
        });
    }

    render() {
        const { className, title, content, contentTitle } = this.props;
        const isShow = this.state.isShow && content.length > 0;
        
        return (<div>
            <i className={className} onClick={this.onClickHandler} title={title}></i>
            <Popup width={640} height={480} isShow={isShow} title={contentTitle} onClose={this.onCloseHandler} isHtml={true}>
                {content}
            </Popup>
        </div>);
    }
};