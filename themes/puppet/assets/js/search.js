// https://stackoverflow.com/questions/1912501/unescape-html-entities-in-javascript
function htmlDecode(input) {
  var e = document.createElement('textarea');
  e.innerHTML = input;
  // handle case of empty input
  return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

SimpleJekyllSearch({
  searchInput: document.getElementById('search-input'),
  resultsContainer: document.getElementById('search-results'),
  json: '{{ "index.json" | relURL }}',
  searchResultTemplate: '<div class="post-preview item"><a href="{url}"><h2 class="post-title">{title}</h2><h3 class="post-subtitle">{subtitle}</h3><hr></a></div>',
  noResultsText: 'No results',
  limit: 50,
  fuzzy: false,
  // a hack to get escaped subtitle unescaped. for some reason, 
  // post.subtitle w/o escape filter nuke entire search.
  templateMiddleware: function (prop, value, template) {
      if (prop === 'subtitle' || prop === 'title') {
          if (value.indexOf("code")) {
              return htmlDecode(value);
          } else {
              return value;
          }
      }
  }
});

$(document).ready(function () {
  var $searchPage = $('.search-page');
  var $searchOpen = $('.search-icon');
  var $searchClose = $('.search-icon-close');
  var $searchInput = $('#search-input');
  var $body = $('body');

  $searchOpen.on('click', function (e) {
      e.preventDefault();
      $searchPage.toggleClass('search-active');
      var prevClasses = $body.attr('class') || '';
      setTimeout(function () {
          $body.addClass('no-scroll');
      }, 400)

      if ($searchPage.hasClass('search-active')) {
          $searchClose.on('click', function (e) {
              e.preventDefault();
              $searchPage.removeClass('search-active');
              $body.attr('class', prevClasses);  // from closure 
          });
          $searchInput.focus();
      }
  });
});