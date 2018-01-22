/////////////////
// CONSTRUCTOR //
/////////////////

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
	this.pictureDisplayTime = options.pictureDisplayTime || 1000;
	this.transitionDelay = options.transitionDelay || 0;
	this.transitionDuration = options.transitionDuration || 500;
	this.loopTO;
	this.firstRender = true;
	this.windowFocused = true;

	this.buildDom();
}

////////////////////////////////////////////
// CONTAINER CUSTOMIZATION + DOM CREATION //
////////////////////////////////////////////

Suyp.prototype.buildDom = function(){
	this.$container.addClass('suyp');
	this.$container.addClass( this.mode );
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

////////////////////
// BINDING EVENTS //
////////////////////

Suyp.prototype.bindEvents = function(){
	var self = this;

	// Updating dots
	this.$container.find('.dots a').bind('click', function(e){

		if( $(this).index() != self.currentSlide ){
			self.$container.trigger({
				type: "slide-change",
				datas: {
					'direction': ($(this).index() < self.currentSlide)?'prev':'next',
					'currentIndex': $(this).index()
				},
				time: new Date()
			});

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

	$(window).bind('focus', function(){
		self.windowFocused = true;
		self.render();
	});

	$(window).bind('blur', function(){
		self.windowFocused = false;
	});
}

///////////////////////////
// HANDLING NEXT && PREV //
///////////////////////////

Suyp.prototype.prev = function(){
	var self = this;
	
	self.currentSlide--;
	if( self.currentSlide < 0 ){
		self.currentSlide = self.$container.find('.slide').length-1;
	}

	self.$container.trigger({
		type: "slide-change",
		datas: {
			'direction': 'prev',
			'currentIndex': self.currentSlide
		},
		time: new Date()
	});

	self.render();
}

Suyp.prototype.next = function(){
	var self = this;
	
	self.currentSlide++;
	if( self.currentSlide > self.$container.find('.slide').length-1 ){
		// TO DO : if self.
		self.currentSlide = 0;
	}

	self.$container.trigger({
		type: "slide-change",
		datas: {
			'direction': 'next',
			'currentIndex': self.currentSlide
		},
		time: new Date()
	});

	self.render();
}

///////////////////
// MODE SETTINGS //
///////////////////

Suyp.prototype.setMode = function( mode ){
	this.mode = mode || 'fade';
	this.$container.removeClass( 'raw fade slide-v slide-h zoom-in zoom-out rise' );
	this.$container.addClass( mode );
	this.prepare();
}

//////////////////////////////////////////////
// RESET / SET SOME CSS PROPS ON DOM OBJECT //
//////////////////////////////////////////////

Suyp.prototype.prepare = function(){
	var self = this;

	// Reset props
	this.$container.find('.slide').each(function(index){
		TweenMax.set( $(this), { "x": "0%", "y": "0%", "opacity": "0", "scale": "1", "transformOrigin": 'center center', "rotationX": 0, "rotationY": 0, "rotationZ": 0, } );
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
				TweenMax.set( $(this), { 'opacity': 1, 'x': '-100%', 'y': '0%' } );
			}
			else if( index > self.currentSlide ){
				TweenMax.set( $(this), { 'opacity': 1, 'x': '100%', 'y': '0%' } );
			}
			else if( index == self.currentSlide ){
				TweenMax.set( $(this), { 'opacity': 1, 'x': '0%', 'y': '0%' } );
			}
		});
	}
	else if( this.mode == 'slide-v' ){
		this.$container.find('.slide').each(function(index){
			if( index < self.currentSlide ){
				TweenMax.set( $(this), { 'opacity': 1, 'x': '0%', 'y': '-100%' } );
			}
			else if( index > self.currentSlide ){
				TweenMax.set( $(this), { 'opacity': 1, 'x': '0%', 'y': '100%' } );
			}
			else if( index == self.currentSlide ){
				TweenMax.set( $(this), { 'opacity': 1, 'x': '0%', 'y': '0%' } );
			}
		});
	}
	else if( this.mode == 'zoom-in' ){
		this.$container.find('.slide').each(function(index){
			if( index < self.currentSlide ){
				TweenMax.set( $(this), { 'opacity': 0, 'scale': 1.05 } );
			}
			else if( index > self.currentSlide ){
				TweenMax.set( $(this), { 'opacity': 0, 'scale': 0.95 } );
			}
			else if( index == self.currentSlide ){
				TweenMax.set( $(this), { 'opacity': 1, 'scale': 1 } );
			}
		});
	}
	else if( this.mode == 'zoom-out' ){
		this.$container.find('.slide').each(function(index){
			if( index < self.currentSlide ){
				TweenMax.set( $(this), { 'opacity': 0, 'scale': 0.95 } );
			}
			else if( index > self.currentSlide ){
				TweenMax.set( $(this), { 'opacity': 0, 'scale': 1.05 } );
			}
			else if( index == self.currentSlide ){
				TweenMax.set( $(this), { 'opacity': 1, 'scale': 1 } );
			}
		});
	}
	else if( this.mode == 'rise' ){
		this.$container.find('.slide').each(function(index){
			if( index < self.currentSlide ){
				TweenMax.set( $(this), { 'opacity': 0, 'transformOrigin': 'center bottom', 'force3D': true, 'rotationX': -90 } );
			}
			else if( index > self.currentSlide ){
				TweenMax.set( $(this), { 'opacity': 0, 'transformOrigin': 'center bottom', 'force3D': true, 'rotationX': 90 } );
			}
			else if( index == self.currentSlide ){
				TweenMax.set( $(this), { 'opacity': 1, 'transformOrigin': 'center bottom', 'force3D': true, 'rotationX': 0 } );
			}
		});
	}
	else if( this.mode == 'rise-reverted' ){
		this.$container.find('.slide').each(function(index){
			if( index < self.currentSlide ){
				TweenMax.set( $(this), { 'opacity': 0, 'transformOrigin': 'center bottom', 'force3D': true, 'rotationX': 90 } );
			}
			else if( index > self.currentSlide ){
				TweenMax.set( $(this), { 'opacity': 0, 'transformOrigin': 'center bottom', 'force3D': true, 'rotationX': -90 } );
			}
			else if( index == self.currentSlide ){
				TweenMax.set( $(this), { 'opacity': 1, 'transformOrigin': 'center bottom', 'force3D': true, 'rotationX': 0 } );
			}
		});
	}

	self.render();
}

////////////////////////
// RENDERING FUNCTION //
////////////////////////

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
				TweenMax.to( $(this), self.transitionDuration/1000, { 'opacity': 1, ease: Expo.easeOut, delay: self.transitionDelay/1000 } );
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
				TweenMax.to( $(this), self.transitionDuration/1000, { 'x': '0%', 'y': '0%', 'ease': Expo.easeOut, delay: self.transitionDelay/1000 } );
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
				TweenMax.to( $(this), self.transitionDuration/1000, { 'opacity': 1, 'x': '0%', 'y': '0%', 'ease': Expo.easeOut, delay: self.transitionDelay/1000 } );
			}
		});
	}
	else if( this.mode == 'zoom-in' ){
		this.$container.find('.slide').each(function(index){
			if( index < self.currentSlide ){
				TweenMax.to( $(this), self.transitionDuration/1000, { 'opacity': 0, 'scale': 1.05, 'ease': Expo.easeOut } );
			}
			else if( index > self.currentSlide ){
				TweenMax.to( $(this), self.transitionDuration/1000, { 'opacity': 0, 'scale': 0.95, 'ease': Expo.easeOut } );
			}
			else if( index == self.currentSlide ){
				TweenMax.to( $(this), self.transitionDuration/1000, { 'opacity': 1, 'scale': 1, 'ease': Expo.easeOut, delay: self.transitionDelay/1000 } );
			}
		});
	}
	else if( this.mode == 'zoom-out' ){
		this.$container.find('.slide').each(function(index){
			if( index < self.currentSlide ){
				TweenMax.to( $(this), self.transitionDuration/1000, { 'opacity': 0, 'scale': 0.95, 'ease': Expo.easeOut } );
			}
			else if( index > self.currentSlide ){
				TweenMax.to( $(this), self.transitionDuration/1000, { 'opacity': 0, 'scale': 1.05, 'ease': Expo.easeOut } );
			}
			else if( index == self.currentSlide ){
				TweenMax.to( $(this), self.transitionDuration/1000, { 'opacity': 1, 'scale': 1, 'ease': Expo.easeOut, delay: self.transitionDelay/1000 } );
			}
		});
	}
	else if( this.mode == 'rise' ){
		this.$container.find('.slide').each(function(index){
			if( index < self.currentSlide ){
				TweenMax.to( $(this), self.transitionDuration/1000, { 'opacity': 0, 'force3D': true, 'rotationX': -90 } );
			}
			else if( index > self.currentSlide ){
				TweenMax.to( $(this), self.transitionDuration/1000, { 'opacity': 0, 'force3D': true, 'rotationX': 90 } );
			}
			else if( index == self.currentSlide ){
				TweenMax.to( $(this), self.transitionDuration/1000, { 'opacity': 1, 'force3D': true, 'rotationX': 0, 'ease': Expo.easeOut, delay: self.transitionDelay/1000 } );
			}
		});
	}
	else if( this.mode == 'rise-reverted' ){
		this.$container.find('.slide').each(function(index){
			if( index < self.currentSlide ){
				TweenMax.to( $(this), self.transitionDuration/1000, { 'opacity': 0, 'force3D': true, 'rotationX': 90 } );
			}
			else if( index > self.currentSlide ){
				TweenMax.to( $(this), self.transitionDuration/1000, { 'opacity': 0, 'force3D': true, 'rotationX': -90 } );
			}
			else if( index == self.currentSlide ){
				TweenMax.to( $(this), self.transitionDuration/1000, { 'opacity': 1, 'force3D': true, 'rotationX': 0, 'ease': Expo.easeOut, delay: self.transitionDelay/1000 } );
			}
		});
	}

	// Updating dots
	this.$container.find('.dots a').removeClass('selected');
	this.$container.find('.dots a').eq(this.currentSlide).addClass('selected');

	// If the window is focused and if the suyp instance is confirured to auto-run, then show the next pict
	if( this.auto && this.windowFocused ){
		if( this.loopTO ){
			clearTimeout( this.loopTO );
		}
		this.loopTO = setTimeout(function(){
			self.next();
		}, this.pictureDisplayTime);
	}
}