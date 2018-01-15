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

	console.log(options.crop)
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

	console.log(this.crop)

		this.$slideContainer.append('<div class="slide ' + cropClass + '"><img src="' + this.slides[i] + '" alt=""></div>');

		this.$container.find('.dots').append('<a href="#"><span></span></a>');
	}

	// Creating the next arrow
	//this.$container.append('')

	// Binding events
	this.bindEvents();

	// Render
	this.render();
}

Suyp.prototype.bindEvents = function(){
	var self = this;
		console.log('next')

	// Updating dots
	this.$container.find('.dots a').bind('click', function(e){
		self.currentSlide = $(this).index();
		self.render();
		e.preventDefault();
	});

	this.$container.find('a.btn').bind('click', function(e){
		
		if($(this).hasClass('next')){
			self.currentSlide++;
			if( self.currentSlide > self.$container.find('.slide').length-1 ){
				// TO DO : if self.
				self.currentSlide = 0;
			}
		}
		self.render();

		e.preventDefault();
	});

	this.$container.find('a.btn').each(function(){
		console.log('yo')
	})
}

Suyp.prototype.render = function(){
	// Rendering 'raw' transition types
	if( this.mode == 'raw' ){
		this.$container.find('.slide').hide();
		this.$container.find('.slide').eq(this.currentSlide).show();
	}
	else if( this.mode == 'fade' ){
		this.$container.find('.slide').fadeOut();
		this.$container.find('.slide').eq(this.currentSlide).fadeIn();
	}

	// Updating dots
	this.$container.find('.dots a').removeClass('selected');
	this.$container.find('.dots a').eq(this.currentSlide).addClass('selected');
}