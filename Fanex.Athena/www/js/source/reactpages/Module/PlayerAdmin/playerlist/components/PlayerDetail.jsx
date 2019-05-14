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

    _renderTabList(renderingMenuList) {
        const { selectedTabIndex } = this.state;

        return (
            renderingMenuList.map((item, index) => {
                const actionLink = this.props.getLink(item.SystemType, item.Action);

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
        const { targetUrl } = this.state;
        const { menuList } = this.props;

        const hasMenuList = menuList && menuList.length > 0;
        const src = targetUrl || (hasMenuList ? this.props.getLink(menuList[0].SystemType, menuList[0].Action) : '');

        return (
            <div className="pa-detail-container">
                <div className="page-filter-tab">
                    <div className="header-tab">
                        <div className="content-tab">
                            <ul className="tabs">
                                {hasMenuList ? this._renderTabList(menuList) : null}
                            </ul>
                        </div>
                    </div>
                    <div className="tab-panel">
                        <div className="pa-frame-container">
                            <iframe id="paDetailFrame" style={{ height: 500 }} name="paDetailFrame" frameBorder="0" src={src}></iframe>
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
    const { menuList } = state;
    return Object.assign({}, { menuList });
};

export default connect(mapStateToProps, mapDispatchToProps)(PlayerDetail);