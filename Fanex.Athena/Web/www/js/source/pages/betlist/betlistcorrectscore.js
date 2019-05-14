'use strict';
define(
    ['jquery', 'common/site', './betlist'],
    function ($, Site, BetList) {
        const _me = {
            initialize: function () {
                _me.initEvent();
                _me.submit();
                Site.addUserGuide({
                    resourceName: 'TotalBetsCorrectScore',
                    title: Site.getSingleResource('TotalBets') + ' - ' + Site.getSingleResource('CorrectScore')
                });
            },

            initEvent: function () {
                $('#SubmitButton').click(function () {
                    _me.submit();
                });

                $('#ExportToExcel').click(function () {
                    const sortParam = BetList.getSortParams();
                    if (sortParam != null) {
                        $('#SortBy').val(sortParam.SortBy);
                        $('#SortOrder').val(sortParam.SortOrder);
                    }

                    $('#CorrectScoreBetListForm').submit();
                });

                $(window).on('resize', function () {
                    BetList.resizeGrid();
                });

                $(window).on('unload', function () {
                    $(window).off('resize');
                });
            },

            submit: function () {
                // Site.blockUI();
                BetList.initialize();
                const params = Site.setLicenseeOptionParam({});
                const url = Site.resolveClientUrl('api/CorrectScoreBetList/Index');
                BetList.loadData(params, url);
            }
        };

        return _me;
    });