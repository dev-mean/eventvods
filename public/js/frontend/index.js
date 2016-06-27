(function($) {
    $.fn.mouseIsOver = function() {
        return $(this).parent().find($(this).selector + ":hover").length > 0;
    };
    $.fn.evSlider = function(opts) {
        var defaults = {
            delay: 10000,
            index: 0,
            max: this.find('.image').length,
            el: this
        }
        var settings = $.extend(defaults, opts);
        this.find('.images').after('<div class="indicators"></div>');
        for(var i = 0; i < settings.max; i++)
        	this.find('.indicators').append('<span class="indicator" data-index="'+i+'">&nbsp;</span>');
        $('.indicator').click(function(el){
        	settings.index = $(this).attr('data-index');
        	$('.active').removeClass('active');
        	settings.el.find('.indicator').eq(settings.index).addClass('active');
        	settings.el.find('.image').eq(settings.index++).addClass('active');
        })
        this.find('.indicator').eq(settings.index).addClass('active');
        this.find('.image').eq(settings.index++).addClass('active');
        var iterate = function() {
            var hover = this.find('.image.active').find('.overlay').first().mouseIsOver();
            if(!hover){
            	$('.active').removeClass('active');
            	this.find('.indicator').eq(settings.index).addClass('active');
            	this.find('.image').eq(settings.index++).addClass('active');
            	if(settings.index == settings.max) settings.index = 0;
	        }
        }
        setInterval($.proxy(iterate, this), settings.delay);
        return this;
    };
}(jQuery));
