(function($) {
	$.fn.mouseIsOver = function() {
		return $(this).parent().find($(this).selector + ":hover").length > 0;
	};
	var clearableInterval = (function(oldsetInterval) {
		var registered = [],
			f = function(a, b) {
				return registered[registered.length] = oldsetInterval(a, b);//jshint ignore:line
			};
		f.clear = function() {
			var r;
			while (r = registered.pop()) {//jshint ignore:line
				clearInterval(r);
			}
		};
		return f;
	})(window.setInterval);
	$.fn.evSlider = function(opts) {
		var defaults = {
			delay: 7500,
			index: 0,
			max: this.find('.image').length,
			el: this
		};
		var settings = $.extend(defaults, opts);
		// Initialise stuff
		clearableInterval.clear();
		$('.evSlider .indicators').remove();
		this.find('.images').after('<div class="indicators"></div>');
		for (var i = 0; i < settings.max; i++)
			this.find('.indicators').append('<span class="indicator" data-index="' + i + '">&nbsp;</span>');
		this.find('.indicator').eq(settings.index).addClass('active');
		this.find('.image').eq(settings.index++).addClass('active');

		//Change to index function
		function gotoSlide(index){
			settings.index = index;
			$('.evSlider .active').removeClass('active');
			settings.el.find('.indicator').eq(settings.index).addClass('active');
			settings.el.find('.image').eq(settings.index++).addClass('active');
			clearableInterval.clear();
			clearableInterval($.proxy(iterate, settings.el), settings.delay);
		}
		//Continued functions
		$('.indicator').click(function() {
			gotoSlide($(this).attr('data-index'));
		});
		$('.arrow-left').click(function(){
			if(settings.index == 0)
				gotoSlide(settings.max);
			else
				gotoSlide(settings.index-2);
		});
		$('.arrow-right').click(function(){
			if(settings.index == settings.max)
				gotoSlide(0);
			else
				gotoSlide(settings.index);
		});
		var iterate = function() {
			if (settings.index == settings.max) settings.index = 0;
			var hover = this.find('.image.active .overlay').first().mouseIsOver();
			if (!hover) {
				$('.evSlider .active').removeClass('active');
				this.find('.indicator').eq(settings.index).addClass('active');
				this.find('.image').eq(settings.index++).addClass('active');
			}
		};
		clearableInterval($.proxy(iterate, settings.el), settings.delay);
		return this;
	};
}(jQuery));
