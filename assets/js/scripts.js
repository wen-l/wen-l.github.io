// Utility function
function Util () {};

/* 
	class manipulation functions
*/
Util.hasClass = function(el, className) {
	if (el.classList) return el.classList.contains(className);
	else return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
};

Util.addClass = function(el, className) {
	var classList = className.split(' ');
 	if (el.classList) el.classList.add(classList[0]);
 	else if (!Util.hasClass(el, classList[0])) el.className += " " + classList[0];
 	if (classList.length > 1) Util.addClass(el, classList.slice(1).join(' '));
};

Util.removeClass = function(el, className) {
	var classList = className.split(' ');
	if (el.classList) el.classList.remove(classList[0]);	
	else if(Util.hasClass(el, classList[0])) {
		var reg = new RegExp('(\\s|^)' + classList[0] + '(\\s|$)');
		el.className=el.className.replace(reg, ' ');
	}
	if (classList.length > 1) Util.removeClass(el, classList.slice(1).join(' '));
};

Util.toggleClass = function(el, className, bool) {
	if(bool) Util.addClass(el, className);
	else Util.removeClass(el, className);
};

Util.setAttributes = function(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
};

/* 
  DOM manipulation
*/
Util.getChildrenByClassName = function(el, className) {
  var children = el.children,
    childrenByClass = [];
  for (var i = 0; i < el.children.length; i++) {
    if (Util.hasClass(el.children[i], className)) childrenByClass.push(el.children[i]);
  }
  return childrenByClass;
};

Util.is = function(elem, selector) {
  if(selector.nodeType){
    return elem === selector;
  }

  var qa = (typeof(selector) === 'string' ? document.querySelectorAll(selector) : selector),
    length = qa.length,
    returnArr = [];

  while(length--){
    if(qa[length] === elem){
      return true;
    }
  }

  return false;
};

/* 
	Animate height of an element
*/
Util.setHeight = function(start, to, element, duration, cb) {
	var change = to - start,
	    currentTime = null;

  var animateHeight = function(timestamp){  
    if (!currentTime) currentTime = timestamp;         
    var progress = timestamp - currentTime;
    var val = parseInt((progress/duration)*change + start);
    element.style.height = val+"px";
    if(progress < duration) {
        window.requestAnimationFrame(animateHeight);
    } else {
    	cb();
    }
  };
  
  //set the height of the element before starting animation -> fix bug on Safari
  element.style.height = start+"px";
  window.requestAnimationFrame(animateHeight);
};

/* 
	Animate width of an element
*/
Util.setWidth = function(start, to, element, duration, cb) {
	var change = to - start,
      currentTime = null;

  var animateWidth = function(timestamp){  
    if (!currentTime) currentTime = timestamp;         
    var progress = timestamp - currentTime;
    var val = parseInt((progress/duration)*change + start);
    element.style.width = val+"px";
    if(progress < duration) {
        window.requestAnimationFrame(animateWidth);
    } else {
      if (cb != undefined) {
        cb();
      }
    }
  };
  
  //set the height of the element before starting animation -> fix bug on Safari
  element.style.width = start+"px";
  window.requestAnimationFrame(animateWidth);
};

/* 
	Smooth Scroll
*/

Util.scrollTo = function(final, duration, cb) {
  var start = window.scrollY || document.documentElement.scrollTop,
      currentTime = null;
      
  var animateScroll = function(timestamp){
  	if (!currentTime) currentTime = timestamp;        
    var progress = timestamp - currentTime;
    if(progress > duration) progress = duration;
    var val = Math.easeInOutQuad(progress, start, final-start, duration);
    window.scrollTo(0, val);
    if(progress < duration) {
        window.requestAnimationFrame(animateScroll);
    } else {
      cb && cb();
    }
  };

  window.requestAnimationFrame(animateScroll);
};

/* 
  Focus utility classes
*/

//Move focus to an element
Util.moveFocus = function (element) {
  if( !element ) element = document.getElementsByTagName("body")[0];
  element.focus();
  if (document.activeElement !== element) {
    element.setAttribute('tabindex','-1');
    element.focus();
  }
};

/* 
  Misc
*/

Util.getIndexInArray = function(array, el) {
  return Array.prototype.indexOf.call(array, el);
};

Util.cssSupports = function(property, value) {
  if('CSS' in window) {
    return CSS.supports(property, value);
  } else {
    var jsProperty = property.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase();});
    return jsProperty in document.body.style;
  }
};

// merge a set of user options into plugin defaults
// https://gomakethings.com/vanilla-javascript-version-of-jquery-extend/
Util.extend = function() {
  // Variables
  var extended = {};
  var deep = false;
  var i = 0;
  var length = arguments.length;

  // Check if a deep merge
  if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
    deep = arguments[0];
    i++;
  }

  // Merge the object into the extended object
  var merge = function (obj) {
    for ( var prop in obj ) {
      if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
        // If deep merge and property is an object, merge properties
        if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
          extended[prop] = extend( true, extended[prop], obj[prop] );
        } else {
          extended[prop] = obj[prop];
        }
      }
    }
  };

  // Loop through each object and conduct a merge
  for ( ; i < length; i++ ) {
    var obj = arguments[i];
    merge(obj);
  }

  return extended;
};

// Check if Reduced Motion is enabled
Util.osHasReducedMotion = function() {
  var matchMediaObj = window.matchMedia('(prefers-reduced-motion: reduce)');
  if(matchMediaObj) return matchMediaObj.matches;
  return false; // return false if not supported
}; 

/* 
	Polyfills
*/
//Closest() method
if (!Element.prototype.matches) {
	Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
	Element.prototype.closest = function(s) {
		var el = this;
		if (!document.documentElement.contains(el)) return null;
		do {
			if (el.matches(s)) return el;
			el = el.parentElement || el.parentNode;
		} while (el !== null && el.nodeType === 1); 
		return null;
	};
}

