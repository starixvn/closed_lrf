'use strict';
define(
    ['jquery', 'common/site', '../betlist'],
    function ($, Site, BetList) {
        const _me = {};

        // Param
        let _betListResult = { NewRow: false, Rows: [], LastTransId: 0 };
        let _lastTransId = '0';

        const _params = {
            SportId: 0,
            LeagueId: 0,
            MatchId: 0,
            BetType: '',
            LiveStatus: '3',
            OddsType: '',
            Level: '',
            TimeZone: '8',
            Currency: '',
            BasedCurrency: '',
            PageSize: 10,
            StakeFrom: '0',
            StakeTo: '1000000000',
            TransId: _lastTransId,
            BetFrom: 0
        };
        let _postedParam;
        let _intervalId;
        let _isLoading;
        let _intervalMiliseconds;

        // Object
        let _$tableBody;

        // Config
        const MIN_LOADING_MILISECONDS = 1000;
        const MIN_INTERVAL = 3000;
        const HIGHLIGHT_CLASS = 'monitor-hightlight';
        const SELECTED_CLASS = 'monitor-keep';
        const MAX_STAKE = 999999999;

        _me.columns =
            [{ Name: 'Platform', IsShow: 1 },
             { Name: 'ExternalId', IsShow: 1 },
             { Name: 'SystemId', IsShow: 1 },
             { Name: 'TransTime', IsShow: 1 },
             { Name: 'Choice', IsShow: 1 },
             { Name: 'Odds', IsShow: 1 },
             { Name: 'Stake', IsShow: 1 },
             { Name: 'Status', IsShow: 1 }];
        _me.initialize = function () {
            _intervalId = 0;
            _isLoading = false;
            _intervalMiliseconds = 3000;

            _$tableBody = $('#last-bets-monitoring tbody');
            _$tableBody.on('click', 'tr', function () {
                $(this).toggleClass(SELECTED_CLASS);
            });

            _params.BasedCurrency = $('#last-bet-monitor-base-currency').val();
            _postedParam = Site.clone(_params);

            BetList.registerBetListGlobalFunctions();
        };
        _me.getMaxStake = function () {
            return MAX_STAKE;
        };
        _me.updateParam = function (type, name, value) {
            if (type === 'number') {
                _params[name] = value ? parseInt(value, 10) : 0;
            } else {
                _params[name] = value ? $.trim(value) : '';
            }
        };

        _me.isValidParam = function () {
            return _postedParam.StakeFrom <= _postedParam.StakeTo
                && $('#currency').multiSelect('getCheckedItems').length > 0
                && $('#special-level').multiSelect('getCheckedItems').length > 0;
        };
        _me.tryUpdateStake = function () {
            let tempF = $('#stake-from').val();
            tempF = tempF.replace(/,/g, '');
            tempF = tempF === '' ? 0 : parseInt(tempF, 10);

            _params.StakeFrom = tempF;

            let tempT = $('#stake-to').val();
            tempT = tempT.replace(/,/g, '');
            tempT = tempT === '' ? MAX_STAKE : parseInt(tempT, 10);

            _params.StakeTo = tempT;
        };

        _me.Submit = function (freezeStatus) {
            _me.stopMonitor();
            _me.tryUpdateStake();
            _lastTransId = 0;
            _postedParam = Site.clone(_params);

            if (parseInt(freezeStatus, 10) === 1) {
                _me.startMonitor();
            }
        };

        /*------------------------------------------------------------------------------------------
        Get data from database
        ------------------------------------------------------------------------------------------*/
        _me.reloadData = function () {
            if (_isLoading) {
                _me.doMonitor();
                return;
            }

            if (!_me.isValidParam()) {
                return;
            }

            _isLoading = true;

            const loadingTickBegin = (new Date()).getTime();
            if (Number(_lastTransId) === 0) {
                _me.clearContent();
            }

            $.ajax({
                url: Site.resolveClientUrl('api/LastBetMonitoringBetList/Index'),
                type: 'POST',
                data: JSON.stringify(_postedParam),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                async: true,
                cache: false,
                timeout: 10000,
                beforeSend: function () {
                    $('#monitorLoader').css('visibility', 'visible');
                    _isLoading = true;
                },
                complete: function () {
                    $('#monitorLoader').css('visibility', 'hidden');
                    const rowCount = $('tr', _$tableBody).length;
                    if (rowCount > 0) {
                        $('#noInfoRow').remove();
                    }
                },
                success: function (result) {
                    // Only bind data if current mode == mode at the begining of request
                    _betListResult = result;
                    _me.bindData();

                    const loadingTime = (new Date()).getTime() - loadingTickBegin;
                    _intervalMiliseconds = loadingTime > MIN_LOADING_MILISECONDS
                    ? _intervalMiliseconds + 1000
                    : MIN_INTERVAL;

                    // Continue
                    _me.doMonitor();
                },
                error: function (jqXHR) {
                    if (jqXHR.status === 403) {
                        Site.reload();
                        return;
                    }

                    $('#monitorLoader').css('visibility', 'hidden');

                    _betListResult.Updated = false;
                    _betListResult.Rows = '';
                    _isLoading = false;
                    _intervalMiliseconds += 1000;
                    _me.doMonitor();
                }
            });
        };

        _me.bindData = function () {
            // If there is no new bet, process error message
            if (!_betListResult.NewRow) {
                _isLoading = false;

                const message = _betListResult.Message;
                if (message) {
                    _me.bindNoInfoRow(message);
                    return;
                }

                const rowCount = $('tr.content-row', _$tableBody).length;
                if (rowCount === 0) {
                    _me.bindNoInfoRow();
                }

                return;
            }

            /*--------------------------------------------------------------------------------------------
            Insert new rows from database
            Remove old rows
            Update last transId
            --------------------------------------------------------------------------------------------*/
            //get hide columns
            const hideColumns = _me.columns.filter(function (item) { return item.IsShow === 0; });
            let rows = _betListResult.Rows;
            if (hideColumns.length > 0) {
                const display = ' style="display:none;"';
                $.each(hideColumns, function (index, value) {
                    const newString = 'data-name="' + value.Name + '"' + display;
                    const regex = new RegExp('data-name=(\'|")' + value.Name + '(\'|")', 'g');
                    rows = rows.replace(regex, newString);
                });
            }

            _$tableBody.prepend(rows);
            $('tr:gt(' + (_postedParam.PageSize - 1) + ')', _$tableBody).remove();

            _lastTransId = _betListResult.LastTransId;
            _postedParam.TransId = _lastTransId;

            setTimeout(function () {
                _me.unHighlight(_lastTransId);
            }, 6000);

            _isLoading = false;
        };

        _me.bindNoInfoRow = function (text) {
            const noInfoMessage = text ? text : Site.getSingleResource('NoInfo');

            const htmlNoInfor = '<p id="noInfoRow" class="no-info-row">' + noInfoMessage + '</p>';
            _$tableBody.empty();
            if (!$('#noInfoRow').length) {
                $('#betlist_content').append(htmlNoInfor);
            }
        };

        /*------------------------------------------------------------------------------------------
        Remove high light row after a duration
        ------------------------------------------------------------------------------------------*/
        _me.unHighlight = function (lastTransId) {
            $('tr.content-row', _$tableBody).each(function (i, e) {
                const transId = $(e).data('transid');
                if (transId <= lastTransId) {
                    $(e).removeClass(HIGHLIGHT_CLASS);
                }
            });
        };

        _me.clearContent = function () {
            _postedParam.TransId = 0;
            _me.bindNoInfoRow();
        };

        _me.startMonitor = function () {
            _me.stopMonitor();

            _lastTransId = 0;
            _intervalMiliseconds = MIN_INTERVAL;
            _me.doMonitor();
        };

        _me.stopMonitor = function () {
            if (_intervalId > 0) {
                clearTimeout(_intervalId);
            }
        };

        _me.doMonitor = function () {
            if (_intervalId > 0) {
                clearTimeout(_intervalId);
            }

            _intervalId = setTimeout(_me.reloadData, _intervalMiliseconds);
        };

        return _me;
    });