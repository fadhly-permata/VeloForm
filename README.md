# ⚡ VeloForm

**VeloForm** is an open-source, cross-platform **AI-Driven Dynamic UI, Form Generator & Workflow Engine** built with React Native (Expo) and TypeScript. It allows developers and businesses to turn plain text prompts into fully functional **Master Pages**, **Transaction Forms**, **Reports**, and **Custom Decision Workflows** in seconds with full theme support (**Dark, Light, & System Auto**).

---

## ✨ Key Features

* **🎨 Adaptive Theme Engine:** Seamlessly toggle between **Light**, **Dark**, or **Auto (System Default)** modes across all platforms and dynamically generated components.
* **🤖 Multi-Provider AI Engine:** Connect seamlessly to OpenRouter, HuggingFace, OpenAI, or local proxies (Ollama, LiteLLM).
* **🖥️ Interactive Live Studio:** Features a dual-pane workspace with a real-time UI preview and contextual AI chat refinement loop.
* **☁️ Cloud-First Supabase Architecture (R-028/R-035):**
  * Schema `usage` — profiles, user preferences, AI provider configs, task queue, telemetry.
  * Schema `business` — form master schemas, transactions, reports, workflows (isolated per business via RLS).
  * AI provider **API keys** stay in device secure storage (never in the database).
* **🔄 Event-Driven Workflow Engine:** Execute automated business logic triggered by form events (`ON_SUBMIT`, `ON_CHANGE`), background cron schedulers, or local task queues.
* **📱 Cross-Platform Support:** Single codebase for Web (SPA/PWA), Android (APK/AAB), and iOS (IPA).

---

## 🚀 Tech Stack

* **Core Framework:** React Native / Expo (SDK 51+)
* **Languages:** TypeScript
* **Theme & UI System:** React Native Paper / Gluestack UI + `useColorScheme` Hook
* **State Management:** Zustand
* **Backend & Database:** Supabase (Postgres, RLS, Google Auth) — all app data (prefs, AI providers, task queue, business data)
* **Secure Storage:** `expo-secure-store` (AI provider API keys)
* **Background Tasks:** in-app scheduler (OS-level `expo-background-fetch` planned)
