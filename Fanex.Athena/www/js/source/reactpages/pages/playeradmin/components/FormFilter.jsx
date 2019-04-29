import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { ActionCreators } from '../actions/index.js'
import { bindActionCreators } from 'redux'

export class FormFilter extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            Username: ''
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.setParam({ userName: this.state.Username });
    }

    handleChange = (event) => {
        const { name, value } = event.target;

        this.setState({ [name]: value });
    }

    render() {
        const { Username } = this.state;

        return (
            <div className="page-filter">
                <div className="col-12 col-md-4 col-sm-4 col-lg-3 col-xl-2">
                    <div className="form-group">
                        <label className="label-text">Username *</label>
                        <input className="input-text" id="Username" name="Username" type="text" value={Username}
                            onChange={this.handleChange} />
                    </div>
                </div>

                <div className="col-12 col-md-3 col-sm-4 col-lg-2 col-xl-2">
                    <div className="form-group">
                        <div className="button-group">
                            <button type="button" className="btn btn-submit" onClick={this.handleSubmit}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}
function mapStateToProps(state) {
    const { isLoading, ...rest } = state;
    return Object.assign({}, rest);
};

export default connect(mapStateToProps, mapDispatchToProps)(FormFilter);