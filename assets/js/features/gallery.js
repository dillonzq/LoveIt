// lightGallery over the images of the content; the library is a classic script.
export default function initGallery() {
    lightGallery(document.getElementById('content'), {
        plugins: [lgThumbnail, lgZoom],
        selector: '.lightgallery',
        speed: 400,
        hideBarsDelay: 2000,
        allowMediaOverlap: true,
        exThumbImage: 'data-thumbnail',
        toggleThumb: true,
        thumbWidth: 80,
        thumbHeight: '60px',
        actualSize: false,
        showZoomInOutIcons: true,
        // lightGallery 3 hides the zoom buttons on touch devices; keep them as in v2.
        // mobileSettings replaces the defaults as a whole, so restate the others.
        mobileSettings: {
            controls: false,
            showCloseIcon: false,
            download: false,
            showGestureButtons: true,
        },
    });
}
