import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../actions';

export class PlayerDetail extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            selectedTabIndex: 0,
            targetUrl: ''
        }

        this._tabList = this.props.getTabList();
    }

    handleClickMenu = (event, actionLink, tabIndex) => {
        event.preventDefault();

        this.setState({
            targetUrl: actionLink,
            selectedTabIndex: tabIndex
        });
    }

    _buildActionUrl(systemType, action) {
        const { selectedPlayer } = this.props;
        const queryString = (action.indexOf('?') !== -1 ? '&custId=' : '?custId=') + selectedPlayer;
        const urlByPlayer = action + queryString;

        return this.props.getLink(systemType, urlByPlayer);
    }

    _renderTabList(tabList) {
        const { selectedTabIndex } = this.state;

        return (
            tabList.map((item, index) => {
                const actionUrl = this._buildActionUrl(item.SystemType, item.Action);

                return (
                    <li className="tab" key={item.Name}>
                        <a className={selectedTabIndex === index ? "active" : ""}
                            href={actionUrl} onClick={(event) => this.handleClickMenu(event, actionUrl, index)}>
                            {item.Text}
                        </a>
                    </li>
                )
            })
        )
    }

    render() {
        const { targetUrl } = this.state;
        const { selectedPlayer } = this.props;

        if (!selectedPlayer) {
            return null;
        }

        if (this._tabList.length === 0) {
            return null;
        }

        const src = targetUrl || this._buildActionUrl(this._tabList[0].SystemType, this._tabList[0].Action);

        return (
            <div className="pa-detail-container">
                <div className="page-filter-tab">
                    <div className="header-tab">
                        <div className="content-tab">
                            <ul className="tabs">
                                {this._renderTabList(this._tabList)}
                            </ul>
                        </div>
                    </div>
                    <div className="tab-panel">
                        <div className="pa-frame-container">
                            <iframe id="paDetailFrame" style={{ height: window.innerHeight - 340 }} name="paDetailFrame" frameBorder="0" src={src}></iframe>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    const { getLink, getTabList } = ActionCreators;
    return bindActionCreators({ getLink, getTabList }, dispatch);
}

function mapStateToProps(state) {
    const { selectedPlayer } = state;
    return Object.assign({}, { selectedPlayer });
};

export default connect(mapStateToProps, mapDispatchToProps)(PlayerDetail);