'use strict';
define(['jquery', 'common/site', './customerlist.service'], function ($, Site, CustomerListService) {
    let _$oddsGroupCell;

    const _me = {
        initialize: function () {

            $('#report-content').on('click', '.oddsGroup', function () {
                _$oddsGroupCell = $(this);
                _me.showGridDropdown();
            });

            $('#report-content').on('blur', '.oddsGroup', function () {
                setTimeout(function () {
                    $('#OddsGroupListContainer').hide();
                }, 300);
            });

            $('#OddsGroupListContainer').on('click', '.oddsGroupLink', function () {
                const group = $(this).data('group');
                _me.setValue(group);
            });
        },

        showGridDropdown: function () {
            if (_$oddsGroupCell.hasClass('disabled')) {
                return;
            }

            CustomerListService.showGridDropdownById('OddsGroupListContainer', _$oddsGroupCell);
        },

        setValue: function (oddsGroup) {
            let confirmMessage = Site.getSingleResource('AlertSetOddsGroupForCustomerMsg');
            confirmMessage = confirmMessage.replace('{0}', oddsGroup);

            const option = {
                dataField: 'OddsGroup',
                popUpSelector: '#OddsGroupListContainer',
                $context: _$oddsGroupCell,
                param: {
                    custId: _$oddsGroupCell.data('custid'),
                    oddsGroup: oddsGroup
                },
                url: Site.resolveClientUrl('CustomerAPI/UpdateOddsGroup'),
                oldValue: _$oddsGroupCell.data('group'),
                newValue: oddsGroup,
                confirmMessage: confirmMessage
            };

            CustomerListService.updateGridData(option);
        }
    };

    return _me;
});