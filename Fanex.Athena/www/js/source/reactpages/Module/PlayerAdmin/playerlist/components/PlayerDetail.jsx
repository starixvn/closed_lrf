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

    _renderTabList(renderingMenuList) {
        const { selectedTabIndex } = this.state;

        return (
            renderingMenuList.map((item, index) => {
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
        const { menuList, selectedPlayer } = this.props;

        if(!selectedPlayer || !menuList || menuList.length === 0){
            return null;
        }

        const src = targetUrl || this._buildActionUrl(menuList[0].SystemType, menuList[0].Action);

        return (
            <div className="pa-detail-container">
                <div className="page-filter-tab">
                    <div className="header-tab">
                        <div className="content-tab">
                            <ul className="tabs">
                                {this._renderTabList(menuList)}
                            </ul>
                        </div>
                    </div>
                    <div className="tab-panel">
                        <div className="pa-frame-container">
                            <iframe id="paDetailFrame" style={{ height: 500, width: '100%' }} name="paDetailFrame" frameBorder="0" src={src}></iframe>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    const { getLink } = ActionCreators;
    return bindActionCreators({ getLink }, dispatch);
}

function mapStateToProps(state) {
    const { menuList, selectedPlayer } = state;
    return Object.assign({}, { menuList, selectedPlayer });
};

export default connect(mapStateToProps, mapDispatchToProps)(PlayerDetail);