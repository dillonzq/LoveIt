var search = function () {

    var searchOptions = {
        shouldSort: true,
        tokenize: true,
        threshold: 0.1,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [
            "title",
            "content",
            "tag"
        ]
    };

    var searchResult = getElement("search-result", 'id'),
        searchInput = getElement("search-input", 'id'),
        searchInfo = getElement('search-info', 'id');

    var posts = [],
        fuse;

    if (!posts.length) {
        fetch('/index.json').then((res) => res.json()).then(response => { //获取内容
            posts = response;
            bindSearch();
        })
    } else {
        bindSearch();
    }

    function bindSearch() {
        fuse = new Fuse(posts, searchOptions); //初始化Fuse

        if (searchInput.value !== '') { // 以防用户在数据加载之前已经输入
            doSearch(searchInput.value);
        };

        searchInput.addEventListener('change', function (e) {
            var value = e.target.value;

            if (value == '') {
                return;
            };

            doSearch(value);
        });
    };

    function doSearch(keyword) {
        searchInfo.innerHTML = ''; //清空内容
        searchResult.innerHTML = '';

        var results = fuse.search(keyword);

        if (!results.length) {
            searchInfo.innerHTML = `Have not found any post related to keyword <strong>${keyword}</strong>`;
            return;
        } else {
            searchInfo.innerHTML = `Found ${results.length} posts related to keyword <strong>${keyword}</strong>`;
        }

        results.forEach(function (result, i) {
            var item = document.createElement('div');
            var html = `<article>
                        <header class="post-header">
                            <h2 class='post-title'>
                                <a href='${ result.url }'>
                                    ${ result.title }
                                </a>
                            </h2>
                        </header>
                        <section class="post-excerpt">
                            <p>${ result.content }</p>
                        </section>
                        <section class="post-meta">`;

            if (result.tag.length) {
                html += `<a href='/tag/${ encodeURIComponent(result.tag[0].toLocaleLowerCase()) }'>${result.tag[0]}</a>`;
            };

            html += `
                        <time class="post-date">
                                ${ result.date }
                            </time>
                        </section>
                    </article>
                `;
            item.innerHTML = html;

            searchResult.appendChild(item);
        });
    }
}