//Custom Event() constructor
if ( typeof window.CustomEvent !== "function" ) {

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
}

/* 
	Animation curves
*/
Math.easeInOutQuad = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};
// File#: _1_accordion
(function() {
	var Accordion = function(element) {
		this.element = element;
		this.items = Util.getChildrenByClassName(this.element, 'js-accordion__item');
		this.showClass = 'accordion__item--is-open';
		this.animateHeight = (this.element.getAttribute('data-animation') == 'on');
		this.multiItems = !(this.element.getAttribute('data-multi-items') == 'off'); 
		this.initAccordion();
	};

	Accordion.prototype.initAccordion = function() {
		//set initial aria attributes
		for( var i = 0; i < this.items.length; i++) {
			var button = this.items[i].getElementsByTagName('button')[0],
				content = this.items[i].getElementsByClassName('js-accordion__panel')[0],
				isOpen = Util.hasClass(this.items[i], this.showClass) ? 'true' : 'false';
			Util.setAttributes(button, {'aria-expanded': isOpen, 'aria-controls': 'accordion-content-'+i, 'id': 'accordion-header-'+i});
			Util.addClass(button, 'js-accordion__trigger');
			Util.setAttributes(content, {'aria-labelledby': 'accordion-header-'+i, 'id': 'accordion-content-'+i});
		}

		//listen for Accordion events
		this.initAccordionEvents();
	};

	Accordion.prototype.initAccordionEvents = function() {
		var self = this;

		this.element.addEventListener('click', function(event) {
			var trigger = event.target.closest('.js-accordion__trigger');
			//check index to make sure the click didn't happen inside a children accordion
			if( trigger && Util.getIndexInArray(self.items, trigger.parentElement) >= 0) self.triggerAccordion(trigger);
		});
	};

	Accordion.prototype.triggerAccordion = function(trigger) {
		var self = this;
		var bool = (trigger.getAttribute('aria-expanded') === 'true');

		this.animateAccordion(trigger, bool);
	};

	Accordion.prototype.animateAccordion = function(trigger, bool) {
		var self = this;
		var item = trigger.closest('.js-accordion__item'),
			content = item.getElementsByClassName('js-accordion__panel')[0],
			ariaValue = bool ? 'false' : 'true';

		if(!bool) Util.addClass(item, this.showClass);
		trigger.setAttribute('aria-expanded', ariaValue);

		if(this.animateHeight) {
			//store initial and final height - animate accordion content height
			var initHeight = bool ? content.offsetHeight: 0,
				finalHeight = bool ? 0 : content.offsetHeight;
		}

		if(window.requestAnimationFrame && this.animateHeight) {
			Util.setHeight(initHeight, finalHeight, content, 200, function(){
				self.resetContentVisibility(item, content, bool);
			});
		} else {
			self.resetContentVisibility(item, content, bool);
		}

		if( !this.multiItems && !bool) this.closeSiblings(item);

	};

	Accordion.prototype.resetContentVisibility = function(item, content, bool) {
		Util.toggleClass(item, this.showClass, !bool);
		content.removeAttribute("style");
	};

	Accordion.prototype.closeSiblings = function(item) {
		//if only one accordion can be open -> search if there's another one open
		var index = Util.getIndexInArray(this.items, item);
		for( var i = 0; i < this.items.length; i++) {
			if(Util.hasClass(this.items[i], this.showClass) && i != index) {
				this.animateAccordion(this.items[i].getElementsByClassName('js-accordion__trigger')[0], true);
				return false;
			}
		}
	};
	
	//initialize the Accordion objects
	var accordions = document.getElementsByClassName('js-accordion');
	if( accordions.length > 0 ) {
		for( var i = 0; i < accordions.length; i++) {
			(function(i){new Accordion(accordions[i]);})(i);
		}
	}
}());
// File#: _1_anim-menu-btn
// Usage: codyhouse.co/license
(function () {
    var menuBtns = document.getElementsByClassName('js-anim-menu-btn');
    if (menuBtns.length > 0) {
        for (var i = 0; i < menuBtns.length; i++) {
            (function (i) {
                initMenuBtn(menuBtns[i]);
            })(i);
        }

        function initMenuBtn(btn) {
            btn.addEventListener('click', function (event) {
                event.preventDefault();
                var status = !Util.hasClass(btn, 'anim-menu-btn--state-b');
                Util.toggleClass(btn, 'anim-menu-btn--state-b', status);
                // emit custom event
                var event = new CustomEvent('anim-menu-btn-clicked', { detail: status });
                btn.dispatchEvent(event);
            });
        };
    }
}());
// File#: _1_animated-headline
function parents(el, parentSelectorAll) {
    if (parentSelectorAll === undefined) {
        parentSelector = document;
    } else {
        parentSelector = document.querySelector(parentSelectorAll)
    }

    var pars = [];
    var p = el.parentNode;

    while (p != parentSelector) {
        var o = p;
        pars.push(o);
        p = o.parentNode;
    }
    pars.push(parentSelector);

    return pars;
};

function matches(el, selector) {
    return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
};

function listHasClass(list, cls) {
    for (var i = 0; i < list.length; i++) {
        var element = list[i];
        if (element.classList.contains(cls)) {
            return true;
        }
    }
    return false;
};

function removeClassMultiple(list, cls) {
    for (var i = 0; i < list.length; i++) {
        var element = list[i];
        element.classList.remove(cls);
    }
};

function addClassMultiple(list, cls) {
    for (var i = 0; i < list.length; i++) {
        var element = list[i];
        element.classList.add(cls);
    }
};


