import { translateWord, translateSentence } from '../shared/ai.js';
import { saveWord, saveSentence } from '../shared/storage.js';

async function handle(msg) {
  if (msg.type === 'TRANSLATE_AND_SAVE') {
    const data = await translateWord(msg.word, msg.sentence);
    await saveWord({
      word: msg.word, sentence: msg.sentence, show: msg.show,
      translation: data.translation_az, pos: data.part_of_speech,
      exampleEn: data.example_en, exampleAz: data.example_az,
    });
    return { data };
  }
  if (msg.type === 'SAVE_SENTENCE') {
    const { translation_az } = await translateSentence(msg.sentence);
    const saved = await saveSentence({ text: msg.sentence, translation: translation_az, show: msg.show });
    return { saved };
  }
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  handle(msg).then(sendResponse).catch((e) => sendResponse({ error: e.message }));
  return true;
});

chrome.commands.onCommand.addListener(async (cmd) => {
  if (cmd !== 'save-sentence') return;
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) chrome.tabs.sendMessage(tab.id, { type: 'SAVE_CURRENT_SENTENCE' }).catch(() => {});
});

chrome.action.onClicked.addListener(() => chrome.runtime.openOptionsPage());
