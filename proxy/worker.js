const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const prompts = {
  translate_word: ({ word, sentence }) =>
    `Word: "${word}"\nSentence: "${sentence}"\nExplain the word as used in this sentence. Return JSON: ` +
    `{"translation_az": "...", "part_of_speech": "...", "example_en": "...", "example_az": "..."}`,

  translate_sentence: ({ sentence }) =>
    `Translate to Azerbaijani: "${sentence}"\nReturn JSON: {"translation_az": "..."}`,

  quiz: ({ words }) =>
    `Words (JSON): ${JSON.stringify(words)}\nCreate one multiple-choice question per word. ` +
    `Alternate two types: "meaning" (prompt = English word, options = Azerbaijani meanings) and ` +
    `"context" (prompt = the saved sentence with the word replaced by ____, options = English words). ` +
    `Return a JSON array of {"id": <word id>, "type": "...", "prompt": "...", "options": [4 strings], ` +
    `"answer": <one of the options>, "explanation": "one short sentence in Azerbaijani"}.`,
};

export default {
  async fetch(req, env) {
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    if (req.method !== "POST") {
      return new Response("Use POST", {
        status: 405,
        headers: cors,
      });
    }

    if (!env.GEMINI_API_KEY) {
      return new Response("GEMINI_API_KEY is not configured", {
        status: 500,
        headers: cors,
      });
    }

    let body;

    try {
      body = await req.json();
    } catch {
      return new Response("Invalid JSON body", {
        status: 400,
        headers: cors,
      });
    }

    const { task, payload } = body;

    if (!prompts[task]) {
      return new Response("Unknown task", {
        status: 400,
        headers: cors,
      });
    }

    const prompt = prompts[task](payload);

    const requestBody = {
      systemInstruction: {
        parts: [
          {
            text: "Reply with valid JSON only. No markdown, no commentary.",
          },
        ],
      },
      contents: [
        {
          role: "user",
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    };

    let r;
    let errorText = "";

    // Retry temporary Gemini errors.
    for (let attempt = 1; attempt <= 3; attempt++) {
      r = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent",
        {
          method: "POST",
          headers: {
            "x-goog-api-key": env.GEMINI_API_KEY,
            "content-type": "application/json",
          },
          body: JSON.stringify(requestBody),
        },
      );

      if (r.ok) {
        break;
      }

      errorText = await r.text();

      // Retry only temporary/server/rate-limit errors.
      if (![429, 500, 502, 503, 504].includes(r.status)) {
        break;
      }

      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 1500));
      }
    }

    if (!r.ok) {
      return new Response(`Upstream error: ${errorText}`, {
        status: 502,
        headers: cors,
      });
    }

    const data = await r.json();

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!text) {
      return new Response("Empty AI response", {
        status: 502,
        headers: cors,
      });
    }

    try {
      JSON.parse(text);
    } catch {
      return new Response("Bad AI output", {
        status: 502,
        headers: cors,
      });
    }

    return new Response(text, {
      headers: {
        ...cors,
        "content-type": "application/json",
      },
    });
  },
};
