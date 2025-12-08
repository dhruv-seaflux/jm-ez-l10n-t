"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.l10n = void 0;
const fs = __importStar(require("fs"));
const _ = __importStar(require("lodash"));
exports.l10n = {
    locale: "en",
    translations: { en: {} },
    setLocale: function (locale) {
        var _a;
        exports.l10n.locale = locale;
        exports.l10n.translations[locale] = (_a = exports.l10n.translations[locale]) !== null && _a !== void 0 ? _a : {};
    },
    setTranslations: function (locale, translations) {
        exports.l10n.translations[locale] = translations;
    },
    addTranslations: function (locale, translations) {
        exports.l10n.translations[locale] = _.merge(exports.l10n.translations[locale], translations);
    },
    setTranslationsFile: function (locale, file) {
        const translations = exports.l10n.getTranslationsFromFile(file);
        exports.l10n.setTranslations(locale, translations);
    },
    addTranslationsFile: function (locale, file) {
        const translations = exports.l10n.getTranslationsFromFile(file);
        exports.l10n.addTranslations(locale, translations);
    },
    t: function (key, obj) {
        var _a, _b;
        // Determine locale: obj.locale > this.locale > l10n.locale
        const locale = (_a = obj === null || obj === void 0 ? void 0 : obj.locale) !== null && _a !== void 0 ? _a : ((_b = this.locale) !== null && _b !== void 0 ? _b : exports.l10n.locale);
        // Get translation for the locale
        const translations = exports.l10n.translations[locale] || {};
        let translation = translations[key];
        // Replace placeholders if translation exists
        if (translation && obj) {
            _.forEach(obj, (value, k) => {
                if (k === 'locale')
                    return; // Skip locale placeholder
                translation = translation.replace(new RegExp(`{{${k}}}`, 'g'), value);
            });
        }
        // Return translation or error
        return translation !== null && translation !== void 0 ? translation : new Error(`Translation not found for ${key} in locale ${locale}`);
    },
    getTranslationsFromFile: function (file) {
        let translations = {};
        try {
            translations = JSON.parse(fs.readFileSync(file, "utf8"));
        }
        catch (e) {
            console.log(new Error(JSON.stringify({
                file: file,
                message: "Translation file is not having proper JSON format",
                error: e.message,
            })));
        }
        return translations;
    },
    enableL10N: function (anyObject, locale) {
        anyObject.t = exports.l10n.t.bind(exports.l10n);
        anyObject.locale = locale;
    },
    enableL10NExpress: function (request, response, next) {
        let locale = exports.l10n.locale;
        if (request.headers["x-l10n-locale"]) {
            locale = request.headers["x-l10n-locale"];
        }
        exports.l10n.enableL10N(request, locale);
        next();
    },
};
//# sourceMappingURL=index.js.map