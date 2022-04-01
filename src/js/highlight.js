if (!hljs.initHighlighting.called) {
  hljs.initHighlighting.called = true;
  [].slice.call(document.querySelectorAll('pre.highlight > code')).forEach(function (el) {
    hljs.highlightBlock(el)
  })
}
