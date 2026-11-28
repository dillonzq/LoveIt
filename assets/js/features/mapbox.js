import { forEach } from '../util.js';

// Mapbox GL maps; switching the theme switches each map to its light or dark style.
export default function initMapbox(theme) {
    // Mapbox GL JS v3 requires WebGL 2; skip the maps instead of throwing.
    if (!mapboxgl.supported()) {
        console.warn('Mapbox GL JS is not supported by this browser (WebGL 2 is required).');
        return;
    }
    mapboxgl.accessToken = theme.config.mapbox.accessToken;
    const maps = [];
    forEach(document.getElementsByClassName('mapbox'), $mapbox => {
        const { lng, lat, zoom, lightStyle, darkStyle, marked, navigation, geolocate, scale, fullscreen } = theme.data[$mapbox.id];
        const mapbox = new mapboxgl.Map({
            container: $mapbox,
            center: [lng, lat],
            zoom: zoom,
            minZoom: .2,
            style: theme.isDark ? darkStyle : lightStyle,
            attributionControl: false,
        });
        if (marked) {
            new mapboxgl.Marker().setLngLat([lng, lat]).addTo(mapbox);
        }
        if (navigation) {
            mapbox.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
        }
        if (geolocate) {
            mapbox.addControl(new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true,
                },
                showUserLocation: true,
                trackUserLocation: true,
            }), 'bottom-right');
        }
        if (scale) {
            mapbox.addControl(new mapboxgl.ScaleControl());
        }
        if (fullscreen) {
            mapbox.addControl(new mapboxgl.FullscreenControl());
        }
        mapbox.addControl(new MapboxLanguage());
        maps.push(mapbox);
    });
    theme.switchThemeEventSet.add(() => {
        for (const mapbox of maps) {
            const { lightStyle, darkStyle } = theme.data[mapbox.getContainer().id];
            mapbox.setStyle(theme.isDark ? darkStyle : lightStyle);
            mapbox.addControl(new MapboxLanguage());
        }
    });
}
