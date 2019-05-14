'use strict';
define(['jquery', 'common/site', './customerlist.state', './customerlist.service'], function ($, Site, CustomerListState, CustomerListService) {
    let _$specialLevelCell = null;
    
    const _me = {
        initialize: function () {
            $('#report-content').on('click', '.specialLevel', function () {
                _$specialLevelCell = $(this);
                CustomerListService.showGridDropdownById('LevelListContainer', _$specialLevelCell);
                return false;
            });

            $('#report-content').on('blur', '.specialLevel', function () {
                setTimeout(function () {
                    $('#LevelListContainer').hide();
                }, 300);
            });

            $('#LevelListContainer').on('click', '.levelLink', function () {
                const level = $(this).data('level');
                _me.setValue(level);
            });
        },

        setValue: function (level) {
            const option = {
                dataField: 'SpecialLevel',
                popUpSelector: '#LevelListContainer',
                $context: _$specialLevelCell,
                param: {
                    custId: _$specialLevelCell.data('custid'),
                    level: level
                },
                url: Site.resolveClientUrl('CustomerAPI/UpdateSpecialLevel'),
                oldValue: _$specialLevelCell.data('level'),
                newValue: level,
                confirmMessage: _me.getConfirmMessage(level)
            };

            CustomerListService.updateGridData(option);
        },

        getConfirmMessage: function (level) {
            const resourceName = level === 0 ? 'AlertRemoveSpecialLevelForCustomerMsg' : 'AlertSetSpecialLevelForCustomerMsg';
            return Site.getSingleResource(resourceName);
        }
    };

    return _me;
});