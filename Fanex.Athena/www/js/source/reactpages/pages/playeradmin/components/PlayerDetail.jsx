import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Tabs, Tab } from '@9softstudio/react-simple-tab'

import { isValidMode, getActionLink } from '../../../lib/integrationService';
import { playerMenuList } from '../../../constants/integrationInfo';

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

    _renderTabList(renderingMenuList) {
        const { selectedTabIndex } = this.state;

        return (
            renderingMenuList.map((item, index) => {
                const actionLink = getActionLink(item.SystemType, item.Action);

                return (
                    <li className="tab" key={item.Name}>
                        <a className={selectedTabIndex === index ? "active" : ""}
                            href={actionLink} onClick={(event) => this.handleClickMenu(event, actionLink, index)}>
                            {item.Text}
                        </a>
                    </li>
                )
            })
        )
    }

    render() {
        if (!isValidMode()) {
            return null;
        }

        const { targetUrl } = this.state;
        const { menuList } = this.props;

        const renderingMenuList = menuList && menuList.length ? menuList : playerMenuList;
        const src = targetUrl || getActionLink(renderingMenuList[0].SystemType, renderingMenuList[0].Action);

        return (
            <div className="pa-detail-container">
                <div className="page-filter-tab">
                    <div className="header-tab">
                        <div className="content-tab">
                            <ul className="tabs">
                                {this._renderTabList(renderingMenuList)}
                            </ul>
                        </div>
                    </div>
                    <div className="tab-panel">
                        <div className="pa-frame-container">
                            <iframe id="paDetailFrame" style={{height: 500}} name="paDetailFrame" frameBorder="0" src={src}></iframe>
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