const functions = require("firebase-functions/v2/https");
const { TranslationServiceClient } = require("@google-cloud/translate");

const client = new TranslationServiceClient();

exports.translateText = functions.onCall(async (request) => {
  try {
    const text = request.data.text;
    const targetLanguage = request.data.targetLanguage || "en";

    console.log("Texte reçu:", text);

    if (!text || text.trim() === "") {
      throw new functions.HttpsError(
        "invalid-argument",
        "Text is empty"
      );
    }

    const requestTranslate = {
      parent: `projects/translator-40cf4/locations/global`,
      contents: [text],
      mimeType: "text/plain",
      targetLanguageCode: targetLanguage,
    };

    const [response] = await client.translateText(requestTranslate);

    const translatedText =
      response.translations[0].translatedText;

    console.log("Traduction:", translatedText);

    return { translatedText };
  } catch (error) {
    console.error("Erreur traduction:", error);
    throw new functions.HttpsError(
      "internal",
      "Translation failed"
    );
  }
});