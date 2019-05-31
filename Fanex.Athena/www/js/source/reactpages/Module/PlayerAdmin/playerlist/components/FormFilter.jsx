import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { ActionCreators } from '../actions/index.js'
import { bindActionCreators } from 'redux'
import CheckBox from '@jsroot/components/CheckBox'
import AdvancedSearch from './AdvancedSearch';

export class FormFilter extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            Username: '',
            isShowAdvancedSearch: false
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.setSelectedPlayer(null);
        this.props.searchPlayer({ userName: this.state.Username });
    }

    handleChange = (event) => {
        const { name, value } = event.target;

        this.setState({ [name]: value });
    }

    render() {
        const { Username, isShowAdvancedSearch } = this.state;

        return (
            <div className="page-filter">
                <div className="row">
                    <div className="col-12 col-md-4 col-sm-4 col-lg-3 col-xl-2">
                        <div className="form-group">
                            <label className="label-text">Username *</label>
                            <input className="input-text" id="Username" name="Username" type="text" value={Username}
                                onChange={this.handleChange} />
                        </div>
                    </div>

                    {isShowAdvancedSearch && <AdvancedSearch />}

                    <div className="col-12 col-md-2 col-sm-2 col-lg-1 col-xl-1">
                        <div className="form-group">
                            <div className="button-group">
                                <button type="button" className="btn btn-submit" onClick={this.handleSubmit}>Submit</button>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-3 col-sm-3 col-lg-3 col-xl-2">
                        <div className="form-group">
                            <CheckBox id="isShowAdvancedSearch"
                                checked={isShowAdvancedSearch}
                                onChange={(checked) => this.setState({ isShowAdvancedSearch: checked })}
                                label="Advanced Search" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
function mapDispatchToProps(dispatch) {
    const { searchPlayer, setSelectedPlayer } = ActionCreators;
    return bindActionCreators({ searchPlayer, setSelectedPlayer }, dispatch);
}
function mapStateToProps(state) {
    const { isLoading, ...rest } = state;
    return Object.assign({}, rest);
};

export default connect(mapStateToProps, mapDispatchToProps)(FormFilter);