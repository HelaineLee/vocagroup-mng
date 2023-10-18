// Imports
const {Translate} = require('@google-cloud/translate').v2;  // Google Cloud client library
const db = require('./db.js');  // DB connection
const select = require('./query/select.js');
const update = require('./query/update.js');

// Constants
const part = 'noun'
const start_lang = 'en';
const target_lang = 'ru';  // The target language, e.g. ru
const model = 'base';   // The model to use, possible values are "base" and "nmt"

// Google Cloud client configuration
const clientConfig = {
    projectId: 'intricate-pad-402100',  //eg my-project-0o0o0o0o'
    keyFilename: 'intricate-pad-402100-eebc3c1f5ad8.json'  //eg my-project-0fwewexyz.json
};

// Cloud translation options
const translateOptions = {
    to: target_lang,
    model: model
};

// Creates a client
const translate = new Translate(clientConfig);

// Functions
const getWordsToTranslate = async () => {
    db.query(select(part, start_lang, target_lang)
        , function(error, results, fields){
            results.forEach(async r => {
                await translateTextWithModel(r.text, r.no);
            });
        }
    );
}

const translateTextWithModel = async (text, no) => {
    // Translates the text into the target language. "text" can be a string for
    // translating a single piece of text, or an array of strings for translating
    // multiple texts.
    let [translations] = await translate.translate(text, translateOptions);
    translations = Array.isArray(translations) ? translations : [translations];
    translations.forEach((translation, i) => {
        console.log(`${no} ${text} => (${target_lang}) ${translation}`);
        saveTranslatedWords(translation, no);
    });
}

const saveTranslatedWords = async (translation, no) => {
    try {
        db.query(update(part, target_lang, translation), [translation, no]);
    } catch (error) {
        console.error(error.message);
    }
}

getWordsToTranslate();