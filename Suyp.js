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
	this.prepare();
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

Suyp.prototype.prepare = function(){
	var self = this;

	// Reset props
	this.$container.find('.slide').each(function(index){
		TweenMax.set( $(this), { "x": "0%", "y": "0%", "opacity": 0 } );
	});
	
	if( this.mode == 'raw' || this.mode == 'fade' ){
		this.$container.find('.slide').each(function(index){
			if( index != self.currentSlide ){
				TweenMax.set( $(this), { 'opacity': 0 } );
			}
			else{
				TweenMax.set( $(this), { 'opacity': 1 } );
			}
		});
	}
	else if( this.mode == 'slide-h' ){
		this.$container.find('.slide').each(function(index){
			if( index < self.currentSlide ){
				TweenMax.set( $(this), { 'opacity': 1, 'x': '-100%', 'y': '0%', 'ease': Expo.easeOut } );
			}
			else if( index > self.currentSlide ){
				TweenMax.set( $(this), { 'opacity': 1, 'x': '100%', 'y': '0%', 'ease': Expo.easeOut } );
			}
			else if( index == self.currentSlide ){
				TweenMax.set( $(this), { 'opacity': 1, 'x': '0%', 'y': '0%', 'ease': Expo.easeOut } );
			}
		});
	}
	else if( this.mode == 'slide-v' ){
		this.$container.find('.slide').each(function(index){
			if( index < self.currentSlide ){
				TweenMax.set( $(this), { 'opacity': 1, 'x': '0%', 'y': '-100%', 'ease': Expo.easeOut } );
			}
			else if( index > self.currentSlide ){
				TweenMax.set( $(this), { 'opacity': 1, 'x': '0%', 'y': '100%', 'ease': Expo.easeOut } );
			}
			else if( index == self.currentSlide ){
				TweenMax.set( $(this), { 'opacity': 1, 'x': '0%', 'y': '0%', 'ease': Expo.easeOut } );
			}
		});
	}

	self.render();
}

Suyp.prototype.render = function(){
	var self = this;

	// Rendering 'raw' transition types
	if( this.mode == 'raw' ){
		this.$container.find('.slide').each(function(index){
			if( index != self.currentSlide ){
				TweenMax.set( $(this), { 'opacity': 0 } );
			}
			else{
				TweenMax.set( $(this), { 'opacity': 1 } );
			}
		});
	}
	else if( this.mode == 'fade' ){
		this.$container.find('.slide').each(function(index){
			if( index != self.currentSlide ){
				TweenMax.to( $(this), self.transitionDuration/1000, { 'opacity': 0, ease: Expo.easeOut } );
			}
			else{
				TweenMax.to( $(this), self.transitionDuration/1000, { 'opacity': 1, ease: Expo.easeOut } );
			}
		});
	}
	else if( this.mode == 'slide-h' ){
		this.$container.find('.slide').each(function(index){
			if( index < self.currentSlide ){
				TweenMax.to( $(this), self.transitionDuration/1000, { 'x': '-100%', 'y': '0%', 'ease': Expo.easeOut } );
			}
			else if( index > self.currentSlide ){
				TweenMax.to( $(this), self.transitionDuration/1000, { 'x': '100%', 'y': '0%', 'ease': Expo.easeOut } );
			}
			else if( index == self.currentSlide ){
				TweenMax.to( $(this), self.transitionDuration/1000, { 'x': '0%', 'y': '0%', 'ease': Expo.easeOut } );
			}
		});
	}
	else if( this.mode == 'slide-v' ){
		this.$container.find('.slide').each(function(index){
			if( index < self.currentSlide ){
				TweenMax.to( $(this), self.transitionDuration/1000, { 'opacity': 1, 'x': '0%', 'y': '-100%', 'ease': Expo.easeOut } );
			}
			else if( index > self.currentSlide ){
				TweenMax.to( $(this), self.transitionDuration/1000, { 'opacity': 1, 'x': '0%', 'y': '100%', 'ease': Expo.easeOut } );
			}
			else if( index == self.currentSlide ){
				TweenMax.to( $(this), self.transitionDuration/1000, { 'opacity': 1, 'x': '0%', 'y': '0%', 'ease': Expo.easeOut } );
			}
		});
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