define(['common/site'],
    function (Site) {
        'use strict';

        function setDrillDownLink(level, currencyId, custId, datetime, cellvalue) {
            const param = {
                Level: level,
                CurrencyId: currencyId,
                CustId: custId,
                Datetime: datetime
            };

            return '<a class="drilldown" href="javascript:;" data-drill-down=\'' + JSON.stringify(param) + '\'>' + cellvalue + '</a>';
        }

        function betlistLink(cellvalue, options, rowObject) {
            const param =
            {
                DrillDownDate: rowObject.Date,
                DrillDownCurrencyId: rowObject.CurrencyId,
                DrillDownCurrencyName: rowObject.CurrencyName,
                CustomerId: rowObject.CustomerId,
                ExternalId: rowObject.ExternalId,
                SystemId: rowObject.SystemId
            };

            return '<a class="bet-list-link" href="javascript:;" data-drill-down=\'' + JSON.stringify(param) + '\'>' + cellvalue + '</a>';
        }

        function currencyFormatter(cellvalue, options, rowObject, level) {
            return setDrillDownLink(level, rowObject.CurrencyId, 0, rowObject.Date, cellvalue);
        }

        function systemIdFormatter(cellvalue, options, rowObject) {
            return setDrillDownLink(2, rowObject.CurrencyId, rowObject.CustomerId, rowObject.Date, cellvalue);
        }

        function ThirdPartyWinLossOption(option) {
            this.totalColspan = option.TotalColspan;
            this.urlData = option.UrlData;
            this.urlExcelData = option.UrlExcelData;
            this.colNameList = option.ColNameList;
            this.colModelList = option.ColModelList;

            this.gridOption =
            {
                datatype: 'local',
                colNames: [],
                colModel: [],
                data: [],
                userDataOnFooter: true,
                userData: [],
                height: '100%',
                autowidth: false,
                forceFit: false,
                shrinkToFit: true,
                loadtext: '',
                loadui: 'disable',
                loadonce: true,
                footerrow: true,
                rowNum: 50000,
                grouping: true,
                viewrecords: true,
                gridview: true,
                rownumbers: false
            };
        }

        ThirdPartyWinLossOption.prototype = {
            constructor: ThirdPartyWinLossOption,
            getColName: function () {
                return Site.getResources(this.colNameList);
            },

            getColModel: function () {
                return Site.clone(this.colModelList);
            },
            getGridOption: function (level, reportBy) {
                const gridOption = Site.clone(this.gridOption);
                gridOption.colNames = this.getColName();
                gridOption.colModel = this.getColModel(level, reportBy);
                return gridOption;
            },

            getTotalColModel: function (level, reportBy) {
                const colModel = this.getColModel(level, reportBy);

                for (let i = 0; i < colModel.length; i++) {
                    const item = colModel[i];
                    if (item.name === 'CurrencyName') {
                        item.formatter = null;
                        break;
                    }
                }

                return colModel;
            },
            setGroupHeader: function () { },
            setDrillDownLink: setDrillDownLink,
            betlistLink: betlistLink,
            currencyFormatter: currencyFormatter,
            systemIdFormatter: systemIdFormatter
        };

        return ThirdPartyWinLossOption;
    });