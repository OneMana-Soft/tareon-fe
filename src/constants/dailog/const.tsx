export const TOAST_TITLE_SUCCESS = "Success"
export const TOAST_TITLE_FAILURE = "Failure"
export const TOAST_UNKNOWN_ERROR = "An unexpected error occurred"

interface langInterface {
    name: string
    code: string
}

interface langListInterface {
    [code: string]: langInterface;
}

export const appLangList:langListInterface = {
    'am': {
        name: "Arabic",
        code: "am"
    },
    'be': {
        name: "Belarusian",
        code: "be"
    },
    'bg': {
        name: "Bulgarian",
        code: "bg"
    },
    'ca': {
        name: "Catalan",
        code: "ca"
    },
    'cs': {
        name: "Czech",
        code: "cs"
    },
    'da': {
        name: "Danish",
        code: "da"
    },
    'de': {
        name: "German",
        code: "de"
    },
    'el': {
        name: "Greek",
        code: "el"
    },
    'en-AU': {
        name: "Australian English",
        code: "en-AU"
    },
    'en': {
        name: "English-US",
        code: "en"
    },
    'es': {
        name: "Spanish",
        code: "es"
    },
    'et': {
        name: "Estonian",
        code: "et"
    },
    'eu': {
        name: "Basque",
        code: "eu"
    },
    'fi': {
        name: "Finnish",
        code: "fi"
    },
    'fr': {
        name: "French",
        code: "fr"
    },
    'he': {
        name: "Hebrew",
        code: "he"
    },
    'hi': {
        name: "Hindi",
        code: "hi"
    },
    'it': {
        name: "Italian",
        code: "it"
    },
    'ja': {
        name: "Japanese",
        code: "ja"
    },
    'nl': {
        name: "Dutch",
        code: "nl"
    },
    'pt': {
        name: "Portuguese",
        code: "pt"
    },
    'ru': {
        name: "Russian",
        code: "ru"
    },
    'sv': {
        name: "Swedish",
        code: "sv"
    }
}
