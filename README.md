# Translation AI

> AI-powered Chrome extension for learning English through subtitles with instant Azerbaijani translations.

Translation AI is a Chrome extension that helps you learn English naturally while watching videos on platforms like YouTube and Netflix.

Click any subtitle word to instantly see its Azerbaijani meaning, save useful vocabulary and sentences, and review them later with an interactive word bank and quizzes.

## ✨ Features

- 🎯 **Instant Word Translation**
  - Click any subtitle word to see its Azerbaijani meaning.
  - Get the word's part of speech and contextual explanation.
  - See English and Azerbaijani example sentences.

- 📝 **Save Sentences**
  - Save useful subtitle sentences for later.
  - Automatically translate saved sentences into Azerbaijani.

- 📚 **Word Bank**
  - Save and review vocabulary.
  - Search your saved words and sentences.
  - Filter words by learning status.

- 🧠 **AI Quiz**
  - Generate quizzes from your saved vocabulary.
  - Practice word meanings and contextual usage.
  - Get Azerbaijani explanations for answers.

- 🔥 **Learning Streak**
  - Track your daily learning activity.
  - Set a daily learning goal.
  - Maintain your learning streak.

- 🎬 **Subtitle-Based Learning**
  - Learn English naturally while watching content.
  - Designed for subtitle-based vocabulary learning.

## 🛠️ Tech Stack

- React
- Vite
- CRXJS
- Material UI
- Chrome Extension Manifest V3
- Google Gemini API
- Cloudflare Workers
- Chrome Storage API

## 🏗️ Architecture

```text
YouTube / Netflix
       │
       ▼
  Chrome Extension
       │
       ├── Content Script
       │
       ├── Background Service Worker
       │
       ▼
 Cloudflare Worker
       │
       ▼
   Gemini API
       │
       ▼
Azerbaijani Translation
