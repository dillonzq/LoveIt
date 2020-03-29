---
title: "Search Results"
sitemap:
  priority : 0.1
layout: "search"
---


This file exists solely to respond to /search URL with the related `search` layout template.

No content shown here is rendered, all content is based in the template layouts/page/search.html

Setting a very low sitemap priority will tell search engines this is not important content.

This implementation uses Fusejs, jquery and mark.js


## Initial setup

Search  depends on additional output content type of JSON in config.toml
\```
[outputs]
  home = ["HTML", "JSON"]
\```

## Searching additional fileds

To search additional fields defined in front matter, you must add it in 2 places.

### Edit layouts/_default/index.JSON
This exposes the values in /index.json
i.e. add `category`
\```
...
  "contents":{{ .Content | plainify | jsonify }}
  {{ if .Params.tags }},
  "tags":{{ .Params.tags | jsonify }}{{end}},
  "categories" : {{ .Params.categories | jsonify }},
...
\```

### Edit fuse.js options to Search
`static/js/search.js`
\```
keys: [
  "title",
  "contents",
  "tags",
  "categories"
]
\```


layouts/_default/search.html
This is the page rendered when viewing /search in your browser. THis example uses the template functionality of "base" and "blocks", to add my required JS files right above </body> but only on this page. You can use any template, as long as you include the 3rd part libs (jquery, fuse, mark.js) before search.js, it will work.

{{ define "footerfiles" }}
<script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/fuse.js/3.2.0/fuse.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/mark.js/8.11.1/jquery.mark.min.js"></script>
<script src="{{ "js/search.js" | absURL }}"></script>
{{ end }}
{{ define "main" }}
<section class="resume-section p-3 p-lg-5 d-flex flex-column">
  <div class="my-auto" >
    <form action="{{ "search" | absURL }}">
      <input id="search-query" name="s"/>
    </form>
    <div id="search-results">
     <h3>Matching pages</h3>
    </div>
  </div>
</section>
<!-- this template is sucked in by search.js and appended to the search-results div above. So editing here will adjust style -->
<script id="search-result-template" type="text/x-js-template">
    <div id="summary-${key}">
      <h4><a href="${link}">${title}</a></h4>
      <p>${snippet}</p>
      ${ isset tags }<p>Tags: ${tags}</p>${ end }
      ${ isset categories }<p>Categories: ${categories}</p>${ end }
    </div>
</script>
{{ end }}
