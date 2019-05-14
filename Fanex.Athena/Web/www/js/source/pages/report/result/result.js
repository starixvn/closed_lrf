'use strict';
define(['jquery', 'common/site', 'components/pluginhelper/daterangepicker', 'common/popup', 'components/scrollablegrid', 'extensions/jquery.extension'],
    function ($, Site, DatePicker, Popup, GridHelper) {
        const DATA_API = 'ResultReport/Index';
        const EXCEL_API = 'ResultReport/ResultExcel?';
        const SPORT_API = 'ResultReport/GetSports';
        const KENO_RESULT_API = 'ResultKenoReport/Index';
        const KENO_RESULT_SESSION_API = 'ResultKenoReport/KeepSession';
        let ajaxRequest = null;
        let ajaxFilterRequest = null;
        let kenoAjaxRequest = null;
        let kenoIntervalId = 0;
        let lotteryAjaxRequest = null;
        let lotteryIntervalId = 0;
        const param = {
            FromDate: '',
            ToDate: '',
            IsOutRight: false,
            IsExportExcel: false,
            SportId: 0,
            LeagueId: 0
        };

        const ACTIVE_CLASS = 'active';

        const _me = {
            initialize: function () {
                Site.initialize();
                DatePicker.initSingleDatePicker('Date');
                DatePicker.initDateRangePicker();
                _me.initEvent();
            },

            initEvent: function () {
                const $submitOutright = $('#submitOutright');

                $('#resultContent').on('click', '.detail-link', function () {
                    const url = Site.resolveClientUrl('ResultReport/ResultDetail')
                     + '?matchid=' + $(this).attr('data-match-id') + '&SportType=' + param.SportId;

                    const popupOption = { id: 'result-popup', width: 775, height: 520, title: Site.getSingleResource('Result') };
                    Popup.openPopupWithIframe(url, popupOption);
                });

                $submitOutright.click(function () {
                    if (_me.canSubmit(this)) {
                        _me.showOutRight(true);
                        const startDate = $('#Date').val();
                        DatePicker.setValueForDateRange(startDate);
                        _me.submit();
                    }
                });

                $('#submitNormal').click(function () {
                    if (_me.canSubmit(this)) {
                        _me.showOutRight(false);
                        DatePicker.setValueForSingleDate($('#Date'), $('#FromDate').val());
                        _me.submit();
                    }
                });

                $('#SubmitButton').click(function () {
                    _me.submit();
                });

                $('#submitToday').click(function () {
                    _me.clearExcelExport();
                    _me.clearResult();
                    const date = $(this).attr('data-date');
                    const isShowOutright = $submitOutright.attr('data-isoutright') === '1';
                    param.FromDate = date;
                    param.ToDate = date;
                    param.IsExportExcel = false;
                    param.IsOutRight = isShowOutright;
                    param.SportId = 0;
                    param.LeagueId = 0;

                    _me.updateDateInput(isShowOutright);
                    _me.getData();
                });

                $('#submitYesterday').click(function () {
                    _me.clearExcelExport();
                    _me.clearResult();
                    const date = $(this).attr('data-date');
                    const isShowOutright = $submitOutright.attr('data-isoutright') === '1';
                    param.FromDate = date;
                    param.ToDate = date;
                    param.IsExportExcel = false;
                    param.IsOutRight = isShowOutright;
                    param.SportId = 0;
                    param.LeagueId = 0;

                    _me.updateDateInput(isShowOutright);
                    _me.getData();
                });

                $('#ExportToExcel').click(function (e) {
                    e.preventDefault();
                    const isShowOutright = $submitOutright.attr('data-isoutright') === '1';
                    _me.setDateParam(isShowOutright);

                    param.IsExportExcel = true;
                    param.IsOutRight = isShowOutright;
                    param.SportId = $('#ddlSport option').length > 0 ? $('#ddlSport').val() : 0;
                    param.LeagueId = $('#ddlLeague').val();
                    _me.getData();
                });

                $('#ddlSport').change(function () {
                    _me.clearExcelExport();
                    _me.clearLeagueFilter();

                    param.SportId = $(this).val();
                    param.LeagueId = 0;
                    _me.getData();
                });

                $('#ddlLeague').change(function () {
                    _me.clearExcelExport();
                    param.LeagueId = $(this).val();
                    _me.getReportData();
                });

                $(window).on('resize', function () {
                    GridHelper.resizeGrid($('.fn-rs-content-scroll'));
                });

                $(window).on('unload', function () {
                    $(window).off('resize');
                });

                if ($('#submitKeno').length) {
                    $('#submitKeno').click(function () {
                        _me.showKeno($(this).data('vendorproductid'));
                    });
                }

                if ($('#submitLottery').length) {
                    $('#submitLottery').click(function () {
                        _me.showLottery($(this).data('vendorproductid'));
                    });
                }
            },

            submit: function () {
                _me.clearExcelExport();
                _me.clearResult();
                const isShowOutright = $('#submitOutright').attr('data-isoutright') === '1';
                _me.setDateParam(isShowOutright);

                param.IsExportExcel = false;
                param.IsOutRight = isShowOutright;
                param.SportId = 0;
                param.LeagueId = 0;
                _me.getData();
            },

            showKeno: function (vendorProductId) {
                const option = {
                    type: 'GET',
                    cache: false,
                    data: { vendorProductId: vendorProductId },
                    url: Site.resolveClientUrl(KENO_RESULT_API),
                    success: function (response) {
                        window.open(response.Url, '_blank', 'left=20,top=20,width=950,height=650,toolbar=1,resizable=1,scrollbars,status=1');
                        clearInterval(kenoIntervalId);
                        _me.extendKenoSession(vendorProductId, response.UserId);
                    },
                    beforeSend: function () {
                        Site.blockUI();
                    },
                    complete: function () {
                        Site.unBlockUI();
                    }
                };
                _me.stopAjaxRequest(kenoAjaxRequest);
                kenoAjaxRequest = $.ajax(option);
            },

            showLottery: function (vendorProductId) {
                const option = {
                    type: 'GET',
                    cache: false,
                    data: { vendorProductId: vendorProductId },
                    url: Site.resolveClientUrl(KENO_RESULT_API),
                    success: function (response) {
                        window.open(response.Url, '_blank', 'left=20,top=20,width=950,height=650,toolbar=1,resizable=1,scrollbars,status=1');
                        clearInterval(lotteryIntervalId);
                        _me.extendLotterySession(vendorProductId, response.UserId);
                    },
                    beforeSend: function () {
                        Site.blockUI();
                    },
                    complete: function () {
                        Site.unBlockUI();
                    }
                };
                _me.stopAjaxRequest(lotteryAjaxRequest);
                lotteryAjaxRequest = $.ajax(option);
            },

            extendKenoSession: function (vendorProductId, userId) {
                if (!userId)
                {
                    return;
                }

                kenoIntervalId = setInterval(function () {
                    const option = {
                        type: 'POST',
                        cache: false,
                        data: {
                            userId: userId,
                            vendorProductId: vendorProductId
                        },
                        url: Site.resolveClientUrl(KENO_RESULT_SESSION_API)
                    };
                    _me.stopAjaxRequest(kenoAjaxRequest);
                    kenoAjaxRequest = $.ajax(option);
                }, 6000);
            },

            extendLotterySession: function (vendorProductId, userId) {
                if (!userId) {
                    return;
                }

                lotteryIntervalId = setInterval(function () {
                    const option = {
                        type: 'POST',
                        cache: false,
                        data: {
                            userId: userId,
                            vendorProductId: vendorProductId
                        },
                        url: Site.resolveClientUrl(KENO_RESULT_SESSION_API)
                    };
                    _me.stopAjaxRequest(lotteryAjaxRequest);
                    lotteryAjaxRequest = $.ajax(option);
                }, 6000);
            },

            getData: function () {
                if (param.IsExportExcel) {
                    _me.exportExcel();
                } else {
                    _me.getFilter();
                }
            },

            exportExcel: function () {
                let url = Site.resolveClientUrl(EXCEL_API);
                url += 'FromDate=' + param.FromDate;
                url += '&ToDate=' + param.ToDate;
                url += '&IsOutRight=' + param.IsOutRight;
                url += '&SportId=' + param.SportId;
                url += '&LeagueId=' + param.LeagueId;
                url += '&IsExportExcel=' + param.IsExportExcel;

                $('#iframeForExportExcel').attr('src', url);
            },

            getFilter: function () {
                const url = Site.resolveClientUrl(SPORT_API);
                const option = {
                    type: 'POST',
                    dataType: 'json',
                    data: param,
                    cache: false,
                    url: url,
                    success: function (response) {
                        _me.renderFilter(response);
                        if (response !== null && response.toString().length > 1) {
                            _me.getReportData();
                        } else {
                            $('#noInfoRow').show();
                            Site.unBlockUI();
                        }
                    },
                    beforeSend: function () {
                        Site.blockUI();
                    }
                };
                _me.stopAjaxRequest(ajaxFilterRequest);
                _me.stopAjaxRequest(ajaxRequest);
                ajaxFilterRequest = $.ajax(option);
            },

            getReportData: function () {
                const url = Site.resolveClientUrl(DATA_API);
                const option = {
                    type: 'POST',
                    cache: false,
                    data: param,
                    url: url,
                    success: function (response) {
                        if (response !== null && response.length > 0) {
                            $('#noInfoRow').hide();
                            $('#resultContent').html(response);

                            if ($('.fn-rs-content-scroll').length > 0) {
                                GridHelper.resizeGrid($('.fn-rs-content-scroll'));
                            }
                        } else {
                            $('#noInfoRow').show();
                        }
                    },
                    beforeSend: function () {
                        Site.blockUI();
                    },
                    complete: function () {
                        Site.unBlockUI();
                    }
                };
                _me.stopAjaxRequest(ajaxRequest);
                ajaxRequest = $.ajax(option);
            },

            renderFilter: function (data) {
                if (data) {
                    _me.renderSportFilter(data.Sports);
                    _me.renderLeagueFilter(data.Leagues);
                    Site.initSelectElements();

                    $('#sportAndLeagueFilter').css('visibility', 'visible');
                    $('#noInfoRow').hide();
                }
                else {
                    $('#sportAndLeagueFilter').css('visibility', 'hidden');
                }
            },

            renderSportFilter: function (sportList) {
                if (param.SportId === 0 && sportList.length > 0) {
                    const firstSport = sportList[0].SportId;
                    param.SportId = firstSport;

                    const $sport = $('#ddlSport');
                    $.each(sportList, function (index, value) {
                        $sport.append('<option value="' + value.SportId + '">' + value.SportName + '</option>');
                    });
                }
            },

            renderLeagueFilter: function (leagueList) {
                if (leagueList !== null && leagueList.length > 0) {
                    const $league = $('#ddlLeague');
                    $.each(leagueList, function (index, value) {
                        $league.append('<option value="' + value.LeagueId + '">' + value.LeagueName + '</option>');
                    });
                    $league.val(param.LeagueId);
                }
            },

            clearResult: function () {
                _me.clearLeagueFilter();
                $('#ddlSport option').remove();
                $('#resultContent').html('');
                $('#sportAndLeagueFilter').css('visibility', 'hidden');
            },

            clearLeagueFilter: function () {
                const defaultLeague = $('#ddlLeague option[value="0"]').clone();
                $('#ddlLeague option').remove();
                $('#ddlLeague').append(defaultLeague);
            },

            clearExcelExport: function () {
                param.IsExportExcel = false;
                $('#iframeForExportExcel').attr('src', '');
            },

            showOutRight: function (isShow) {
                if (isShow) {
                    $('#singleDate').hide();
                    $('#dateRange').show();
                    $('#submitOutright').addClass(ACTIVE_CLASS);
                    $('#submitNormal').removeClass(ACTIVE_CLASS);
                } else {
                    $('#dateRange').hide();
                    $('#singleDate').show();
                    $('#submitOutright').removeClass(ACTIVE_CLASS);
                    $('#submitNormal').addClass(ACTIVE_CLASS);
                }
                $('#submitOutright').attr('data-isOutright', isShow ? '1' : '0');
            },

            setDateParam: function (isShowOutright) {
                if (isShowOutright) {
                    param.FromDate = $('#FromDate').val();
                    param.ToDate = $('#ToDate').val();
                }
                else {
                    param.FromDate = $('#Date').val();
                    param.ToDate = $('#Date').val();
                }
            },

            updateDateInput: function (isShowOutright) {
                if (isShowOutright) {
                    DatePicker.setValueForDateRange(param.FromDate, param.ToDate);
                }
                else {
                    DatePicker.setValueForSingleDate($('#Date'), param.FromDate);
                }
            },

            canSubmit: function (element) {
                return !$(element).hasClass(ACTIVE_CLASS);
            },

            stopAjaxRequest: function (request) {
                if (request !== null) {
                    request.abort();
                }
            }
        };

        return _me;
    });