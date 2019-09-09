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
            Util.toggleClass(backTop, 'back-to-top--is-visible', windowTop >= scrollOffset);
            scrolling = false;
        }
    }
}());