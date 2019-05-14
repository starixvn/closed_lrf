//$('h1').marquee();
//$('h2').marquee({ count: 2 });
//$('h3').marquee({ speed: 5 });
//$('h5').marquee({ count: 1, speed: 2 });

(function ($) {
    var _timer = 0;
    var _offsetX = 150;
    function getTextWidth(text) {
        var calc = '<span style="display:none">' + text + '</span>';
        $('body').append(calc);
        var _offsetX = $('body').find('span:last').width();
        $('body').find('span:last').remove();
        return _offsetX;
    }

    function init(options) {
        clearTimeout(_timer);
        var $self = $(this);
        _isRunning = true;
        var textWidth = getTextWidth($self.text()),
                offset = $self.width(),
                css = {
                    'text-indent': $self.css('text-indent'),
                    'overflow': $self.css('overflow'),
                    'white-space': $self.css('white-space')
                },
                marqueeCss = {
                    'text-indent': _offsetX,
                    'overflow': 'hidden',
                    'white-space': 'nowrap'
                },
                options = $.extend(true, { count: -1, speed: 1e1 }, options),
                i = 0,
                stop = textWidth * -1;

        function go() {
            if (!$self.length) return;
            if (_offsetX <= stop) {
                i++;
                if (i == options.count) {
                    $self.css(css);
                    return;
                }

                _offsetX = offset;
            }
            $self.css('text-indent', _offsetX + 'px');
            _offsetX--;

            _timer = setTimeout(go, options.speed);
        }

        _offsetX--;
        $self.css(marqueeCss);
        go();
    }

    function stop() {
        clearTimeout(_timer);
    }

    var methods = {
        init: init,
        stop: stop
    };

    $.fn.marquee = function (methodOrOptions) {
        if (methods[methodOrOptions]) {
            return methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
            // Default to "init"
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + methodOrOptions + ' does not exist on jQuery.marquee');
        }
    };
})(jQuery);