(function () {

    var AnimatedHeadline = function(element) {
        this.element = element;
        this.animationDelay = 2500,
        //loading bar effect
        this.barAnimationDelay = 3800,
        this.barWaiting = this.barAnimationDelay - 3000, //3000 is the duration of the transition on the loading bar - set in the scss/css file
        //letters effect
        this.lettersDelay = 50,
        //type effect
        this.typeLettersDelay = 120,
        this.selectionDuration = 1000,
        this.typeAnimationDelay = this.selectionDuration + 300,
        //clip effect 
        this.revealDuration = 600,
        this.revealAnimationDelay = 1500;
        this.showClass = "letter--is-visible";
        this.letteredHeadlines = document.querySelectorAll('.cd-headline.letters');
        if (this.element.classList.contains('letters')) {
            this.words = this.element.querySelectorAll('b');
        }

        this.initHeadline();
    };

    AnimatedHeadline.prototype.initHeadline = function() {
        // var self = this;
        this.singleLetters();
        this.animateHeadline();
    }

    AnimatedHeadline.prototype.singleLetters = function() {
        // var self = this;
        if (this.words) {
            for (var x = 0; x < this.words.length; x++) {
                var word = this.words[x],
                    letters = word.textContent.split(''),
                    selected = word.classList.contains('is-visible');
                for (i in letters) {
                    if (parents(word, '.rotate-2').length > 0) letters[i] = '<em>' + letters[i] + '</em>';
                    letters[i] = (selected) ? '<i class="in">' + letters[i] + '</i>' : '<i>' + letters[i] + '</i>';
                }
                var newLetters = letters.join('');
                word.innerHTML = newLetters;
                word.style.opacity = '1';
            }
        }
    }

    AnimatedHeadline.prototype.animateHeadline = function() {
        var self = this;
        var duration = this.animationDelay;
        var headline = this.element;

        if (headline.classList.contains('loading-bar')) {
            duration = this.barAnimationDelay;
            setTimeout(function () {
                var wrapper = headline.querySelectorAll('.cd-words-wrapper');
                addClassMultiple(wrapper, 'is-loading');
            }, self.barWaiting);
        } else if (headline.classList.contains('clip')) {
            var spanWrapper = headline.querySelectorAll('.cd-words-wrapper')[0],
                newWidth = parseFloat(getComputedStyle(spanWrapper, null).width.replace("px", "")) + 10
            // spanWrapper.css('width', newWidth);
            spanWrapper.style.width = newWidth;
        } else if (!headline.classList.contains('type')) {
            //assign to .cd-words-wrapper the width of its longest word
            var words = headline.querySelectorAll('.cd-words-wrapper b'),
                width = 0;
            // words.each(function () {
            //     var wordWidth = $(this).width();
            //     if (wordWidth > width) width = wordWidth;
            // });
            for (var i = 0; i < words.length; i++) {
                var element = words[i];
                var wordWidth = parseFloat(getComputedStyle(element, null).width.replace("px", ""));
                if (wordWidth > width) width = wordWidth;
            }
            var wrapper = headline.querySelectorAll('.cd-words-wrapper')[0]
            wrapper.style.width = width;
        };

        //trigger animation
        setTimeout(function () { self.hideWord(headline.querySelectorAll('.is-visible')[0]) }, duration);

    }

    AnimatedHeadline.prototype.hideWord = function ($word) {
        var self = this;
        var nextWord = this.takeNext($word);

        if (listHasClass(parents($word, '.cd-headline'), 'type')) {
            var parentSpan = $word.parentNode;
            parentSpan.classList.add('selected')
            parentSpan.classList.remove('waiting');
            setTimeout(function () {
                parentSpan.classList.remove('selected');
                $word.classList.remove('is-visible')
                $word.classList.add('is-hidden')
                // var word_children = $word.children.removeClass('in').addClass('out');
                for (var i = 0; i < $word.children.length; i++) {
                    var element = $word.children[i];
                    element.classList.remove('in');
                    element.classList.remove('last');
                    element.classList.add('out');
                }
            }, self.selectionDuration);
            setTimeout(function () { self.showWord(nextWord, self.typeLettersDelay) }, self.typeAnimationDelay);

        } else if (listHasClass(parents($word, '.cd-headline'),'letters')) {
            var bool = ($word.children.length >= nextWord.children.length) ? true : false;
            this.hideLetter($word.querySelectorAll('i')[0], $word, bool, self.lettersDelay);
            this.showLetter(nextWord.querySelectorAll('i')[0], nextWord, bool, self.lettersDelay);

        } else if (listHasClass(parents($word, '.cd-headline'), 'clip')) {
            var wrapper = parents($word, '.cd-words-wrapper')
            for (var i = 0; i < wrapper.length; i++) {
                var element = wrapper[i];
                Util.setWidth(parseFloat(getComputedStyle(element, null).width.replace("px", "")), 2, element, self.revealDuration, function () {
                    self.switchWord($word, nextWord);
                    self.showWord(nextWord);
                });
            }

        } else if (listHasClass(parents($word, '.cd-headline'), 'loading-bar')) {
            removeClassMultiple(parents($word, '.cd-words-wrapper'), 'is-loading');
            this.switchWord($word, nextWord);
            setTimeout(function () { self.hideWord(nextWord) }, self.barAnimationDelay);
            setTimeout(function () { addClassMultiple(parents($word, '.cd-words-wrapper'), 'is-loading') }, self.barWaiting);

        } else {
            this.switchWord($word, nextWord);
            setTimeout(function () { self.hideWord(nextWord) }, self.animationDelay);
        }
    }

    AnimatedHeadline.prototype.showWord = function ($word, $duration) {
        var self = this;
        if (listHasClass(parents($word, '.cd-headline'), 'type')) {
            this.showLetter($word.querySelectorAll('i')[0], $word, false, $duration);
            $word.classList.add('is-visible')
            $word.classList.remove('is-hidden');

        } else if (listHasClass(parents($word, '.cd-headline'), 'clip')) {
            var wrapper = parents($word, '.cd-words-wrapper');
            for (var i = 0; i < wrapper.length; i++) {
                var element = wrapper[i];
                var initWidth = parseFloat(getComputedStyle(element, null).width.replace("px", ""));
                Util.setWidth(initWidth, (initWidth + 10), element, self.revealDuration, function () {
                    setTimeout(function () { self.hideWord($word) }, self.revealAnimationDelay);
                });
            }
        }
    }

    AnimatedHeadline.prototype.hideLetter = function ($letter, $word, $bool, $duration) {
        var self = this;
        $letter.classList.remove('in');
        $letter.classList.remove('last');
        $letter.classList.add('out');
        if (!matches($letter, ':last-child')) {
            var nextLetter = $letter.nextElementSibling;
            nextLetter.classList.add('last');
        }

        if (!matches($letter, ':last-child')) {
            setTimeout(function () { self.hideLetter($letter.nextElementSibling, $word, $bool, $duration); }, $duration);
        } else if ($bool) {
            setTimeout(function () { self.hideWord(self.takeNext($word)) }, self.animationDelay);
        }

        if (matches($letter, ':last-child') && listHasClass(document.querySelectorAll('html'), 'no-csstransitions')) {
            var nextWord = self.takeNext($word);
            self.switchWord($word, nextWord);
        }
    }

    AnimatedHeadline.prototype.showLetter = function ($letter, $word, $bool, $duration) {
        var self = this;
        $letter.classList.add('in');
        $letter.classList.add('last');
        if (!matches($letter, ':first-child')) {
            var prevLetter = $letter.previousElementSibling;
            prevLetter.classList.remove('last');
        }
        $letter.classList.remove('out');

        if (!matches($letter,':last-child')) {
            setTimeout(function () { self.showLetter($letter.nextElementSibling, $word, $bool, $duration); }, $duration);
        } else {
            if (listHasClass(parents($word, '.cd-headline'), 'type')) { setTimeout(function () { addClassMultiple(parents($word, '.cd-words-wrapper'), 'waiting'); }, 200); }
            if (!$bool) { setTimeout(function () { self.hideWord($word) }, self.animationDelay) }
        }
    }

    AnimatedHeadline.prototype.takeNext = function ($word) {
        return (!matches($word, ':last-child')) ? $word.nextElementSibling : $word.parentNode.children[0];
    }

    AnimatedHeadline.prototype.takePrev = function ($word) {
        return (!matches($word, ':first-child') ? $word.previousElementSibling : $word.parentNode.children[$word.parentNode.length - 1])
    }

    AnimatedHeadline.prototype.switchWord = function ($oldWord, $newWord) {
        $oldWord.classList.remove('is-visible');
        $oldWord.classList.add('is-hidden');
        $newWord.classList.remove('is-hidden');
        $newWord.classList.add('is-visible');
    }

    var animatedHeadlines = document.getElementsByClassName('cd-headline');
    if (animatedHeadlines.length > 0) {
        for (var i = 0; i < animatedHeadlines.length; i++) {
            (function (i) { new AnimatedHeadline(animatedHeadlines[i]); })(i);
        }
    }
}());
// File#: _1_back-to-top
// Usage: codyhouse.co/license
(function () {
    var backTop = document.getElementsByClassName('js-back-to-top')[0];
    if (backTop) {
        var scrollDuration = parseInt(backTop.getAttribute('data-duration')) || 300, //scroll to top duration
            scrollOffset = parseInt(backTop.getAttribute('data-offset')) || 0, //show back-to-top if scrolling > scrollOffset
            scrolling = false;

        //detect click on back-to-top link
        backTop.addEventListener('click', function (event) {
            event.preventDefault();
            window.location.hash = '';
            (!window.requestAnimationFrame) ? window.scrollTo(0, 0) : Util.scrollTo(0, scrollDuration);
            //move the focus to the #top-element - don't break keyboard navigation
            Util.moveFocus(document.getElementById(backTop.getAttribute('href').replace('#', '')));
        });

        //listen to the window scroll and update back-to-top visibility
        checkBackToTop();
        if (scrollOffset > 0) {
            window.addEventListener("scroll", function (event) {
                if (!scrolling) {
                    scrolling = true;
                    (!window.requestAnimationFrame) ? setTimeout(function () { checkBackToTop(); }, 250) : window.requestAnimationFrame(checkBackToTop);
                }
            });
        }

        function checkBackToTop() {
            var windowTop = window.scrollY || document.documentElement.scrollTop;
            var nearBottom = (window.innerHeight + window.pageYOffset) >= (document.body.offsetHeight - 100);
            Util.toggleClass(backTop, 'back-to-top--is-visible', (windowTop >= scrollOffset && !nearBottom));
            scrolling = false;
        }
    }
}());
// File#: _1_btn-slide-fx
// Usage: codyhouse.co/license
(function () {
    var BtnSlideFx = function (element) {
        this.element = element;
        this.hover = false;
        btnSlideFxEvents(this);
    };

    function btnSlideFxEvents(btn) {
        btn.element.addEventListener('mouseenter', function (event) { // detect mouse hover
            btn.hover = true;
            triggerBtnSlideFxAnimation(btn.element, 'from');
        });
        btn.element.addEventListener('mouseleave', function (event) { // detect mouse leave
            btn.hover = false;
            triggerBtnSlideFxAnimation(btn.element, 'to');
        });
        btn.element.addEventListener('transitionend', function (event) { // reset btn classes at the end of enter/leave animation
            resetBtnSlideFxAnimation(btn.element);
        });
    };

    function getEnterDirection(element, event) { // return mouse movement direction
        var deltaLeft = Math.abs(element.getBoundingClientRect().left - event.clientX),
            deltaRight = Math.abs(element.getBoundingClientRect().right - event.clientX),
            deltaTop = Math.abs(element.getBoundingClientRect().top - event.clientY),
            deltaBottom = Math.abs(element.getBoundingClientRect().bottom - event.clientY);
        var deltaXDir = (deltaLeft < deltaRight) ? 'left' : 'right',
            deltaX = (deltaLeft < deltaRight) ? deltaLeft : deltaRight,
            deltaYDir = (deltaTop < deltaBottom) ? 'top' : 'bottom',
            deltaY = (deltaTop < deltaBottom) ? deltaTop : deltaBottom;
        return (deltaX < deltaY) ? deltaXDir : deltaYDir;
    };

    function triggerBtnSlideFxAnimation(element, direction) { // trigger animation -> apply in/out and direction classes
        var inStep = (direction == 'from') ? '-out' : '',
            outStep = (direction == 'from') ? '' : '-out';
        Util.removeClass(element, 'btn-slide-fx-hover' + inStep);
        resetBtnSlideFxAnimation(element);
        Util.addClass(element, 'btn--slide-fx-' + direction + '-' + getEnterDirection(element, event)); // set direction 
        setTimeout(function () { Util.addClass(element, 'btn-slide-fx-animate'); }, 5); // add transition
        setTimeout(function () { Util.addClass(element, 'btn-slide-fx-hover' + outStep); }, 10); // trigger transition
    };

    function resetBtnSlideFxAnimation(element) { // remove animation classes
        Util.removeClass(element, 'btn--slide-fx-from-left btn--slide-fx-from-right btn--slide-fx-from-bottom btn--slide-fx-from-top btn--slide-fx-to-left btn--slide-fx-to-right btn--slide-fx-to-bottom btn--slide-fx-to-top btn-slide-fx-animate');
    };

    //initialize the BtnSlideFx objects
    var btnSlideFx = document.getElementsByClassName('js-btn--slide-fx');
    if (btnSlideFx.length > 0) {
        for (var i = 0; i < btnSlideFx.length; i++) {
            (function (i) { new BtnSlideFx(btnSlideFx[i]); })(i);
        }
    }
}());
// File#: _1_contact
/*
	⚠️ Make sure to include the Google Maps API. 
	You can include the script right after the contact.js (before the body closing tag in the index.html file):
	<script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initGoogleMap"></script> 
*/
function initGoogleMap() {
	var contactMap = document.getElementsByClassName('js-contact__map');
	if(contactMap.length > 0) {
		for(var i = 0; i < contactMap.length; i++) {
			initContactMap(contactMap[i]);
		}
	}
};

