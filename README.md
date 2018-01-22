## S.U.Y.P (Show Us Your ~~Pugs~~ Picts)
#### /!\ W.I.P • ~~even not an~~ alpha /!\

#### ABOUT :
SUYP is one more JS tool that helps you creating slideshow.
The goal is to make something flexible, easy to customize, ready to use...

#### HOW IT WORKS :
See exemple.html for a full exemple, but in short you have to :
- load suyp.css that defines some basic CSS rules • easy to customize
- load suyp.js
- instanciate the class like that :

```
suyp = new Suyp( $('#suyp'), {
	'slides': picturesUrl, // Array of urls
	'crop': true, // true -> cover, false -> contain
	'mode': 'slide-h', // Transition mode -> String
	'auto': true, // Automatic slider ? 
	'pictureDisplayTime': 1750, // Display time of each picture -> Number (ms) ex : 1000 = 1 sec
	'transitionDuration': 750, // Duration of the transition between picts -> Number (ms) ex : 1000 = 1 sec
	'transitionDelay': 250 // Delay between hiding the current pict and strat to display the prev / next picture -> Number (ms) ex : 1000 = 1 sec • NB : can be negative values
});	
```

#### DEPENDENCY :
[jquery](https://jquery.com/)
[gsap](https://greensock.com/gsap)

#### TO DO :
Improvements...Improvements everywhere.

#### CREDITS :

All the pugs picture are from [unsplash.com](https://unsplash.com/) under [Do Whatever You Want licence](https://unsplash.com/license).

To be precise :
- [Picture #01 - Mink Mingle](https://unsplash.com/photos/8qiBIM2YA3s)
- [Picture #02 - Matthew Henry](https://unsplash.com/photos/2Ts5HnA67k8)
- [Picture #03 - Matthew Henry](https://unsplash.com/photos/hnYMacpvKZY)
- [Picture #04 - Matthew Henry](https://unsplash.com/photos/3lL_Nlvpl08)