'use strict';

define([
    'common/site',
    './recheckin',
    'components/pluginhelper/autocomplete',
    './notification',
    'lib/jquery.cookie',
    'lib/jquery.marquee',
    'components/selectlist',
    'lib/jquery.jclock',
    'vendor-materialize'],
    function (Site, Recheckin, AutoComplete, Notification) {
        let $searchBox;

        function initialize() {
            Site.initialize();
            initVariables();
            initEvent();
            checkMoveBetNotification();
            Notification.add();
            activeDefaultMenuItem();
            setTimeout(function () {
                const $mainFrame = $('#mainFrame');
                $mainFrame.attr('src', $mainFrame.data('src'));
            }, 100);

            if ($('#HasRecheckIn').val() === '1') {
                Recheckin.init();
            }

            AutoComplete.initialize({
                url: Site.resolveClientUrl('SearchCustomerAPI/SearchActiveAndDormantCustomer'),
                target: '#searchbox'
            });
        }

        // init clock
        $('#clock').jclock({
            utc: true,
            utcOffset: -4,
            format: '%H:%M:%S %b %d, %Y GMT'
        });

        function initVariables() {
            $searchBox = $('#searchbox');
        }

        function initEvent() {
            $searchBox.keyup(function (e) {
                const event = e || window.event;
                const key = event.keyCode || event.which;

                if (key === 13) {
                    searchByUserName();
                }
            });

            $('#languagesite').on('click', '.languageItem', function () {
                changeLanguage($(this));
            });

            $('#ddlLicensee')
                .selectList({ canSearch: true })
                .on('change', function () {
                    const licenseeId = $(this).val();
                    top.location.href = Site.resolveClientUrl('Header/ChangeLicensee?licenseeid=') + licenseeId + '&nocache=' + (new Date().getTime());
                });

            $('#label-search').click(function () {
                $(this).parent().addClass('focused');
                $searchBox.focus();
                searchByUserName();
            });

            $searchBox.blur(function () {
                if (!$(this).val()) {
                    $(this).parent().removeClass('focused');
                }
            });

            $('.collapsible2').on('click.menuevent', '.collapsible-body  a', function () {
                const $currentMenuItem = $(this);
                document.title = 'LAP' + ' - ' + $('.active > .menu-title').text() + ' - ' + $currentMenuItem.text();

                $('#page-title').text($currentMenuItem.text());
            });

            $(window).on('blur', function () {
                $('.dropdown-button', '.languages-block').dropdown('close');
                $('#ddlLicensee').selectList('close');
                $('#suggestionDropdown').hide();
            });
        }

        function searchByUserName() {
            const userName = $searchBox.val();
            if (!userName) {
                return;
            }

            const url = Site.resolveClientUrl('Customer/CustomerList?userName=' + userName);
            top.main.location.href = url;
            $('.collapsible2').collapsibleMenu('activeMenuItem', $('#MenuItem43'));
            $('#page-title').text(Site.getSingleResource('CustomerList'));
        }

        function changeLanguage($target) {
            const lang = $target.attr('langkey');
            const mainFrame = top.frames['main'];
            if (mainFrame && mainFrame.Site && mainFrame.Site.blockUI) {
                mainFrame.Site.blockUI();
            }

            $.ajax({
                url: Site.resolveClientUrl('Header/ChangeLanguage?languagesite=') + lang,
                async: false,
                type: 'GET',
                cache: false,
                success: function (result) {
                    if (result === '1') {
                        if ($.cookie('isClosedNotification') !== '1') {
                            $.cookie('isFirstLoad', '1', {
                                path: '/'
                            });
                        }
                        top.location.reload();
                    }
                }
            });
        }

        function activeDefaultMenuItem() {
            let defaultUrl = $('#DefaultUrl').val().toLowerCase();
            defaultUrl = defaultUrl.replace(/\/index$/i, ''); // remove the last '/Index'
            const $menuItem = $('#left-menu .collapsible-body a').filter(function () {
                return $(this).attr('href').toLowerCase() === defaultUrl;
            });
            $('.collapsible2').collapsibleMenu('activeMenuItem', $menuItem);

            const menuItemName = $menuItem.length > 0 ? $menuItem.text() : '';
            $('#page-title').text(menuItemName);

            document.title = 'LAP' + ' - ' + $('.active > .menu-title').text() + ' - ' + menuItemName;
        }

        function checkMoveBetNotification() {
            const $marquee = $('#notification-marquee');

            if ($marquee.length === 0) {
                return;
            }

            let previousText = '';
            const $parent = $marquee.parent();
            const apiUrl = Site.resolveClientUrl('api/CommonApi/GetMoveBetNotification');
            function processNotification() {
                $.get(apiUrl, function (message) {
                    if (message === previousText) {
                        return;
                    }

                    previousText = message;
                    if (message) {
                        if ($parent.is(':hidden')) {
                            $parent.slideDown('fast');
                            $('#mainFrame').css('height', 'calc(100% - 30px)');
                        }

                        if ('marquee' in $marquee) {
                            $marquee.text(message);
                            $marquee.marquee({ speed: 30 });
                        }
                    } else {
                        $marquee.marquee('stop');
                        $parent.slideUp('fast');
                        $('#mainFrame').css('height', '100%');
                    }
                });
            }

            processNotification();
            setInterval(processNotification, 60000);
        }

        return {
            initialize: initialize
        };
    });