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