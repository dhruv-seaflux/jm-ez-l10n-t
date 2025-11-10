var _ = require("lodash");
var fs = require('fs');

var l10n = {
    locale: "en",
    translations: {
        "en": {}
    }
}

l10n.setLocale = function (locale) {
    l10n.locale = locale;
    l10n.translations[locale] = !l10n.translations[locale] ? {} : l10n.translations[locale];
}

l10n.setTranslations = function (locale, translations) {
    l10n.translations[locale] = translations;
}

l10n.addTranslations = function (locale, translations) {
    l10n.translations[locale] = _.merge(l10n.translations[locale], translations);
}

l10n.setTranslationsFile = function (locale, file) {
    var translations = getTranslationsFromFile(file);
    l10n.setTranslations(locale, translations)
}

l10n.addTranslationsFile = function (locale, file) {
    var translations = getTranslationsFromFile(file);
    l10n.addTranslations(locale, translations);
}

l10n.t = l10n.translate = function (key, obj) {
    var locale = (obj && obj.locale) ? obj.locale : (this.locale ? this.locale : l10n.locale);

    // Ensure translations exist for that locale
    var translations = l10n.translations[locale] || {};
    var translation = translations[key];

    // Replace {{key}} placeholders if the translation exists
    if (translation && obj) {
        _.forEach(obj, function (value, key) {
            // Skip locale placeholder substitution
            if (key === 'locale') return;
            translation = translation.replace(new RegExp('{{' + key + '}}', 'g'), value);
        });
    }

    // Return translation or an Error
    return translation ? translation : new Error("Translation not found for " + key + " in locale " + locale);
}

var getTranslationsFromFile = function (file) {
    var translations = {};
    try {
        return JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (e) {
        console.log(new Error(JSON.stringify({
            "file": file,
            "message": "Translation file is not having proper JSON format",
            "error": e.message
        })));
    }
}

l10n.enableL10N = function (anyObject, locale) {
    anyObject.t = l10n.t;
    anyObject.locale = locale;
}

l10n.enableL10NExpress = function (request, response, next) {
    var locale = l10n.locale;
    if (request.headers['x-l10n-locale']) {
        locale = request.headers['x-l10n-locale'];
    }
    l10n.enableL10N(request, locale);
    next();
}
module.exports = l10n;

