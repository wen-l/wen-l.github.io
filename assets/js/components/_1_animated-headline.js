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