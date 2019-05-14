import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class BetListPopupLayout extends Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        title: PropTypes.any
    }

    render() {
        const { title, children } = this.props;

        return (
            <div className="popup-content-default betlist-container">
                <div className="caption">
                    {title}
                </div>
                <div className="betlist-content">
                    {children}
                </div>
            </div>
        )
    }

}