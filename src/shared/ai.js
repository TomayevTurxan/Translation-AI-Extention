const PROXY_URL = "https://subtra-proxy.sublearn-ai.workers.dev";

async function callAI(task, payload) {
  const res = await fetch(PROXY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task, payload }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`AI request failed (${res.status}): ${errorText}`);
  }

  return res.json();
}

export const translateWord = (word, sentence) =>
  callAI("translate_word", { word, sentence });

export const translateSentence = (sentence) =>
  callAI("translate_sentence", { sentence });

export const generateQuiz = (words) => callAI("quiz", { words });
