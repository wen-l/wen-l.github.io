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