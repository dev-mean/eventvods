(function($) {
    $.fn.mouseIsOver = function() {
        return $(this).parent().find($(this).selector + ":hover").length > 0;
    };
    $.fn.evSlider = function(opts) {
        var defaults = {
            delay: 10000,
            startIndex: 0,
        }
        var settings = $.extend(defaults, opts);
        this.find('.image').eq(settings.startIndex).addClass('active');
        var iterate = function() {
            var current, next, siblings;
            current = this.find('.active');
            var hover = current.find('.overlay').first().mouseIsOver();
            if(!hover){
	            next = current.next('.image');
	            siblings = current.siblings('.image');
	            if (next.length !== 0 || siblings.length !== 0) current.removeClass('active');
	            if (next.length > 0) next.addClass('active');
	            else siblings.eq(0).addClass('active');
	        }
        }
        setInterval($.proxy(iterate, this), settings.delay);
        return this;
    };
}(jQuery));
