/*jshint camelcase: false*/

'use strict';

define(['jquery'], function ($) {
    function activeMenuItem($target) {
        /*jshint validthis: true*/
        $(this).find('.collapsible-body li.active').removeClass('active');
        $target.closest('li').addClass('active');
        const $groupHeader = $target.closest('.menu-item').find('.collapsible-header');
        if ($groupHeader.hasClass('active') === false) {
            $groupHeader.trigger('click');
        }
    }

    function init(inputOptions) {
        /*jshint validthis: true*/

        const defaults = {
            accordion: undefined
        };

        const options = $.extend(defaults, inputOptions);
        const touch = 'ontouchstart' in window || navigator.maxTouchPoints;

        return this.each(function () {
            const $this = $(this);

            if (!$this.parent().hasClass('site-menu')) {
                return;
            }

            const $panel_headers = $this.find('> li > .collapsible-header');

            const collapsible_type = $this.data('collapsible');

            // Turn off any existing event handlers
            $this.off('click.collapse2', '> li > .collapsible-header');
            $panel_headers.off('click.collapse2');

            /****************
            Helper Functions
            ****************/

            // Accordion Open
            function accordionOpen(object) {
                if (object.hasClass('active')) {
                    object.parent().addClass('active');
                } else {
                    object.parent().removeClass('active');
                }
                if (object.parent().hasClass('active')) {
                    object.siblings('.collapsible-body')
                        .stop(true, false)
                        .slideDown({
                            duration: 350,
                            easing: 'easeOutQuart',
                            queue: false,
                            complete: function() {
                                $(this).css('height', '');
                            }
                        });
                } else {
                    object.siblings('.collapsible-body')
                        .stop(true, false)
                        .slideUp({
                            duration: 350,
                            easing: 'easeOutQuart',
                            queue: false,
                            complete: function() {
                                $(this).css('height', '');
                            }
                        });
                }

                $panel_headers.not(object).removeClass('active').parent().removeClass('active');
                $panel_headers.not(object).parent().children('.collapsible-body').stop(true, false).slideUp({
                    duration: 350,
                    easing: 'easeOutQuart',
                    queue: false,
                    complete: function() {
                        $(this).css('height', '');
                    }
                });
            }

            // Expandable Open
            function expandableOpen(object) {
                if (object.hasClass('active')) {
                    object.parent().addClass('active');
                } else {
                    object.parent().removeClass('active');
                }
                if (object.parent().hasClass('active')) {
                    object.siblings('.collapsible-body')
                        .stop(true, false)
                        .slideDown({
                            duration: 350,
                            easing: 'easeOutQuart',
                            queue: false,
                            complete: function() {
                                $(this).css('height', '');
                            }
                        });
                } else {
                    object.siblings('.collapsible-body')
                        .stop(true, false)
                        .slideUp({
                            duration: 350,
                            easing: 'easeOutQuart',
                            queue: false,
                            complete: function() {
                                $(this).css('height', '');
                            }
                        });
                }
            }

            /**
             * Check if object is children of panel header
             * @param  {Object}  object Jquery object
             * @return {Boolean} true if it is children
             */
            function isChildrenOfPanelHeader(object) {
                const panelHeader = getPanelHeader(object);

                return panelHeader.length > 0;
            }

            /**
             * Get panel header from a children element
             * @param  {Object} object Jquery object
             * @return {Object} panel header object
             */
            function getPanelHeader(object) {
                return object.closest('li > .collapsible-header');
            }

            /*****  End Helper Functions  *****/

            function collapseWithOverlay($this, event) {
                collapse($this, event);

                if ($('#sidenav-overlay').length > 0) {
                    if (!$($this).hasClass('active')) {
                        $('#sidenav-overlay').unbind('click');
                        $('#sidenav-overlay').remove();
                    }
                } else {
                    const overlay = $('<div id="sidenav-overlay"></div>');
                    overlay.css('opacity', 0).click(function () {
                        collapse($this, event);
                        overlay.velocity({ opacity: 0 }, {
                            duration: 300, queue: false, easing: 'easeOutQuad',
                            complete: function() {
                                $(this).remove();
                            }
                        });
                    });
                    $('body').append(overlay);
                    overlay.velocity({ opacity: 1 }, {
                        duration: 300, queue: false, easing: 'easeOutQuad',
                        complete: function() { }
                    });
                }
            }

            function collapse($this, event) {
                const $header = $($this);
                let element = $(event.target);

                if (isChildrenOfPanelHeader(element)) {
                    element = getPanelHeader(element);
                }

                element.toggleClass('active');

                if (options.accordion || collapsible_type === 'accordion' || collapsible_type === undefined) {
                    // Handle Accordion
                    accordionOpen(element);
                } else {
                    // Handle Expandables
                    expandableOpen(element);

                    if ($header.hasClass('active')) {
                        expandableOpen($header);
                    }
                }
            }

            if (!touch) {
                $this.on('mouseover.opensub', '> li > .collapsible-header', function (e) {
                    if ($('body').hasClass('site-menubar-fold')) {
                        collapse(this, e);
                    }
                });
            }

            // Add click handler to only direct collapsible header children
            $this.on('click.collapse2', '> li > .collapsible-header', function (e) {
                return touch && $('body').hasClass('site-menubar-fold') ? collapseWithOverlay(this, e) : collapse(this, e);
            });

            if (!touch) {
                // Add focusout event
                $this.on('mouseleave.closesub', '> li > .collapsible-body', function (e) {
                    const $header = $(this);
                    const temp = $(e.target).closest('li > .collapsible-body');

                    const element = temp.parent().find('.collapsible-header');

                    if ($('body').hasClass('site-menubar-fold') && element.hasClass('active')) {
                        element.toggleClass('active');

                        if (options.accordion || collapsible_type === 'accordion' || collapsible_type === undefined) {
                            // Handle Accordion
                            accordionOpen(element);
                        } else {
                            // Handle Expandables
                            expandableOpen(element);

                            if ($header.hasClass('active')) {
                                expandableOpen($header);
                            }
                        }
                    }
                });
            }

            //click menu event
            $this.on('click.menuevent', '> li > .collapsible-body  a', function (e) {
                const url = $(this).attr('data-url');
                $('#mainFrame').prop('src', url);

                const element = $(e.target);
                if (touch && $('body').hasClass('site-menubar-fold')) {
                    const temp = element.closest('li > .collapsible-body');

                    temp.parent().find('.collapsible-header').trigger('click');
                }
                activeMenuItem.call($this, element);
            });

            // Open first active
            if (options.accordion || collapsible_type === 'accordion' || collapsible_type === undefined) {
                // Handle Accordion
                accordionOpen($panel_headers.filter('.active').first());
            } else {
                // Handle Expandables
                $panel_headers.filter('.active').each(function () {
                    expandableOpen($(this));
                });
            }
        });
    }

    const methods = {
        init: init,
        activeMenuItem: activeMenuItem
    };

    $.fn.collapsibleMenu = function (methodOrOptions) {
        if (methods[methodOrOptions]) {
            return methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
            // Default to 'init'
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + methodOrOptions + ' does not exist on jQuery.collapsibleMenu');
        }
    };
});

$(document).ready(function () {
    $('.collapsible2').collapsibleMenu();
});