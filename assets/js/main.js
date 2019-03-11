jQuery(function($) {

    'use strict';

    var _Blog = window._Blog || {};

    _Blog.prettify = function() {
        $('pre').addClass('prettyprint linenums').attr('style', 'overflow:auto;');
        window.prettyPrint && prettyPrint();
    };

    _Blog.externalUrl = function() {
        $.expr[':'].external = function(obj) {
            return !obj.href.match(/^mailto\:/) &&
                (obj.hostname != location.hostname);
        };
        $('a:external').addClass('external');
        $(".external").attr('target', '_blank');

    }

    _Blog.changeTitle = function() {
        var currentTitle = document.title;
        window.onblur = function() {
            document.title = currentTitle;
        }
        window.onfocus = function() {
            document.title = currentTitle;
        }
    };

    _Blog.toggleTheme = function() {
        const currentTheme = window.localStorage && window.localStorage.getItem('theme')
        const isDark = currentTheme === 'dark'
        $('body').toggleClass('dark-theme', isDark)
        $('.theme-switch').on('click', () => {
            $('body').toggleClass('dark-theme')
            window.localStorage &&
                window.localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light', )
        })
    }

    _Blog.toggleMobileMenu = function() {
        $('.menu-toggle').on('click', () => {
            $('.menu-toggle').toggleClass('active')
            $('#mobile-menu').toggleClass('active')
        })
    }

    $(document).ready(function() {
        _Blog.prettify()
        _Blog.changeTitle()
        _Blog.toggleTheme()
        _Blog.toggleMobileMenu()
    });
});
