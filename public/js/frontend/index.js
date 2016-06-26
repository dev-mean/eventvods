(function($) {
    $.fn.evSlider = function(opts) {
        var defaults = {
            delay: 10000,
            index: 0,
        }
        var settings = $.extend(defaults, opts);
        this.find('.image').eq(settings.index).addClass('active');
        var iterate = function(){
        	var current, next, siblings;
        	current = this.find('.active');
        	next = current.next('.image');
        	siblings = current.siblings('.image');
        	if(next.length !== 0 || siblings.length !== 0)
        		current.removeClass('active');
        	if(next.length > 0)
        		next.addClass('active');
        	else
        		siblings.eq(0).addClass('active');
        }
        setInterval($.proxy(iterate, this), settings.delay);
        return this;
    };
}(jQuery));
