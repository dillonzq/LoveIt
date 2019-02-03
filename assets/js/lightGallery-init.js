 $(document).ready(function() {
     let items = [];
     $('.post-content figure').each(function() {
         if ($(this).attr('class') == 'gallery-ignore') return true; // ignore any figures where class="pswp-ignore"
         // get properties from child a/img/figcaption elements,
         let $figure = $(this),
             $img = $figure.find('img'),
             $src = $img.attr('data-src'),
             $title = $figure.find('figcaption').html();

         if ($img.data('size')) {
			let $size 	= $a.data('size').split('x');
			var item = {
             'src': $src,
             'thumb': $src,
             'subHtml': $title,
             'width': $size[0],
             'height': $size[1]
         }
         }else{
 			var item = {
             'src': $src,
             'thumb': $src,
             'subHtml': $title
         	}	
         	var img = new Image(); 
			img.src = $src;
			var wait = setInterval(function() {
				var w = img.naturalWidth,
					h = img.naturalHeight;
				if (w && h) {
					clearInterval(wait);
					item.width = w;
					item.height = h;
				}
			}, 30);
         }    
        
         var index = items.length;
         items.push(item);
        // console.log(item)

         $figure.on('click', function(event) {
             event.preventDefault(); 
             $(this).lightGallery({
                 dynamic: true,
                 download: false,
                 showThumbByDefault: false,
                 dynamicEl: items,
                 index: index
             })
         });
     });
 });