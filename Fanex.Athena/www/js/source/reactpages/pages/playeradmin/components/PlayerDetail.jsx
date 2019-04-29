import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Tabs, Tab } from '@9softstudio/react-simple-tab'

import Site from '../../../lib/site';
import { playerMenuList, mode, currentMode, systemType } from '../lib/constants';

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

    _isValidMode() {
        return (currentMode === mode.parasitic && Identity && Identity.ApplyTokenUrl) || currentMode === mode.self;
    }

    _getExternalActionLink(menuItem) {
        const menuSystemType = menuItem.SystemType;

        return menuSystemType === systemType.newAdmin ?
            menuItem.Action : `${Identity.ApplyTokenUrl}?ActionLink=${menuItem.Action}&Type=${menuSystemType}`;
    }

    render() {
        if (!currentMode || !this._isValidMode()) {
            return null;
        }

        const { selectedTabIndex, targetUrl } = this.state;
        const { menuList } = this.props;

        const renderingMenuList = menuList && menuList.length ? menuList : playerMenuList;
        const src = targetUrl || renderingMenuList[0].Action;

        return (
            <div className="pa-detail-container">
                <div className="page-filter-tab">
                    <div className="header-tab">
                        <div className="content-tab">
                            <ul className="tabs">
                                {
                                    renderingMenuList.map((item, index) => {
                                        const actionLink = currentMode === mode.self ?
                                            Site.resolveClientUrl(item.Action) :
                                            this._getExternalActionLink(item);

                                        return (
                                            <li className="tab" key={item.Name}>
                                                <a className={selectedTabIndex === index ? "active" : ""}
                                                    href={actionLink} onClick={(event) => this.handleClickMenu(event, actionLink, index)}>
                                                    {item.Text}
                                                </a>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                    <div className="tab-panel">
                        <div className="pa-frame-container">
                            <iframe id="paDetailFrame" name="paDetailFrame" frameBorder="0" src={src}></iframe>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

// function mapDispatchToProps(dispatch) {
//     return bindActionCreators({}, dispatch);
// }

function mapStateToProps(state) {
    const { menuList } = state;
    return Object.assign({}, { menuList });
};

export default connect(mapStateToProps, null)(PlayerDetail);