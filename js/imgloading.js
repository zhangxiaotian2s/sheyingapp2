function hasClass(obj, cls) {  
    return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));  
}  
function addClass(obj, cls) {  
    if (!this.hasClass(obj, cls)) obj.className += " " + cls;  
}  
  
function removeClass(obj, cls) {  
    if (hasClass(obj, cls)) {  
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');  
        obj.className = obj.className.replace(reg, ' ');  
    }  
}  

document.body.innerHTML+='<style>.fade-in{-webkit-animation:fade-in-ac .5s linear forwards;-moz-animation:fade-in-ac .3s linear forwards;animation:fade-in-ac .3s linear forwards}@-webkit-keyframes name{from{-webkit-opacity:0}to{-webkit-opacity:1}}@-moz-keyframes fade-in-ac{from{-moz-opacity:0}to{-moz-opacity:1}}@keyframes name{from{opacity:0}to{opacity:1}} </style>'
var loadimg = function() {
	this.img = document.querySelectorAll(".loadimg");
	this.w_h = window.screen.height;
	this.datasrc = 'data-src';
}
loadimg.prototype.scrolladd = function() {
        var 		_l = this.img.length;
	for (i = 0; i < _l; i++) {
		var _this = this.img[i],
			_datasrc = _this.getAttribute(this.datasrc),
			_nowsrc = _this.getAttribute('src'),
			_offtop = this.img[0].offsetTop
			console.log(_offtop)
		if (_datasrc != _nowsrc && _offtop<this.w_h) {
			_this.setAttribute('src', _datasrc)
//			addClass(_this,'fade-in')
		}
	}
}

//var loadnow = new loadimg();
//	loadnow.scrolladd();
//document.addEventListener('load', new function() {
//	var loadnow = new loadimg();
//	loadnow.scrolladd();
//	document.body.ontouchmove = function() {
//		loadnow.scrolladd();
//	}
//	window.onscroll = function() {
//		loadnow.scrolladd();
//	}
//}, false)