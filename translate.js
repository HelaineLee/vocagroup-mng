// Imports the Google Cloud client library
const {Translate} = require('@google-cloud/translate').v2;

// Creates a client
const translate = new Translate(
    {
        projectId: 'intricate-pad-402100', //eg my-project-0o0o0o0o'
        keyFilename: 'intricate-pad-402100-eebc3c1f5ad8.json' //eg my-project-0fwewexyz.json
    }
);

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
const text = 'translate';    // The text to translate, e.g. Hello, world!
const target = 'ru';  // The target language, e.g. ru
const model = 'base';   // The model to use, e.g. nmt

async function translateTextWithModel() {
    const options = {
        // The target language, e.g. "ru"
        to: target,
        // Make sure your project is on the allow list.
        // Possible values are "base" and "nmt"
        model: model,
    };

    // Translates the text into the target language. "text" can be a string for
    // translating a single piece of text, or an array of strings for translating
    // multiple texts.
    let [translations] = await translate.translate(text, options);
    translations = Array.isArray(translations) ? translations : [translations];
    console.log('Translations:');
    translations.forEach((translation, i) => {
        console.log(`${text[i]} => (${target}) ${translation}`);
    });
}

translateTextWithModel();