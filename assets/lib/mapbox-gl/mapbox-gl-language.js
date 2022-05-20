/**
 * Create a new [Mapbox GL JS plugin](https://www.mapbox.com/blog/build-mapbox-gl-js-plugins/) that
 * modifies the layers of the map style to use the `text-field` that matches the browser language.
 * As of Mapbox GL Language v1.0.0, this plugin no longer supports token values (e.g. `{name}`). v1.0+ expects the `text-field`
 * property of a style to use an [expression](https://docs.mapbox.com/mapbox-gl-js/style-spec/expressions/) of the form `['get', 'name_en']` or `['get', 'name']`; these expressions can be nested. Note that `get` expressions used as inputs to other expressions may not be handled by this plugin. For example:
 * ```
 * ["match",
 *   ["get", "name"],
 *   "California",
 *   "Golden State",
 *   ["coalesce",
 *     ["get", "name_en"],
 *     ["get", "name"]
 *   ]
 * ]
 * ```
 * Only styles based on [Mapbox v8 styles](https://docs.mapbox.com/help/troubleshooting/streets-v8-migration-guide/) are supported.
 *
 * @constructor
 * @param {object} options - Options to configure the plugin.
 * @param {string[]} [options.supportedLanguages] - List of supported languages
 * @param {Function} [options.languageTransform] - Custom style transformation to apply
 * @param {RegExp} [options.languageField=/^name_/] - RegExp to match if a text-field is a language field
 * @param {Function} [options.getLanguageField] - Given a language choose the field in the vector tiles
 * @param {string} [options.languageSource] - Name of the source that contains the different languages.
 * @param {string} [options.defaultLanguage] - Name of the default language to initialize style after loading.
 * @param {string[]} [options.excludedLayerIds] - Name of the layers that should be excluded from translation.
 */
 function MapboxLanguage(options) {
  options = Object.assign({}, options);
  if (!(this instanceof MapboxLanguage)) {
    throw new Error('MapboxLanguage needs to be called with the new keyword');
  }

  this.setLanguage = this.setLanguage.bind(this);
  this._initialStyleUpdate = this._initialStyleUpdate.bind(this);

  this._defaultLanguage = options.defaultLanguage;
  this._isLanguageField = options.languageField || /^name_/;
  this._getLanguageField = options.getLanguageField || function nameField(language) {
    return language === 'mul' ? 'name' : `name_${language}`;
  };
  this._languageSource = options.languageSource || null;
  this._languageTransform = options.languageTransform;
  this._excludedLayerIds = options.excludedLayerIds || [];
  this.supportedLanguages = options.supportedLanguages || ['ar', 'de', 'en', 'es', 'fr', 'it', 'ja', 'ko', 'mul', 'pt', 'ru', 'vi', 'zh-Hans', 'zh-Hant'];
}

const isTokenField = /^\{name/;
function isFlatExpressionField(isLangField, property) {
  const isGetExpression = Array.isArray(property) && property[0] === 'get';
  if (isGetExpression && isTokenField.test(property[1])) {
    console.warn('This plugin no longer supports the use of token syntax (e.g. {name}). Please use a get expression. See https://docs.mapbox.com/mapbox-gl-js/style-spec/expressions/ for more details.');
  }

  return isGetExpression && isLangField.test(property[1]);
}

function adaptNestedExpressionField(isLangField, property, languageFieldName) {
  if (Array.isArray(property)) {
    for (let i = 1; i < property.length; i++) {
      if (Array.isArray(property[i])) {
        if (isFlatExpressionField(isLangField, property[i])) {
          property[i][1] = languageFieldName;
        }
        adaptNestedExpressionField(isLangField, property[i], languageFieldName);
      }
    }
  }
}

function adaptPropertyLanguage(isLangField, property, languageFieldName) {
  if (isFlatExpressionField(isLangField, property)) {
    property[1] = languageFieldName;
  }

  adaptNestedExpressionField(isLangField, property, languageFieldName);

  // handle special case of bare ['get', 'name'] expression by wrapping it in a coalesce statement
  if (property[0] === 'get' && property[1] === 'name') {
    const defaultProp = property.slice();
    const adaptedProp = ['get', languageFieldName];
    property = ['coalesce', adaptedProp, defaultProp];
  }

  return property;
}

function changeLayerTextProperty(isLangField, layer, languageFieldName, excludedLayerIds) {
  if (layer.layout && layer.layout['text-field'] && excludedLayerIds.indexOf(layer.id) === -1) {
    return Object.assign({}, layer, {
      layout: Object.assign({}, layer.layout, {
        'text-field': adaptPropertyLanguage(isLangField, layer.layout['text-field'], languageFieldName)
      })
    });
  }
  return layer;
}

function findStreetsSource(style) {
  const sources = Object.keys(style.sources).filter((sourceName) => {
    const url = style.sources[sourceName].url;
    // the source URL can reference the source version or the style version
    // this check and the error forces users to migrate to styles using source version 8
    return url && url.indexOf('mapbox.mapbox-streets-v8') > -1 || /mapbox-streets-v[1-9][1-9]/.test(url);
  });
  if (!sources.length) throw new Error('If using MapboxLanguage with a Mapbox style, the style must be based on vector tile version 8, e.g. "streets-v11"');
  return sources[0];
}

/**
 * Explicitly change the language for a style.
 * @param {object} style - Mapbox GL style to modify
 * @param {string} language - The language iso code
 * @returns {object} the modified style
 */
MapboxLanguage.prototype.setLanguage = function (style, language) {
  if (this.supportedLanguages.indexOf(language) < 0) throw new Error(`Language ${  language  } is not supported`);
  const streetsSource = this._languageSource || findStreetsSource(style);
  if (!streetsSource) return style;

  const field = this._getLanguageField(language);
  const isLangField = this._isLanguageField;
  const excludedLayerIds = this._excludedLayerIds;
  const changedLayers = style.layers.map((layer) => {
    if (layer.source === streetsSource) return changeLayerTextProperty(isLangField, layer, field, excludedLayerIds);
    return layer;
  });

  const languageStyle = Object.assign({}, style, {
    layers: changedLayers
  });

  return this._languageTransform ? this._languageTransform(languageStyle, language) : languageStyle;
};

MapboxLanguage.prototype._initialStyleUpdate = function () {
  const style = this._map.getStyle();
  const language = this._defaultLanguage || browserLanguage(this.supportedLanguages);

  this._map.setStyle(this.setLanguage(style, language));
};

function browserLanguage(supportedLanguages) {
  const language = navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage);
  const parts = language && language.split('-');
  let languageCode = language;
  if (parts.length > 1) {
    languageCode = parts[0];
  }
  if (supportedLanguages.indexOf(languageCode) > -1) {
    return languageCode;
  }
  return null;
}

MapboxLanguage.prototype.onAdd = function (map) {
  this._map = map;
  this._map.on('style.load', this._initialStyleUpdate);
  this._container = document.createElement('div');
  return this._container;
};

MapboxLanguage.prototype.onRemove = function () {
  this._map.off('style.load', this._initialStyleUpdate);
  this._map = undefined;
};

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = MapboxLanguage;
} else {
  window.MapboxLanguage = MapboxLanguage;
}
