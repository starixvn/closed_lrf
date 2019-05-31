import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { ActionCreators } from '../actions/index.js'
import { bindActionCreators } from 'redux'
import Select from 'react-select'
import MultipleSelect from '@9softstudio/react-multiselect'

export class AdvancedSearch extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            currency: '',
            basedCurrency: 'usd',
            oddsGroup: '',
            commissionGroup: '',
            subsidiary: '',
            specialLevel: '',
            ba: ''
        }

        this.currencyList = [{Id: 'eur', Value: 'EUR', Status: true}, {Id: 'usd', Value: 'usd', Status: false}];
        this.baseCurrencyList = [{value: 'eur', label: 'EUR'}, {value: 'usd', label: 'USD'}];
        this.oddsGroupList = [{Id: 'A', Value: 'A', Status: true}, {Id: 'B', Value: 'B', Status: false}, {Id: 'C', Value: 'C', Status: true}];
        this.subsidiaryList = [{Id: 's1', Value: 'S1', Status: true}, {Id: 's2', Value: 'S2', Status: true}];
        this.specialLevelList = [{Id: '1', Value: '1', Status: true}, {Id: '2', Value: '2', Status: true}];
        this.baStatusList = [{Id: 'On', Value: 'On', Status: true}, {Id: 'Off', Value: 'Off', Status: true}];
    }

    handleSubmit = (event) => {
        event.preventDefault();
    }

    handleChange = (event) => {
        const { name, value } = event.target;

        this.setState({ [name]: value });
    }

    render() {
        const { basedCurrency } = this.state;

        return (
            <React.Fragment>
                <div className="col-12 col-md-3 col-sm-3 col-lg-2 col-xl-2">
                    <div className="form-group">
                        <label className="label-text">Currency</label>
                        <MultipleSelect id="currency"
                            dataSource={this.currencyList}
                            keyField={"Id"}
                            valueField={"Value"}
                            statusField={"Status"}
                            onChange={(currentItem, selectedItemsKey) => console.log(selectedItemsKey)} />
                    </div>
                </div>

                <div className="col-12 col-md-3 col-sm-3 col-lg-2 col-xl-2">
                    <div className="form-group">
                        <label className="label-text">Based</label>
                        <Select instanceId="ddlBased" name="basedCurrency"
                            value={basedCurrency}
                            options={this.baseCurrencyList}
                            onChange={(item) => console.log(item)} />
                    </div>
                </div>

                <div className="col-12 col-md-3 col-sm-3 col-lg-2 col-xl-2">
                    <div className="form-group">
                        <label className="label-text">Odds Group</label>
                        <MultipleSelect id="oddsGroup"
                            dataSource={this.oddsGroupList}
                            keyField={"Id"}
                            valueField={"Value"}
                            statusField={"Status"}
                            onChange={(currentItem, selectedItemsKey) => console.log(selectedItemsKey)} />
                    </div>
                </div>

                <div className="col-12 col-md-3 col-sm-3 col-lg-2 col-xl-2">
                    <div className="form-group">
                        <label className="label-text">Subsidiary</label>
                        <MultipleSelect id="subsidiary"
                            dataSource={this.subsidiaryList}
                            keyField={"Id"}
                            valueField={"Value"}
                            statusField={"Status"}
                            onChange={(currentItem, selectedItemsKey) => console.log(selectedItemsKey)} />
                    </div>
                </div>

                <div className="col-12 col-md-3 col-sm-3 col-lg-2 col-xl-2">
                    <div className="form-group">
                        <label className="label-text">Special Level</label>
                        <MultipleSelect id="specialLevel"
                            dataSource={this.specialLevelList}
                            keyField={"Id"}
                            valueField={"Value"}
                            statusField={"Status"}
                            onChange={(currentItem, selectedItemsKey) => console.log(selectedItemsKey)} />
                    </div>
                </div>

                <div className="col-12 col-md-3 col-sm-3 col-lg-2 col-xl-2">
                    <div className="form-group">
                        <label className="label-text">BA</label>
                        <MultipleSelect id="ba"
                            dataSource={this.baStatusList}
                            keyField={"Id"}
                            valueField={"Value"}
                            statusField={"Status"}
                            onChange={(currentItem, selectedItemsKey) => console.log(selectedItemsKey)} />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({}, dispatch);
}
function mapStateToProps(state) {
    return Object.assign({});
};

export default connect(mapStateToProps, mapDispatchToProps)(AdvancedSearch);