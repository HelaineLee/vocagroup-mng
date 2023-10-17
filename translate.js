// Imports the Google Cloud client library
const {Translate} = require('@google-cloud/translate').v2;

// Creates a client
const translate = new Translate(
    {
        projectId: 'intricate-pad-402100', //eg my-project-0o0o0o0o'
        keyFilename: 'intricate-pad-402100-eebc3c1f5ad8.json' //eg my-project-0fwewexyz.json
    }
);

// DB connection
const db = require('./db.js');
const select = require('./query/select.js');
const update = require('./query/update.js');

const part = 'noun'
const start_lang = 'en';
const target_lang = 'ru';  // The target language, e.g. ru
const model = 'base';   // The model to use, possible values are "base" and "nmt"

db.query(select(part, start_lang, target_lang)
    , function(error, results, fields){
        results.forEach(r => {
            const text = r.text;    // The text to translate, e.g. Hello, world!

            async function translateTextWithModel() {
                const options = {
                    to: target_lang,                    
                    model: model,
                };
            
                // Translates the text into the target language. "text" can be a string for
                // translating a single piece of text, or an array of strings for translating
                // multiple texts.
                let [translations] = await translate.translate(text, options);
                translations = Array.isArray(translations) ? translations : [translations];
                translations.forEach((translation, i) => {
                    console.log(`${text} => (${target_lang}) ${translation}`);
                    db.query(update(part, target_lang, translation, r.no)
                        , function(error, result){
                            if(error){
                                throw error;
                            }
                        }
                    );

                });
            }
            
            translateTextWithModel();
        });
    }
);
