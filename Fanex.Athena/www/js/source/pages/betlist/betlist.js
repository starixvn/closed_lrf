define(
    ['jquery', 'common/site', 'common/querystring', 'lib/jqgrid/jquery.jqgrid.additional', './betlist.option', 'moment', 'common/popup',
        'lib/jqgrid/jquery.jqGrid.en', 'lib/jqgrid/jquery.jqGrid.min'],
    function ($, Site, QueryString, jqGridAdditional, BetListOption, moment, Popup) {
        'use strict';
        const BETTYPE_CASHOUT = 911;
        const BETTYPE_MIXPARLAY = 9, BETTYPE_SYSTEMPARLAY = 29, BETTYPE_MIXPARLAY_BETRADAR = 2799;
        const BETTYPR_SINGLEMATCHPARLAY = 38;
        const MIN_BETTYPE_FASTMARKET = 221;
        const MAX_BETTYPE_FASTMARKET = 227;
        const SPORT_RNG_GAME = 208;
        const SPORT_RNG_MINIGAME = 209;
        const SPORT_RNG_MOBILE = 210;
        const SPORT_ALLBET = 211;
        const SPORT_VOIDBRIDGE = 212;
        const SPORT_PP = 248;
        const SPORT_GLOBALGAMING = 219;
        const BETLIST_META_MODEL = '#BetListMetaModel';

        let _sortColumnName, _sortOrder;
        let _params, _url;
        let _isShowSumStake;
        let _onClientPaging = false;

        function showDetailPopUp(url, option) {
            option.id = 'betlist-popup-detail';
            Popup.openPopupWithIframe(url, option);
        }

        function showResultPopUp(url, option) {
            option.id = 'betlist-popup-result';
            Popup.openPopupWithIframe(url, option);
        }

        function isFastMarket(bettype) {
            return bettype >= MIN_BETTYPE_FASTMARKET && bettype <= MAX_BETTYPE_FASTMARKET;
        }

        function isParlay(bettype) {
            return bettype === BETTYPE_MIXPARLAY || bettype === BETTYPE_SYSTEMPARLAY || bettype === BETTYPE_MIXPARLAY_BETRADAR;
        }

        function getBaseCurrency() {
            const params = $.parseJSON($(BETLIST_META_MODEL).val());
            return params.BaseCurrency;
        }

        function getPopupResultHeight(bettype) {
            if (isParlay(bettype)) {
                return 450;
            }

            if (isFastMarket(bettype)) {
                return 300;
            }

            if (bettype === BETTYPR_SINGLEMATCHPARLAY) {
                return 330;
            }

            return 250;
        }

        const _me = {
            getSortParams: function () {
                if (!_sortColumnName) {
                    return null;
                }

                return {
                    SortBy: _sortColumnName,
                    SortOrder: _sortOrder
                };
            },
            submiting: true,
            initialize: function () {
                Site.initialize();

                if (_me.isMatchWLBetList() === true) {
                    _me.updateSortColumn();
                }

                _isShowSumStake = $('#IsShowSumStake').val() === '1';

                _sortColumnName = _sortColumnName || $('#SortBy').val();
                _sortOrder = _sortOrder || $('#SortOrder').val();

                _me.registerBetListGlobalFunctions();
            },

            updateSortColumn: function () {
                BetListOption.columnModel[1].sortable = true; // externalId
                BetListOption.columnModel[2].sortable = true; // systemId
            },

            isMatchWLBetList: function () {
                const regex = /MatchWinLossBetList/i;
                return regex.test($('#ApiUrl').val());
            },

            gridComplete: function (grid) {
                const $grid = $(grid);
                // add sort icon
                let sortCol = _sortColumnName === 'Winlost' ? 'WinLoss' : _sortColumnName;
                sortCol = _sortColumnName === 'nickname' ? 'ExternalId' : sortCol;
                sortCol = _sortColumnName === 'UserName' ? 'SystemId' : sortCol;
                if (sortCol && !_onClientPaging) {
                    jqGridAdditional.addSortableHeader($grid, sortCol, _sortOrder);
                }
                _onClientPaging = false;
                // Resize
                jqGridAdditional.gridComplete();
                // Remove unnecessary item
                if (_isShowSumStake) {
                    $('.ui-jqgrid-ftable td[aria-describedby=BetListGrid_Odds]').html(Site.getSingleResource('GrandTotal')).removeAttr('title');
                } else {
                    $('.ui-jqgrid-ftable td[aria-describedby=BetListGrid_Stake]').html(Site.getSingleResource('GrandTotal')).removeAttr('title');
                }

                $('#pager2').show();

                // fix cursor on non-sortable columns
                const cm = $grid[0].p.colModel;
                $.each($grid[0].grid.headers, function (index, value) {
                    const cmi = cm[index];
                    if (!cmi.sortable) {
                        $('.ui-jqgrid-sortable', value.el).css({ cursor: 'default' });
                    }
                });

                $('.ui-jqgrid-bdiv').css({ 'height': 'auto' });
                jqGridAdditional.updateGridHeight();
                Site.unBlockUI();
            },

            getGridOption: function () {
                const gridOption = $.extend(true, {}, BetListOption.gridOption);

                gridOption.onSortCol = function (index) {
                    if (window.disableBetListSorting) {
                        return 'stop';
                    }
                    Site.blockUI();
                    let newIndex = index;
                    newIndex = newIndex === 'WinLoss' ? 'Winlost' : newIndex;
                    newIndex = newIndex === 'ExternalId' ? 'nickname' : newIndex;
                    if (_sortColumnName === newIndex) {
                        _sortOrder = _sortOrder === 'asc' ? 'desc' : 'asc';
                    } else {
                        _sortOrder = 'desc';
                        _sortColumnName = newIndex;
                    }
                    if (window.CorrectScoreBetList || window.CancelledBetsBetList) {
                        $('#SortBy').val(_sortColumnName);
                        $('#SortOrder').val(_sortOrder);
                    }

                    if (window.serverPaging || $('#IsServerPaging').val() === '1') {
                        _me.loadDataPaging(_url);
                    }
                    else {
                        _me.loadData(_params, _url);
                    }

                    return 'stop';
                };

                // Specify the hidden column
                const hiddenColumnList = $('#HiddenColumnList').val();
                const hiddenColumnTokens = hiddenColumnList.split(',');
                const showSummary = $('#ShowSummary').val() === '0' ? false : hiddenColumnList.indexOf('licenseewl') < 0;

                $.each(hiddenColumnTokens, function (index, value) {
                    jqGridAdditional.hideColumn(BetListOption.columnModel, value);
                });
                if ($('#HasBetEffectiveColumn').val() !== '1') {
                    jqGridAdditional.hideColumn(BetListOption.columnModel, 'BetEffective');
                }
                if (Site.isFakeLicensee()) {
                    jqGridAdditional.hideColumn(BetListOption.columnModel, 'SystemId');
                }
                gridOption.colNames = BetListOption.columnNames;
                gridOption.colModel = BetListOption.columnModel;
                gridOption.footerrow = showSummary;
                const hasCustComm = $('#HasCustComm').val();
                if (hasCustComm === '1') {
                    gridOption.colNames = $.map(gridOption.colNames, function (val) {
                        if (val === 'WinLoss') {
                            return '@[WinLoss]/@[Comm]';
                        }
                        return val;
                    });
                }
                gridOption.colNames = Site.getResources(gridOption.colNames);

                gridOption.onPaging = function () {
                    _onClientPaging = true;
                };
                return gridOption;
            },

            loadData: function (params, url) {
                let jsonParam = params;
                if (typeof jsonParam === 'string') {
                    jsonParam = JSON.parse(jsonParam);
                }

                _params = jsonParam;
                _url = url;

                if (jsonParam && _sortColumnName) {
                    jsonParam.SortBy = _sortColumnName;
                    jsonParam.SortOrder = _sortOrder;
                }

                const paramString = typeof (jsonParam) === 'object' ? JSON.stringify(jsonParam) : jsonParam;

                $.ajax({
                    type: 'POST',
                    data: paramString,
                    contentType: 'application/json',
                    dataType: 'json',
                    cache: false,
                    url: url,
                    success: function (response) {
                        if (response !== null) {
                            _me.bindData(response);
                            _me.setLeagueTitle(response.LeagueName);
                        }
                    },
                    beforeSend: function () {
                        Site.blockUI();
                    },
                    complete: function () {
                        Site.unBlockUI();
                    }
                });
            },

            loadDataPaging: function (url, params) {
                Site.blockUI();
                let newUrl = url;
                if (newUrl && params) {
                    newUrl = QueryString.setParams(newUrl, params);
                }

                _url = newUrl;

                if (newUrl && _sortColumnName) {
                    newUrl = QueryString.setParam(newUrl, 'IsServerPaging', true);
                    newUrl = QueryString.setParam(newUrl, 'SortBy', _sortColumnName);
                    newUrl = QueryString.setParam(newUrl, 'SortOrder', _sortOrder);
                }

                _me.submiting = true;

                const $grid = $('#BetListGrid');
                const gridOption = _me.getGridOption();
                const rows = Number($grid.getGridParam('rowNum')) || gridOption.rowNum;
                gridOption.url = newUrl;
                gridOption.rowNum = rows;
                gridOption.height = 0;
                gridOption.loadonce = false;
                gridOption.datatype = 'json';
                gridOption.gridComplete = function () {
                    const rowCount = $(this).getGridParam('records');
                    if (rowCount === 0) {
                        $('#pager2').hide();
                        jqGridAdditional.setNoInfo();
                        Site.unBlockUI();
                        return;
                    }

                    $('#gbox_BetListGrid').show();
                    _me.gridComplete(this);
                    if (_me.submiting) {
                        $('.ui-pg-selbox').val(rows);
                    }
                    _me.submiting = false;
                };

                // Show the grid
                $grid.jqGrid('GridUnload');
                $('#BetListGrid').jqGrid(gridOption); // must get the grid instance again
                $('#gbox_BetListGrid').hide();
            },

            bindData: function (response) {
                $('#BetListGrid').jqGrid('GridUnload');
                const $grid = $('#BetListGrid'); // must get the grid instance again 

                if (response === null || response.Main.length === 0) {
                    jqGridAdditional.setNoInfo();
                    return;
                }

                const rawData = response.Main;
                const summary = response.Total;
                const sumWinLoss = jqGridAdditional.formatDecimal(summary.SumWinLoss);
                const sumLicenseeWl = jqGridAdditional.formatLicenseeWl(summary.SumLicenseeWl);
                const sumBetEffective = jqGridAdditional.formatDecimal(summary.SumBetEffective);
                const gridOption = _me.getGridOption();

                let rowNum = Number($grid.getGridParam('rowNum')) || gridOption.rowNum;
                if (rowNum < gridOption.rowList[0]) {
                    rowNum = gridOption.rowList[0];
                }
                // Show the grid
                gridOption.rowNum = rowNum;
                gridOption.data = rawData;
                gridOption.userData = { WinLoss: sumWinLoss, LicenseeWL: sumLicenseeWl, BetEffective: sumBetEffective };

                if (_isShowSumStake) {
                    gridOption.userData.Stake = jqGridAdditional.formatDecimal(summary.SumStake);
                    gridOption.userDataOnFooter = true;
                    gridOption.footerrow = true;
                }
                else if (response.IsShowTotal === undefined || response.IsShowTotal) {
                    gridOption.userDataOnFooter = true;
                }
                else {
                    gridOption.userDataOnFooter = false;
                    gridOption.footerrow = false;
                }
                gridOption.gridComplete = function () {
                    _me.gridComplete(this);
                };

                $grid.jqGrid(gridOption);
            },

            getMixParlayResultUrl: function (refno, winlostdate, bettype) {
                let url = Site.resolveClientUrl('ResultReport/ResultPopup');
                url = QueryString.setParam(url, 'refno', refno);
                url = QueryString.setParam(url, 'winlossdate', winlostdate);
                url = QueryString.setParam(url, 'bettype', bettype);
                url = QueryString.setParam(url, 'matchid', 1);

                return url;
            },

            getSportBookResultUrl: function (matchid, bettype, raceNo, sporttype, league, isOutright, extension1, extension2) {
                let url = Site.resolveClientUrl('ResultReport/ResultPopup');
                url = QueryString.setParam(url, 'matchid', matchid);
                url = QueryString.setParam(url, 'bettype', bettype);
                url = QueryString.setParam(url, 'raceno', raceNo);
                url = QueryString.setParam(url, 'sporttype', sporttype);
                url = QueryString.setParam(url, 'isoutright', isOutright);

                if (isFastMarket(bettype)) {
                    url = QueryString.setParam(url, 'handicap1', extension1);
                    url = QueryString.setParam(url, 'handicap2', extension2);
                }
                else {
                    url = QueryString.setParam(url, 'betid', extension1);
                }

                return url;
            },

            viewRngCasinoResult: function (title, refno) {
                let url = Site.resolveClientUrl('ResultReport/ShowRngCasinoSingleWalletResult');

                const params = { 'refNo': refno };
                $.ajax({
                    type: 'POST',
                    contentType: 'application/json',
                    dataType: 'json',
                    data: JSON.stringify(params),
                    cache: false,
                    url: url,
                    success: function (response) {
                        const result = response.Result;
                        if (response.Success) {
                            if (result === '') {
                                return;
                            }

                            showResultPopUp(result, { width: 800, height: 380, title: title });
                        }
                        else {
                            alert(Site.getSingleResource('ErrorProcessingMsg'));
                        }
                    },
                    beforeSend: function () {
                        Site.blockUI();
                    },
                    complete: function () {
                        Site.unBlockUI();
                    }
                });
            },

            viewVoidbridgeResult: function (custId, gamePlayId, title) {
                const url = Site.resolveClientUrl('ResultReport/VoidbridgeResult');
                Site.blockUI();
                $.get(url + '?custid=' + custId + '&gamePlayId=' + gamePlayId, function (result) {
                    if (result !== '') {
                        showResultPopUp(result, { width: 800, height: 380, title: title });
                        Site.unBlockUI();
                    }
                });
            },

            viewPPResult: function (custId, gamePlayId, title) {
                const url = Site.resolveClientUrl('PPResultPopup/Index');
                Site.blockUI();
                $.get(url + '?custid=' + custId + '&gamePlayId=' + gamePlayId, function (result) {
                    if (result !== '') {
                        showResultPopUp(result, { width: 800, height: 380, title: title });
                        Site.unBlockUI();
                    }
                });
            },

            viewAllBetResult: function (trasdesc, betcheck, bettype, title) {
                const url = Site.resolveClientUrl('ResultReport/AllBetResult?transdesc=' +
                    encodeURIComponent(trasdesc) + '&betcheck=' + betcheck + '&bettype=' + bettype);

                Site.blockUI();
                showResultPopUp(url, { width: 800, height: 380, title: title });
                Site.unBlockUI();
            },

            setLeagueTitle: function (leagueName) {
                const leagueNameText = leagueName === '' || leagueName === undefined ? Site.getSingleResource('BetList') : leagueName;
                $('.league-name-title').html(leagueNameText + ' - ');
            },
            viewGlobalGamingResult: function (custId, gameId, title) {
                const url = Site.resolveClientUrl('ResultReport/GlobalGamingResult');
                Site.blockUI();
                $.get(url + '?custid=' + custId + '&gameId=' + gameId, function (result) {
                    if (result !== '') {
                        showResultPopUp(result, { width: 800, height: 380, title: title });
                        Site.unBlockUI();
                    }
                });
            },
            viewResult: function (matchid, raceNo, bettype, sporttype, refno,
                username, winlostdate, refnoMixParlay, league, isOutright, extension1, extension2, custid, transdecs) {
                const title = Site.getSingleResource('Result');

                if (sporttype === SPORT_RNG_GAME || sporttype === SPORT_RNG_MINIGAME || sporttype === SPORT_RNG_MOBILE) {
                    _me.viewRngCasinoResult(title, refno);
                }
                else if (sporttype === SPORT_VOIDBRIDGE) {
                    _me.viewVoidbridgeResult(custid, extension2, title);
                }
                else if (sporttype === SPORT_PP) {
                    _me.viewPPResult(custid, extension2, title);
                }
                else if (sporttype === SPORT_ALLBET) {
                    _me.viewAllBetResult(transdecs, extension2, bettype, title);
                }
                else if (sporttype === SPORT_GLOBALGAMING) {
                    _me.viewGlobalGamingResult(custid, extension2, title);
                }
                else {
                    const numberBettype = Number(bettype);
                    const url = isParlay(numberBettype)
                        ? _me.getMixParlayResultUrl(refnoMixParlay, winlostdate, numberBettype)
                        : _me.getSportBookResultUrl(matchid, numberBettype, raceNo, sporttype, league, isOutright, extension1, extension2, custid);

                    const height = getPopupResultHeight(numberBettype);
                    const width = 750;

                    showResultPopUp(url, { width: width + 25, height: height + 70, title: title });
                }
            },

            showMixParlayDetail: function (transId, divEvent, custid) {
                const url = Site.resolveClientUrl('api/MixParlayBetList/Detail?transId=' + transId + '&custId=' + custid);
                if (divEvent.css('display') === 'none') {
                    $.ajax({
                        type: 'GET',
                        contentType: 'application/json',
                        dataType: 'json',
                        cache: false,
                        url: url,
                        success: function (response) {
                            let choice = '';
                            const len = response.length;
                            $.each(response, function (index, item) {
                                choice += item;
                                if (index < len - 1) {
                                    choice += '<div class="line"></div>';
                                }
                            });

                            divEvent.html(choice);
                            divEvent.css('display', '');
                        },
                        beforeSend: function () {
                            Site.blockUI();
                        },
                        complete: function () {
                            Site.unBlockUI();
                        }
                    });
                }
                else {
                    divEvent.css('display', 'none');
                    divEvent.html('');
                }
            },

            showNewParlayDetail: function (transId, transIndex, refNo, handicap1, handicap2, betcheck, betteam, custId) {
                const $divEvent = $('#divEvent_' + transId + '' + transIndex);
                const $nameDiv = $('#combinationOfferName_' + transId + transIndex);
                $divEvent.addClass('mx-parlay'); //to make line-through for void-parlay-ticket

                if ($divEvent.is(':hidden')) {
                    let url = Site.resolveClientUrl('api/MixParlayBetList/NewParlayDetail');
                    url = QueryString.setParam(url, 'transId', transId);
                    url = QueryString.setParam(url, 'refNo', refNo);
                    url = QueryString.setParam(url, 'handicap1', handicap1);
                    url = QueryString.setParam(url, 'handicap2', handicap2);
                    url = QueryString.setParam(url, 'betcheck', betcheck);
                    url = QueryString.setParam(url, 'betteam', betteam);
                    url = QueryString.setParam(url, 'custId', custId);

                    $.ajax({
                        type: 'GET',
                        contentType: 'application/json',
                        dataType: 'json',
                        cache: false,
                        url: url,
                        success: function (response) {
                            let length = response.Data === null ? 0 : response.Data.length;
                            if (length > 0) {
                                let choice = '';
                                $.each(response.Texts, function (index, item) {
                                    choice += item;
                                });

                                choice += '<div class="line"></div>';

                                $.each(response.Data, function (index, item) {
                                    choice += item;
                                    if (index < length - 1) {
                                        choice += '<div class="line"></div>';
                                    }
                                });

                                $divEvent.html(choice).show();
                                $nameDiv.hide();
                            }
                        },
                        beforeSend: Site.blockUI,
                        complete: Site.unBlockUI
                    });
                }
                else {
                    $divEvent.hide().html('');
                    $nameDiv.show();
                    $('.ui-jqgrid-bdiv').css('height', 'auto');
                }
            },

            showSingleMatchParlayDetail: function (transId, custId, status, transIndex) {
                var $divEvent = $('#divEvent_' + transId + "" + transIndex);

                if ($divEvent.is(':hidden')) {
                    var url = Site.resolveClientUrl('api/SingleMatchParlayBetList/Detail');
                    url = QueryString.setParam(url, 'transId', transId);
                    url = QueryString.setParam(url, 'custId', custId);
                    url = QueryString.setParam(url, 'status', status);

                    $.ajax({
                        type: 'GET',
                        contentType: 'application/json',
                        dataType: 'json',
                        cache: false,
                        url: url,
                        success: function (response) {
                            var length = response === null ? 0 : response.length;
                            if (length > 0) {
                                var choice = '<div class="single-match-parlay-detail">';
                                $.each(response, function (index, item) {
                                    choice += item;
                                });

                                choice += '</div>';
                                $divEvent.html(choice).show();
                            }
                        },
                        beforeSend: Site.blockUI,
                        complete: Site.unBlockUI
                    });
                }
                else {
                    $divEvent.hide().html('');
                    $('.ui-jqgrid-bdiv').css('height', 'auto');
                }
            },

            showSystemParlayDetail: function (transId, refNo, betId, custId, betTeam, baseCurrency) {
                if (Number(transId) === 0) { return; }

                let url = Site.resolveClientUrl('SystemParlayBetList/Detail');
                url = QueryString.setParam(url, 'refno', refNo);
                url = QueryString.setParam(url, 'betteam', betTeam);
                url = QueryString.setParam(url, 'basecurrency', baseCurrency);

                showDetailPopUp(url, { width: 775, height: 500, title: betTeam });
            },

            showAGCasinoDetails: function (transId, winlostDate, custId, transType) {
                let url = Site.resolveClientUrl('AGCasinoBetList/Detail');
                url = QueryString.setParam(url, 'transid', transId);
                url = QueryString.setParam(url, 'custid', custId);
                url = QueryString.setParam(url, 'transType', transType);
                url = QueryString.setParam(url, 'BaseCurrency', getBaseCurrency());

                const popH = Math.min($(window).height() - 100, 550);
                const title = Site.getSingleResource('AGCasino') + ' - ' +
                    Site.getSingleResource('DetailedBetlist') + ' - ' + moment(new Date(winlostDate)).format('MM/DD/YYYY');

                showDetailPopUp(url, { width: 870, height: popH + 50, title: title });
            },

            showRnGCasinoDetails: function (transId, winlostDate, custId, transType) {
                let url = Site.resolveClientUrl('RnGCasinoBetList/Detail');
                url = QueryString.setParam(url, 'transId', transId);
                url = QueryString.setParam(url, 'winlostDate', winlostDate);
                url = QueryString.setParam(url, 'custId', custId);
                url = QueryString.setParam(url, 'transType', transType);
                url = QueryString.setParam(url, 'BaseCurrency', getBaseCurrency());

                const popH = Math.min($(window).height() - 100, 550);
                const title = Site.getSingleResource('ProductCS') + ' - ' +
                    Site.getSingleResource('DetailedBetlist') + ' - ' + moment(new Date(winlostDate)).format('MM/DD/YYYY');

                showDetailPopUp(url, { width: 890, height: popH + 50, title: title });
            },

            showVoidBridgeDetails: function (transId, winlostDate, custId, transType) {
                let url = Site.resolveClientUrl('VoidbridgeBetList/Detail');
                url = QueryString.setParam(url, 'transId', transId);
                url = QueryString.setParam(url, 'winlostDate', winlostDate);
                url = QueryString.setParam(url, 'custId', custId);
                url = QueryString.setParam(url, 'transType', transType);
                url = QueryString.setParam(url, 'BaseCurrency', getBaseCurrency());

                const popH = Math.min($(window).height() - 100, 550);
                const title = Site.getSingleResource('ProductVB') + ' - ' +
                    Site.getSingleResource('DetailedBetlist') + ' - ' + moment(new Date(winlostDate)).format('MM/DD/YYYY');

                showDetailPopUp(url, { width: 890, height: popH + 50, title: title });
            },
            showAllBetDetails: function (transId, winlostDate, custId, transType) {
                let url = Site.resolveClientUrl('AllBetBetList/Detail');
                url = QueryString.setParam(url, 'transid', transId);
                url = QueryString.setParam(url, 'custid', custId);
                url = QueryString.setParam(url, 'transType', transType);
                url = QueryString.setParam(url, 'date', winlostDate);
                url = QueryString.setParam(url, 'BaseCurrency', getBaseCurrency());

                const popH = Math.min($(window).height() - 100, 550);
                const title = Site.getSingleResource('ProductAB') + ' - ' +
                    Site.getSingleResource('DetailedBetlist') + ' - ' + moment(new Date(winlostDate)).format('MM/DD/YYYY');

                showDetailPopUp(url, { width: 870, height: popH + 50, title: title });
            },
            showColossusBetsDetails: function (refNo, winlostDate, transId, custId, betCheck) {
                let url = Site.resolveClientUrl('ColossusBetBetList/Detail');
                url = QueryString.setParam(url, 'refNo', refNo);
                url = QueryString.setParam(url, 'date', winlostDate);
                url = QueryString.setParam(url, 'transid', transId);
                url = QueryString.setParam(url, 'custid', custId);
                url = QueryString.setParam(url, 'betCheck', betCheck);
                url = QueryString.setParam(url, 'BaseCurrency', getBaseCurrency());

                const popH = Math.min($(window).height() - 100, 550);
                const title = Site.getSingleResource('TicketDetailOf').replace('{0}', refNo);

                showDetailPopUp(url, { width: 890, height: popH + 50, title: title });
            },
            showGlobalGamingDetails: function (transId, winlostDate, custId, transType) {
                let url = Site.resolveClientUrl('GlobalGamingBetList/Detail');
                url = QueryString.setParam(url, 'transId', transId);
                url = QueryString.setParam(url, 'winlostDate', winlostDate);
                url = QueryString.setParam(url, 'custId', custId);
                url = QueryString.setParam(url, 'transType', transType);
                url = QueryString.setParam(url, 'BaseCurrency', getBaseCurrency());

                const popH = Math.min($(window).height() - 100, 550);
                const title = Site.getSingleResource('ProductFW') + ' - ' +
                    Site.getSingleResource('DetailedBetlist') + ' - ' + moment(new Date(winlostDate)).format('MM/DD/YYYY');

                showDetailPopUp(url, { width: 890, height: popH + 50, title: title });
            },
            showPPDetails: function (transId, winlostDate, custId, transType) {
                let url = Site.resolveClientUrl('PragmaticPlayBetList/Detail');
                url = QueryString.setParam(url, 'transId', transId);
                url = QueryString.setParam(url, 'winlostDate', winlostDate);
                url = QueryString.setParam(url, 'custId', custId);
                url = QueryString.setParam(url, 'transType', transType);
                url = QueryString.setParam(url, 'BaseCurrency', getBaseCurrency());

                const popH = Math.min($(window).height() - 100, 550);
                const title = Site.getSingleResource('ProductPP') + ' - ' +
                    Site.getSingleResource('DetailedBetlist') + ' - ' + moment(new Date(winlostDate)).format('MM/DD/YYYY');

                showDetailPopUp(url, { width: 890, height: popH + 50, title: title });
            },
            ValidProducts: function () {
                let temp = true;
                if ($('#ProductList').find('input:checked').length === 0) {
                    temp = false;
                    const title = Site.getSingleResource('LrfNotification');
                    const dialogForm = '<div title="' + title + '"><p class="notification">' + Site.getSingleResource('AlertChooseProductMsg') + '</p></div>';
                    Popup.openPopup(dialogForm, { width: 350, height: 120, title: title, className: 'popup-notification' });
                }

                return temp;
            },

            ViewCasinoHandHistory: function (refNo) {
                let url = Site.resolveClientUrl('HandHistory/RNGCasino');
                const urlParam = $('#casino-hand-history-' + refNo).attr('url-param');

                url += urlParam;
                Site.redirect(url);
            },

            viewCashOutHistory: function (transId, refNo, betType, betdaqId) {
                const $baseCurrency = $('#BaseCurrency');
                const baseCurrency = $baseCurrency.length ? $baseCurrency.val() : $.parseJSON($(BETLIST_META_MODEL).val()).BaseCurrency;

                const isCashOut = betdaqId < 1 || betType === BETTYPE_CASHOUT;
                let url = Site.resolveClientUrl('CashOutBetList/Detail');
                url = QueryString.setParam(url, 'transId', transId);
                url = QueryString.setParam(url, 'refNo', refNo);
                url = QueryString.setParam(url, 'betType', betType);
                url = QueryString.setParam(url, 'betdaqId', betdaqId);
                url = QueryString.setParam(url, 'BaseCurrency', baseCurrency);
                url = QueryString.setParam(url, 'isCashout', isCashOut);

                const popH = Math.min($(window).height() - 100, 550);
                const title = isCashOut ? Site.getSingleResource('CashOutDetails') : Site.getSingleResource('BoughtDetails');

                showDetailPopUp(url, { width: 890, height: popH + 50, title: title });
            },

            showBonusDetails: function (refCode, transId) {
                const $baseCurrency = $('#BaseCurrency');
                const baseCurrency = $baseCurrency.length ? $baseCurrency.val() : $.parseJSON($(BETLIST_META_MODEL).val()).BaseCurrency;

                let url = Site.resolveClientUrl('BonusBetList/Detail');
                url = QueryString.setParam(url, 'RefCode', refCode);
                url = QueryString.setParam(url, 'TransId', transId);
                url = QueryString.setParam(url, 'BaseCurrency', baseCurrency);

                const popH = Math.min($(window).height() - 100, 550), popW = 840;
                const title = Site.getSingleResource('TransactionDetail');

                showDetailPopUp(url, { width: popW + 50, height: popH + 50, title: title });
            },

            registerBetListGlobalFunctions: function () {
                window.ViewResult = _me.viewResult;
                // showMP and showCombMP are only for old tickets
                window.showMP = function (transId, refNo, custId) {
                    const divEvent = $('#divEvent_' + transId);
                    divEvent.addClass('mx-parlay'); //to make line-through for void-parlay-ticket
                    _me.showMixParlayDetail(transId, divEvent, custId);
                };

                window.showCombMP = function (transId, index, refNo, custId) {
                    const divEvent = $('#divEvent_' + transId + '' + index);
                    divEvent.addClass('mx-parlay'); //to make line-through for void-parlay-ticket
                    _me.showMixParlayDetail(transId, divEvent, custId);
                };

                window.showNewCombMP = _me.showNewParlayDetail;
                window.showCombMPDetail = _me.showSystemParlayDetail;
                window.showAGCasinoDetails = _me.showAGCasinoDetails;
                window.showRnGCasinoDetails = _me.showRnGCasinoDetails;
                window.showVoidBridgeDetails = _me.showVoidBridgeDetails;
                window.showVoidbridgeResult = _me.viewVoidbridgeResult;
                window.showPPResult = _me.viewPPResult;
                window.showTodayRunningBetsDetails = _me.showAllBetDetails;
                window.showColossusBetsDetails = _me.showColossusBetsDetails;
                window.showGlobalGaming = _me.showGlobalGamingDetails;
                window.ViewCashOutHistory = _me.viewCashOutHistory;
                window.ShowBonusDetails = _me.showBonusDetails;
                window.showPPDetails = _me.showPPDetails;
                window.showSingleMatchParlayDetail = _me.showSingleMatchParlayDetail;

                const betList = {
                    ViewCasinoHandHistory: _me.ViewCasinoHandHistory
                };
                window.BetList = betList;
            },

            resizeGrid: function () {
                const grid = $('#BetListGrid');
                jqGridAdditional.updateGridHeight();
                jqGridAdditional.updateGridWidth(grid);
            }
        };

        return _me;
    });