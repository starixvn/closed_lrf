define(['jquery', 'common/site', 'common/querystring', 'lib/jqgrid/jquery.jqgrid.additional', './winlossbyleague.option',
    './winlossbyleague.filter', '../report', 'moment', 'components/paging', 'helpers/excel',
    'extensions/jquery.extension', 'lib/jqgrid/jquery.jqGrid.en', 'lib/jqgrid/jquery.jqGrid.min'],
    function ($, Site, QueryString, jqGridAdditional, WinLossByLeagueOption, WinLossByLeagueFilter, Report, moment, PagingHeper, ExcelHelper) {
        'use strict';

        let ajaxRequest = null;

        let _level = 0;
        let _leagueid = -1;
        let _leaguename = null;
        let _postdata = {};
        let _currencyName = null;

        let _pagingOption = {
            pageindex: 1,
            pagesize: 50,
            pagelist: [50, 100, 1000],
            totalrow: 1,
            elementcontainer: '#paging',
            method: 'AJAX',
            ajaxfunction: 'window.WinLossByLeague.ajaxPaging()',
            alwayshow: true
        };

        const _me = {
            //#region Init
            initialize: function () {
                Site.initialize();
                _me.initEvent();
                WinLossByLeagueFilter.initialize();
                WinLossByLeagueOption.HasAmountDueToColumn = Site.asBool($('#HasAmountDueToColumn').val());
                window.WinLossByLeague = {
                    ajaxPaging: _me.ajaxPaging
                };
            },

            initEvent: function () {
                $('#SubmitButton').click(function () {
                    _me.submit();
                });

                $('.main-content').on('click', '#leagueHeader', function () {
                    _pagingOption.pageindex = 1;
                    const leaguename = $(this).html();
                    _me.drillDown($(this).data('leagueid'), leaguename);
                });

                $('.main-content').on('click', '.drilldown', function () {
                    const custid = $(this).data('custid');
                    const externalid = $(this).data('externalid');
                    const systemid = $(this).data('systemid');
                    _me.drillDownBetList(custid, externalid, systemid);
                });

                $('#level-link-container').on('click', '.level-link', function () {
                    const level = Number($(this).attr('data-level'));
                    if (level === 0) {
                        _me.submit();
                    }
                });

                $('#ExportToExcel').click(function (e) {
                    _postdata.LeagueName = _leaguename;
                    _postdata.Level = _level;
                    ExcelHelper.exportExcel(_postdata, Site.resolveClientUrl('api/WinLossByLeagueReport/Excel'));
                    e.preventDefault();
                });

                $(window).on('resize', function () {
                    _me.resizeGrid();
                });

                $(window).on('unload', function () {
                    $(window).off('resize');
                });
            },

            //#endregion

            //#region Utilities
            resizeGrid: function () {
                const reportGrid = $('#ReportGrid');
                jqGridAdditional.updateGridHeight();
                jqGridAdditional.updateGridWidth(reportGrid, _level === 0);
            },

            setReportTitle: function (level, minOdds, fromdate, todate) {
                let caption = null;
                if (level === 0) {
                    caption = Site.getSingleResource('WinLossByLeague');
                }
                else {
                    caption = _leaguename + ' > ' + Site.getSingleResource('CustomerWinLoss');
                }

                const titlePattern = caption + ', {0} → {1} - {2} - {3}';
                const viewinKey = Site.getSingleResource('Currency') + ': ';
                const currencyStr = viewinKey + ' ' + (_postdata.BaseCurrency === '' ? _currencyName : _postdata.BaseCurrency);

                const minOddStr = Site.getSingleResource('MinimumOdds') + ' : ' + minOdds;
                const title = $.format(
                    titlePattern,
                    moment(new Date(fromdate)).format('M/DD/YYYY'),
                    moment(new Date(todate)).format('M/DD/YYYY'),
                    currencyStr,
                    minOddStr);

                _postdata.ReportTitle = title;
                $('.report-title').html(title);
                $('.panel-heading').removeClass('hide');
            },
            //#endregion

            //#region Get Data
            ajaxComplete: function (level, response) {
                if (response !== null) {
                    if (level === 0) {
                        _me.setReportTitle(0, _postdata.Odds, _postdata.FromDate, _postdata.ToDate);
                    }

                    _me.bindData(level, response);
                    Report.renderBreadCrumb(level);
                }
            },

            submit: function () {
                if (!WinLossByLeagueFilter.isValid()) {
                    return;
                }
                Site.blockUI();
                _level = 0;

                _postdata = $('#SearchForm').serializeObject();
                _currencyName = $('#CurrencyName').val().toUpperCase();
                _postdata.BaseCurrency = _postdata.BaseCurrency.toUpperCase();
                _leaguename = $('#League option:selected').text();

                const option = {
                    type: 'POST',
                    data: _postdata,
                    dataType: 'json',
                    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                    cache: false,
                    url: Site.resolveClientUrl(WinLossByLeagueOption.urlData),
                    success: function (response) {
                        _me.ajaxComplete(0, response);
                    },
                    beforeSend: function () {
                        Site.blockUI();
                    },
                    complete: function () {
                        Site.unBlockUI();
                    }
                };
                if (ajaxRequest !== null) {
                    ajaxRequest.abort();
                }
                ajaxRequest = $.ajax(option);

                return true;
            },

            //#endregion

            //#region drillDown
            drillDownBetList: function (custId, externalId, systemId) {
                const param = {
                    IsConvert: _postdata.BaseCurrency !== '',
                    Odds: _postdata.Odds,
                    FromDate: _postdata.FromDate.toString(),
                    ToDate: _postdata.ToDate.toString(),
                    BaseCurrency: _postdata.BaseCurrency,
                    CurrencyId: _postdata.CurrencyId,
                    CurrencyName: _currencyName,
                    CustId: custId,
                    ExternalId: externalId,
                    SystemId: systemId,
                    LeagueId: _leagueid,
                    MatchId: _postdata.Match,
                    ShowWin: _postdata.ShowWin,
                    ShowLoss: _postdata.ShowLoss,
                    ShowDraw: _postdata.ShowDraw,
                    ProductCodeList: WinLossByLeagueFilter.buildProductCodeList(_postdata).toString()
                };
                
                const url = Site.resolveClientUrl('WinlossByLeagueBetList/Index?') + $.param(param);
                window.open(url, '', 'modal=no');
            },

            drillDown: function (leagueid, leaguename) {
                _level = 1;
                _leagueid = leagueid;
                _leaguename = leaguename;

                const temp = {
                    Level: _level,
                    League: leagueid,
                    pageindex: _pagingOption.pageindex,
                    pagesize: _pagingOption.pagesize
                };
                const param = $.extend({}, _postdata, temp);

                WinLossByLeagueFilter.buildProductsParams(param, _postdata);

                const option = {
                    type: 'POST',
                    data: param,
                    dataType: 'json',
                    cache: false,
                    url: Site.resolveClientUrl(WinLossByLeagueOption.urlData),
                    success: function (response) {
                        _me.ajaxComplete(_level, response);
                        if (response !== null && response.Data.length > 0) {
                            _me.setReportTitle(1, _postdata.Odds, _postdata.FromDate, _postdata.ToDate);
                            _pagingOption.totalrow = parseInt(response.TotalRows, 10);
                            if (_pagingOption.totalrow > 0) {
                                $('#paging').show();
                                PagingHeper.render(_pagingOption);
                                _me.resizeGrid();
                            }
                        }
                    },
                    beforeSend: function () {
                        Site.blockUI();
                    },
                    complete: function () {
                        Site.unBlockUI();
                    }
                };
                if (ajaxRequest !== null) {
                    ajaxRequest.abort();
                }
                ajaxRequest = $.ajax(option);
            },
            //#endregion

            //#region Bind Data
            bindData: function (level, response) {
                jqGridAdditional.clearGrid('ReportGrid');
                const numOfRow = response.Data.length;
                if (numOfRow === 0) {
                    jqGridAdditional.setNoInfo();
                    return;
                }

                const reportGrid = $('#ReportGrid');
                $('#paging').hide();
                const gridOption = WinLossByLeagueOption.getGridOption(level);

                gridOption.data = response.Data;
                gridOption.rowNum = level === 2 ? WinLossByLeagueOption.pageSize : WinLossByLeagueOption.nonePagingSize;
                gridOption.rowTotal = numOfRow;

                gridOption.gridComplete = function () {
                    jqGridAdditional.gridComplete();
                    _me.bindTotal(level, response.Total);
                    _me.resizeGrid();
                    Site.unBlockUI();
                };

                // Show the grid
                reportGrid.jqGrid(gridOption);

                //set rowspan for footer row
                $('table.ui-jqgrid-ftable').tableRowSpan([WinLossByLeagueOption.currencyIndex]);

                if (level === 0) {
                    WinLossByLeagueOption.addLeagueGroupRow($('#League').val(), $('#League option:selected').text());
                }
            },

            bindTotal: function (level, totalData) {
                const columnModel = WinLossByLeagueOption.getColModel(level);
                const colspan = level === 0 ? 2 : 3;
                jqGridAdditional.assignTotal(totalData, columnModel);
                jqGridAdditional.setGroupFooters(colspan, 0, 0);
            },
            //#endregion

            ajaxPaging: function () {
                _pagingOption = PagingHeper.getSetting() || {};
                _me.drillDown(_leagueid, _leaguename);
            }
        };

        return _me;
    });