# S.U.Y.P
### Show Us Your ~~ Pugs ~~ Picts
# /!\ W.I.P /!\

Thing that makes stuff slide.
### W.I.P

```
var suyp;
var picturesUrl = [
	'img/001.jpg',
	'img/002.jpg',
	'img/003.jpg',
	'img/004.jpg'
];

$(function(){
	suyp = new Suyp( $('#head .slider'), {
		'slides': picturesUrl,
		'crop': true,
		'mode': 'fade'
	});	
});
```