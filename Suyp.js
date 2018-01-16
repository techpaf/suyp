var Suyp = function( $container, options ){
	this.$container = $container;
	this.$slideContainer = $container;
	this.slides = options.slides || [];
	this.mode = options.mode || 'raw';
	this.currentSlide = options.startAt || 0;
	this.looping = options.loop || false;
	this.displayArrows = options.displayArrows || true;
	this.displayDots = options.displayDots || true;
	this.hideOverflow = options.hideOverflow || true;
	this.touchEnabled = options.touchEnabled || true;
	this.crop = options.crop;
	this.auto = options.auto || false;
	this.transitionDelay = options.transitionDelay || 1000;
	this.transitionDuration = options.transitionDuration || options.transitionDelay * 0.25;
	this.loopTO;
	this.firstRender = true;

	this.buildDom();
}

Suyp.prototype.buildDom = function(){
	// Containers customization / creation
	this.$container.addClass('suyp');
	this.$container.append('<div class="slide-container ' + this.mode + '"></div>');
	this.$slideContainer = this.$container.find('.slide-container');

	// Creating dots container
	this.$container.append('<div class="dots"></div>');

	// Creating slides
	for( var i = 0; i < this.slides.length; i++ ){
		var cropClass = (this.crop)?'cover':'contain';
		this.$slideContainer.append('<div class="slide ' + cropClass + '"><img src="' + this.slides[i] + '" alt=""></div>');
		this.$container.find('.dots').append('<a href="#"><span></span></a>');
	}

	// Binding events
	this.bindEvents();

	// Render
	this.render();
}

Suyp.prototype.bindEvents = function(){
	var self = this;

	// Updating dots
	this.$container.find('.dots a').bind('click', function(e){
		if( !self.auto || self.auto ){
			self.currentSlide = $(this).index();
			self.render();
		}
		e.preventDefault();
	});

	this.$container.find('a.btn').bind('click', function(e){		
		if( $(this).hasClass('next') ){
			self.next();
		}
		else if( $(this).hasClass('prev') ){
			self.prev();
		}

		e.preventDefault();
	});
}

Suyp.prototype.prev = function(){
	var self = this;
	
	self.currentSlide--;
	if( self.currentSlide < 0 ){
		self.currentSlide = self.$container.find('.slide').length-1;
	}
	self.render();
}

Suyp.prototype.next = function(){
	var self = this;
	
	self.currentSlide++;
	if( self.currentSlide > self.$container.find('.slide').length-1 ){
		// TO DO : if self.
		self.currentSlide = 0;
	}
	self.render();
}

Suyp.prototype.render = function(){
	var self = this;

	if( !this.firstRender ){
		// Rendering 'raw' transition types
		if( this.mode == 'raw' ){
			this.$container.find('.slide').hide();
			this.$container.find('.slide').eq(this.currentSlide).show();
		}
		else if( this.mode == 'fade' ){
			this.$container.find('.slide').fadeOut();
			this.$container.find('.slide').eq(this.currentSlide).fadeIn();
		}
		else if( this.mode == 'slide-h' ){
			var $cs = this.$container.find('.slide').fadeOut();
			var $ns = this.$container.find('.slide').eq(this.currentSlide).fadeIn();
		}
	}
	else{
		// Rendering 'raw' transition types
		if( this.mode == 'fade' ){
			this.$container.find('.slide').hide();
			this.$container.find('.slide').eq(this.currentSlide).show();
		}

		this.firstRender = false;
	}

	// Updating dots
	this.$container.find('.dots a').removeClass('selected');
	this.$container.find('.dots a').eq(this.currentSlide).addClass('selected');

	if( this.auto ){
		if( this.loopTO ){
			clearTimeout( this.loopTO );
		}
		this.loopTO = setTimeout(function(){
			self.next();
		}, this.transitionDelay);
	}
}