function initContactMap(wrapper) {
	var coordinate = wrapper.getAttribute('data-coordinates').split(',');
	var map = new google.maps.Map(wrapper, {zoom: 10, center: {lat: Number(coordinate[0]), lng:  Number(coordinate[1])}});
	var marker = new google.maps.Marker({position: {lat: Number(coordinate[0]), lng:  Number(coordinate[1])}, map: map});
};
// File#: _1_main-header
(function() {
	var mainHeader = document.getElementsByClassName('js-main-header')[0];
	if( mainHeader ) {
		var trigger = mainHeader.getElementsByClassName('js-main-header__nav-trigger')[0],
			nav = mainHeader.getElementsByClassName('js-main-header__nav')[0];
		//detect click on nav trigger
		trigger.addEventListener("click", function(event) {
			event.preventDefault();
			var ariaExpanded = !Util.hasClass(nav, 'main-header__nav--is-visible');
			//show nav and update button aria value
			Util.toggleClass(nav, 'main-header__nav--is-visible', ariaExpanded);
			trigger.setAttribute('aria-expanded', ariaExpanded);
			if(ariaExpanded) { //opening menu -> move focus to first element inside nav
				nav.querySelectorAll('[href], input:not([disabled]), button:not([disabled])')[0].focus();
			}
		});
	}
}());
// File#: _1_progress-bar
// Usage: codyhouse.co/license
(function () {
    var ProgressBar = function (element) {
        this.element = element;
        this.fill = this.element.getElementsByClassName('progress-bar__fill')[0];
        this.label = this.element.getElementsByClassName('progress-bar__value');
        this.value = getProgressBarValue(this);
        // before checking if data-animation is set -> check for reduced motion
        updatedProgressBarForReducedMotion(this);
        this.animate = this.element.hasAttribute('data-animation') && this.element.getAttribute('data-animation') == 'on';
        this.animationDuration = this.element.hasAttribute('data-duration') ? this.element.getAttribute('data-duration') : 1000;
        // animation will run only on browsers supporting IntersectionObserver
        this.canAnimate = ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype);
        // this element is used to announce the percentage value to SR
        this.ariaLabel = this.element.getElementsByClassName('js-progress-bar__aria-value');
        // check if we need to update the bar color
        this.changeColor = Util.hasClass(this.element, 'progress-bar--color-update') && Util.cssSupports('color', 'var(--color-value)');
        if (this.changeColor) {
            this.colorThresholds = getProgressBarColorThresholds(this);
        }
        initProgressBar(this);
        // store id to reset animation
        this.animationId = false;
    };

    function getProgressBarValue(progressBar) { // get progress value
        // return (fill width/total width) * 100
        return parseInt(progressBar.fill.offsetWidth * 100 / progressBar.element.getElementsByClassName('progress-bar__bg')[0].offsetWidth);
    };

    function getProgressBarColorThresholds(progressBar) {
        var thresholds = [];
        var i = 1;
        while (!isNaN(parseInt(getComputedStyle(progressBar.element).getPropertyValue('--progress-bar-color-' + i)))) {
            thresholds.push(parseInt(getComputedStyle(progressBar.element).getPropertyValue('--progress-bar-color-' + i)));
            i = i + 1;
        }
        return thresholds;
    };

    function updatedProgressBarForReducedMotion(progressBar) {
        // if reduced motion is supported and set to reduced -> remove animations
        if (osHasReducedMotion) progressBar.element.removeAttribute('data-animation');
    };

    function initProgressBar(progressBar) {
        // set initial bar color
        if (progressBar.changeColor) updateProgressBarColor(progressBar, progressBar.value);
        // if data-animation is on -> reset the progress bar and animate when entering the viewport
        if (progressBar.animate && progressBar.canAnimate) animateProgressBar(progressBar);
        // reveal fill and label -> --animate and --color-update variations only
        setTimeout(function () { Util.addClass(progressBar.element, 'progress-bar--init'); }, 30);

        // dynamically update value of progress bar
        progressBar.element.addEventListener('updateProgress', function (event) {
            // cancel request animation frame if it was animating
            if (progressBar.animationId) window.cancelAnimationFrame(progressBar.animationId);

            var final = event.detail.value,
                duration = (event.detail.duration) ? event.detail.duration : progressBar.animationDuration;
            var start = getProgressBarValue(progressBar);
            // trigger update animation
            updateProgressBar(progressBar, start, final, duration, function () {
                emitProgressBarEvents(progressBar, 'progressCompleted', progressBar.value + '%');
                // update value of label for SR
                if (progressBar.ariaLabel.length > 0) progressBar.ariaLabel[0].textContent = final + '%';
            });
        });
    };

    function animateProgressBar(progressBar) {
        // reset inital values
        setProgressBarValue(progressBar, 0);

        // listen for the element to enter the viewport -> start animation
        var observer = new IntersectionObserver(progressBarObserve.bind(progressBar), { threshold: [0, 0.1] });
        observer.observe(progressBar.element);
    };

    function progressBarObserve(entries, observer) { // observe progressBar position -> start animation when inside viewport
        var self = this;
        if (entries[0].intersectionRatio.toFixed(1) > 0 && !this.animationTriggered) {
            updateProgressBar(this, 0, this.value, this.animationDuration, function () {
                emitProgressBarEvents(self, 'progressCompleted', self.value + '%');
            });
        }
    };

    function updateProgressBar(progressBar, start, to, duration, cb) {
        var change = to - start,
            currentTime = null;

        var animateFill = function (timestamp) {
            if (!currentTime) currentTime = timestamp;
            var progress = timestamp - currentTime;
            var val = parseInt((progress / duration) * change + start);
            // make sure value is in correct range
            if (change > 0 && val > to) val = to;
            if (change < 0 && val < to) val = to;

            setProgressBarValue(progressBar, val);
            if (progress < duration) {
                progressBar.animationId = window.requestAnimationFrame(animateFill);
            } else {
                progressBar.animationId = false;
                cb();
            }
        };
        if (window.requestAnimationFrame && !osHasReducedMotion) {
            progressBar.animationId = window.requestAnimationFrame(animateFill);
        } else {
            setProgressBarValue(progressBar, to);
            cb();
        }
    };

    function setProgressBarValue(progressBar, value) {
        progressBar.fill.style.width = value + '%';
        if (progressBar.label.length > 0) progressBar.label[0].textContent = value + '%';
        if (progressBar.changeColor) updateProgressBarColor(progressBar, value);
    };

    function updateProgressBarColor(progressBar, value) {
        var className = 'progress-bar--fill-color-' + progressBar.colorThresholds.length;
        for (var i = progressBar.colorThresholds.length; i > 0; i--) {
            if (!isNaN(progressBar.colorThresholds[i - 1]) && value <= progressBar.colorThresholds[i - 1]) {
                className = 'progress-bar--fill-color-' + i;
            }
        }

        removeProgressBarColorClasses(progressBar);
        Util.addClass(progressBar.element, className);
    };

    function removeProgressBarColorClasses(progressBar) {
        var classes = progressBar.element.className.split(" ").filter(function (c) {
            return c.lastIndexOf('progress-bar--fill-color-', 0) !== 0;
        });
        progressBar.element.className = classes.join(" ").trim();
    };

    function emitProgressBarEvents(progressBar, eventName, detail) {
        progressBar.element.dispatchEvent(new CustomEvent(eventName, { detail: detail }));
    };

    window.ProgressBar = ProgressBar;

    //initialize the ProgressBar objects
    var progressBars = document.getElementsByClassName('js-progress-bar');
    var osHasReducedMotion = Util.osHasReducedMotion();
    if (progressBars.length > 0) {
        for (var i = 0; i < progressBars.length; i++) {
            (function (i) { new ProgressBar(progressBars[i]); })(i);
        }
    }
}());
// File#: _1_reading-progressbar
(function() {
	var readingIndicator = document.getElementsByClassName('js-reading-progressbar')[0],
		readingIndicatorContent = document.getElementsByClassName('js-reading-content')[0];
	
	if( readingIndicator && readingIndicatorContent) {
		var progressInfo = [],
			progressEvent = false,
			progressFallback = readingIndicator.getElementsByClassName('js-reading-progressbar__fallback')[0],
			progressIsSupported = 'value' in readingIndicator;

		progressInfo['height'] = readingIndicatorContent.offsetHeight;
		progressInfo['top'] = readingIndicatorContent.getBoundingClientRect().top;
		progressInfo['window'] = window.innerHeight;
		progressInfo['class'] = 'reading-progressbar--is-active';
		
		//init indicator
		setProgressIndicator();
		//listen to the window scroll event - update progress
		window.addEventListener('scroll', function(event){
			if(progressEvent) return;
			progressEvent = true;
			(!window.requestAnimationFrame) ? setTimeout(function(){setProgressIndicator();}, 250) : window.requestAnimationFrame(setProgressIndicator);
		});
		// listen to window resize - update progress
		window.addEventListener('resize', function(event){
			if(progressEvent) return;
			progressEvent = true;
			(!window.requestAnimationFrame) ? setTimeout(function(){resetProgressIndicator();}, 250) : window.requestAnimationFrame(resetProgressIndicator);
		});

		function setProgressIndicator() {
			progressInfo['top'] = readingIndicatorContent.getBoundingClientRect().top;
			if(progressInfo['height'] <= progressInfo['window']) {
				// short content - hide progress indicator
				Util.removeClass(readingIndicator, progressInfo['class']);
				progressEvent = false;
				return;
			}
			// get new progress and update element
			Util.addClass(readingIndicator, progressInfo['class']);
			var value = (progressInfo['top'] >= 0) ? 0 : 100*(0 - progressInfo['top'])/(progressInfo['height'] - progressInfo['window']);
			readingIndicator.setAttribute('value', value);
			if(!progressIsSupported && progressFallback) progressFallback.style.width = value+'%';
			progressEvent = false;
		};

		function resetProgressIndicator() {
			progressInfo['height'] = readingIndicatorContent.offsetHeight;
			progressInfo['window'] = window.innerHeight;
			setProgressIndicator();
		};
	}
}());
// File#: _1_reveal-effects
// Usage: codyhouse.co/license
(function () {
    var fxElements = document.getElementsByClassName('reveal-fx');
    if (fxElements.length > 0) {
        // deactivate effect if Reduced Motion is enabled
        if (Util.osHasReducedMotion()) {
            fxRemoveClasses();
            return;
        }
        //on small devices, do not animate elements -> reveal all
        if (fxDisabled(fxElements[0])) {
            fxRevealAll();
            return;
        }

        var viewportHeight = window.innerHeight,
            fxChecking = false,
            fxRevealedItems = [],
            fxElementDelays = fxGetDelays(); //elements animation delay

        var fxRevealDelta = 200; // amount (in pixel) the element needs to enter the viewport to be revealed

        // add event listeners
        window.addEventListener('load', fxReveal);
        window.addEventListener('scroll', fxScroll);
        window.addEventListener('resize', fxResize);

        function fxRevealAll() { // reveal all elements - small devices
            for (var i = 0; i < fxElements.length; i++) {
                Util.addClass(fxElements[i], 'reveal-fx--is-visible');
            }
        };

        function fxScroll() { // on scroll - reveal visible elements
            if (fxChecking) return;
            fxChecking = true;
            (!window.requestAnimationFrame) ? setTimeout(function () { fxReveal(); }, 250) : window.requestAnimationFrame(fxReveal);
        };

        function fxResize() { // on resize - check new window height and reveal visible elements
            if (fxChecking) return;
            fxChecking = true;
            (!window.requestAnimationFrame) ? setTimeout(function () { fxReset(); }, 250) : window.requestAnimationFrame(fxReset);
        };

        function fxReset() {
            viewportHeight = window.innerHeight;
            fxReveal();
        };

        function fxReveal() { // reveal visible elements
            for (var i = 0; i < fxElements.length; i++) {
                (function (i) {
                    if (fxRevealedItems.indexOf(i) != -1) return; //element has already been revelead
                    if (fxElementIsVisible(fxElements[i])) {
                        fxRevealItem(i);
                        fxRevealedItems.push(i);
                    }
                })(i);
            }
            fxResetEvents();
            fxChecking = false;
        };

        function fxRevealItem(index) {
            if (fxElementDelays[index] && fxElementDelays[index] != 0) {
                // wait before revealing element if a delay was added
                setTimeout(function () {
                    Util.addClass(fxElements[index], 'reveal-fx--is-visible');
                }, fxElementDelays[index]);
            } else {
                Util.addClass(fxElements[index], 'reveal-fx--is-visible');
            }
        };

        function fxGetDelays() { // get anmation delays
            var delays = [];
            for (var i = 0; i < fxElements.length; i++) {
                delays.push(fxElements[i].getAttribute('data-reveal-fx-delay') ? parseInt(fxElements[i].getAttribute('data-reveal-fx-delay')) : 0);
            }
            return delays;
        };

        function fxDisabled(element) { // check if elements need to be animated - no animation on small devices
            return !(window.getComputedStyle(element, '::before').getPropertyValue('content').replace(/'|"/g, "") == 'reveal-fx');
        };

        function fxElementIsVisible(element) { // element is inside viewport
            return (fxGetElementPosition(element) <= viewportHeight - fxRevealDelta);
        };

        function fxGetElementPosition(element) { // get top position of element
            return element.getBoundingClientRect().top;
        };

        function fxResetEvents() {
            if (fxElements.length > fxRevealedItems.length) return;
            // remove event listeners if all elements have been revealed
            window.removeEventListener('load', fxReveal);
            window.removeEventListener('scroll', fxScroll);
            window.removeEventListener('resize', fxResize);
        };

        function fxRemoveClasses() {
            // Reduced Motion on
            while (fxElements[0]) {
                // remove all classes starting with 'reveal-fx--'
                var classes = fxElements[0].className.split(" ").filter(function (c) {
                    return c.lastIndexOf('reveal-fx--', 0) !== 0;
                });
                fxElements[0].className = classes.join(" ").trim();
                Util.removeClass(fxElements[0], 'reveal-fx');
            }
        };
    }
}());
// File#: _1_smooth-scrolling
// Usage: codyhouse.co/license
(function () {
    var SmoothScroll = function (element) {
        this.element = element;
        this.scrollDuration = parseInt(this.element.getAttribute('data-duration')) || 300;
        this.initScroll();
    };

    SmoothScroll.prototype.initScroll = function () {
        var self = this;

        //detect click on link
        this.element.addEventListener('click', function (event) {
            event.preventDefault();
            var targetId = event.target.getAttribute('href').replace('#', ''),
                target = document.getElementById(targetId),
                targetTabIndex = target.getAttribute('tabindex'),
                windowScrollTop = window.scrollY || document.documentElement.scrollTop;

            Util.scrollTo(target.getBoundingClientRect().top + windowScrollTop, self.scrollDuration, function () {
                //move the focus to the target element - don't break keyboard navigation
                Util.moveFocus(target);
                window.location.hash = targetId;
                self.resetTarget(target, targetTabIndex);
            });
        });
    };

    SmoothScroll.prototype.resetTarget = function (target, tabindex) {
        if (parseInt(target.getAttribute('tabindex')) < 0) {
            target.style.outline = 'none';
            !tabindex && target.removeAttribute('tabindex');
        }
    };

    //initialize the Smooth Scroll objects
    var smoothScrollLinks = document.getElementsByClassName('js-smooth-scroll');
    if (smoothScrollLinks.length > 0 && !Util.cssSupports('scroll-behavior', 'smooth') && window.requestAnimationFrame) {
        // you need javascript only if css scroll-behavior is not supported
        for (var i = 0; i < smoothScrollLinks.length; i++) {
            (function (i) { new SmoothScroll(smoothScrollLinks[i]); })(i);
        }
    }
}());
// File#: _1_sticky-hero
(function() {
	var StickyBackground = function(element) {
		this.element = element;
		this.scrollingElement = this.element.getElementsByClassName('sticky-hero__content')[0];
		this.nextElement = this.element.nextElementSibling;
		this.scrollingTreshold = 0;
		this.nextTreshold = 0;
		initStickyEffect(this);
	};

	function initStickyEffect(element) {
		var observer = new IntersectionObserver(stickyCallback.bind(element), { threshold: [0, 0.1, 1] });
		observer.observe(element.scrollingElement);
		if(element.nextElement) observer.observe(element.nextElement);
	};

	function stickyCallback(entries, observer) {
		var threshold = entries[0].intersectionRatio.toFixed(1);
		(entries[0].target ==  this.scrollingElement)
			? this.scrollingTreshold = threshold
			: this.nextTreshold = threshold;

		Util.toggleClass(this.element, 'sticky-hero--media-is-fixed', (this.nextTreshold > 0 || this.scrollingTreshold > 0));
	};


	var stickyBackground = document.getElementsByClassName('js-sticky-hero'),
		intersectionObserverSupported = ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype);
	if(stickyBackground.length > 0 && intersectionObserverSupported) { // if IntersectionObserver is not supported, animations won't be triggeres
		for(var i = 0; i < stickyBackground.length; i++) {
			(function(i){ // if animations are enabled -> init the StickyBackground object
        if( Util.hasClass(stickyBackground[i], 'sticky-hero--overlay-layer') || Util.hasClass(stickyBackground[i], 'sticky-hero--scale')) new StickyBackground(stickyBackground[i]);
      })(i);
		}
	}
}());
// var themeStore = window.localStorage;

// window.addEventListener('load', function(event) {
//     var isDark = themeStore.getItem('dark');
//     if (isDark) {
//         document.getElementById('themeSwitch').checked = true;
//     }
// })



document.getElementById('themeSwitch').addEventListener('change', function (event) {
    (event.target.checked) ? document.body.setAttribute('data-theme', 'dark') : document.body.removeAttribute('data-theme');
});
// File#: _2_flexi-header
// Usage: codyhouse.co/license
(function () {
    var flexHeader = document.getElementsByClassName('js-f-header');
    if (flexHeader.length > 0) {
        var menuTrigger = flexHeader[0].getElementsByClassName('js-anim-menu-btn')[0],
            firstFocusableElement = getMenuFirstFocusable();

        // we'll use these to store the node that needs to receive focus when the mobile menu is closed 
        var focusMenu = false;

        menuTrigger.addEventListener('anim-menu-btn-clicked', function (event) { // toggle menu visibility an small devices
            Util.toggleClass(document.getElementsByClassName('f-header__nav')[0], 'f-header__nav--is-visible', event.detail);
            menuTrigger.setAttribute('aria-expanded', event.detail);
            if (event.detail) firstFocusableElement.focus(); // move focus to first focusable element
            else if (focusMenu) {
                focusMenu.focus();
                focusMenu = false;
            }
        });

        // listen for key events
        window.addEventListener('keyup', function (event) {
            // listen for esc key
            if ((event.keyCode && event.keyCode == 27) || (event.key && event.key.toLowerCase() == 'escape')) {
                // close navigation on mobile if open
                if (menuTrigger.getAttribute('aria-expanded') == 'true' && isVisible(menuTrigger)) {
                    focusMenu = menuTrigger; // move focus to menu trigger when menu is close
                    menuTrigger.click();
                }
            }
            // listen for tab key
            if ((event.keyCode && event.keyCode == 9) || (event.key && event.key.toLowerCase() == 'tab')) {
                // close navigation on mobile if open when nav loses focus
                if (menuTrigger.getAttribute('aria-expanded') == 'true' && isVisible(menuTrigger) && !document.activeElement.closest('.js-f-header')) menuTrigger.click();
            }
        });

        function getMenuFirstFocusable() {
            var focusableEle = flexHeader[0].getElementsByClassName('f-header__nav')[0].querySelectorAll('[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary'),
                firstFocusable = false;
            for (var i = 0; i < focusableEle.length; i++) {
                if (focusableEle[i].offsetWidth || focusableEle[i].offsetHeight || focusableEle[i].getClientRects().length) {
                    firstFocusable = focusableEle[i];
                    break;
                }
            }

            return firstFocusable;
        };

        function isVisible(element) {
            return (element.offsetWidth || element.offsetHeight || element.getClientRects().length);
        };
    }
}());
// File#: _2_pricing-table
(function() {
	// NOTE: you need the js code only when using the --has-switch variation of the pricing table
	// default version does not require js
	var pTable = document.getElementsByClassName('js-p-table--has-switch');
	if(pTable.length > 0) {
		for(var i = 0; i < pTable.length; i++) {
			(function(i){ addPTableEvent(pTable[i]);})(i);
		}

		function addPTableEvent(element) {
			var pSwitch = element.getElementsByClassName('js-p-table__switch')[0];
			if(pSwitch) {
				pSwitch.addEventListener('change', function(event) {
          Util.toggleClass(element, 'p-table--yearly', (event.target.value == 'yearly'));
				});
			}
		}
	}
}());