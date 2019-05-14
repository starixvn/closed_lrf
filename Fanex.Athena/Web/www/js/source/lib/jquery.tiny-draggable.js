/*
	jQuery tinyDraggable v1.0.2
    Copyright (c) 2014 Simon Steinberger / Pixabay
    GitHub: https://github.com/Pixabay/jQuery-tinyDraggable
    More info: https://pixabay.com/blog/posts/p-52/
	License: http://www.opensource.org/licenses/mit-license.php
*/

(function($){
    $.fn.tinyDraggable = function(options){
        var settings = $.extend({ handle: 0, exclude: 0 }, options);
        return this.each(function(){
            var dx, dy, el = $(this), handle = settings.handle ? $(settings.handle, el) : el;
            handle.on({
                mousedown: function(e){
                    if (settings.exclude && ~$.inArray(e.target, $(settings.exclude, el))) return;
                    e.preventDefault();
                    var os = el.offset();
                    var oLeft = os.left < 0 ? 0 : os.left;
                    var oTop = os.top < 0 ? 0 : os.top;
                    var dx = e.clientX - oLeft, dy = e.clientY - oTop;
                    $(document).on('mousemove.drag', function (e) { el.offset({ top: e.clientY - dy, left: e.clientX - dx }); });
                },
                mouseup: function(e){ $(document).off('mousemove.drag'); }
            });
        });
    }
}(jQuery));
