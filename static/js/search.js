document.addEventListener('DOMContentLoaded', async () => {
  const searchButton = document.querySelector('#searchBoxButton')
  const searchInput = document.querySelector('#searchBoxInput')
  const searchResult = document.querySelector('#searchResult')
  const searchCount = document.querySelector('#searchCount')

  function parseLocationSearch() {
    let locationSearch = location.search
    let result = {}
    if (locationSearch == '') {
      return result
    }
    locationSearch = locationSearch.substr(1)
    for (let kv of locationSearch.split('&')) {
      if (kv == '') {
        continue
      }
      const [k, v] = kv.split('=')
      result[k] = decodeURI(v)
    }
    return result
  }

  var fuseOptions = {
    shouldSort: true,
    includeMatches: true,
    threshold: 0.0,
    tokenize: true,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [{
        name: "title",
        weight: 0.8
      },
      {
        name: "summary",
        weight: 0.5
      },
      {
        name: "contents",
        weight: 0.5
      },
      {
        name: "tags",
        weight: 0.3
      },
      {
        name: "categories",
        weight: 0.3
      },
      {
        name: "date",
        weight: 0.3
      },
    ]
  };

  let fuse = null

  async function getFuse() {
    if (fuse == null) {
      const resp = await fetch('/index.json', {
        method: 'get'
      })
      const indexData = await resp.json()
      console.log(indexData.length)
      fuse = new Fuse(indexData, fuseOptions);
    }
    return fuse
  }

  function render(items) {
    return items.map(item => {
      item = item.item
      return `<li class="post-item">
        <a href="${item.permalink}">
          <span class="post-title">${item.title}</span>
          <span
            class="post-day">${item.date}</span>
        </a>
      </li>`}).join('')
  }

  function updateDOM(html, number) {
    searchResult.innerHTML = html
    searchCount.innerHTML = `共有查询到${number}篇文章`
  }

  async function search() {
    const searchString = searchInput.value
    const fuse = await getFuse()
    const result = fuse.search(searchString)
    const html = render(result)
    updateDOM(html, result.length)
  }

  function doSearch() {
    const wd = parseLocationSearch()['wd'] || ''
    searchInput.value = wd
    if (wd) {
      search()
    }
  }

  function goSearch() {
    if (searchInput.value == parseLocationSearch()['wd']) {
      return
    }
    history.pushState('', '', location.pathname + '?wd=' + searchInput.value)
    searchInput.blur();
    doSearch()
  }

  searchButton.addEventListener('click', goSearch)
  searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      goSearch()
    }
  })

  doSearch()

  window.addEventListener('popstate', doSearch)

})