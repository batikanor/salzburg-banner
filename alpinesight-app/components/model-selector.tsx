"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";

const MODELS = [
  { id: "google/gemini-2.0-flash-exp:free", name: "Gemini 2.0 Flash (Free)" },
  { id: "openai/gpt-5-nano", name: "GPT-5 Nano" },
  { id: "openai/gpt-5-mini", name: "GPT-5 Mini" },
  { id: "openai/gpt-5", name: "GPT-5" },
  { id: "openai/gpt-4.1-mini", name: "GPT-4.1 Mini" },
  { id: "anthropic/claude-sonnet-4.5", name: "Claude Sonnet 4.5" },
  { id: "anthropic/claude-haiku-4.5", name: "Claude Haiku 4.5" },
  { id: "anthropic/claude-sonnet-4", name: "Claude Sonnet 4" },
  { id: "google/gemini-2.5-flash", name: "Gemini 2.5 Flash" },
  { id: "google/gemini-2.5-flash-lite", name: "Gemini 2.5 Flash Lite" },
  { id: "google/gemini-2.5-pro", name: "Gemini 2.5 Pro" },
  { id: "google/gemini-2.0-flash", name: "Gemini 2.0 Flash" },
  { id: "google/gemini-2.0-flash-lite", name: "Gemini 2.0 Flash Lite" },
  { id: "xai/grok-4-fast-reasoning", name: "Grok 4 Fast Reasoning" },
  { id: "xai/grok-4-fast-non-reasoning", name: "Grok 4 Fast" },
  { id: "deepseek/deepseek-v3.2-exp-thinking", name: "DeepSeek V3.2 Thinking" },
];

export function ModelSelector() {
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load saved model from localStorage
    const saved = localStorage.getItem("selected_model");
    if (saved) {
      setSelectedModel(saved);
    }
  }, []);

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
    localStorage.setItem("selected_model", modelId);
    setIsOpen(false);
    // Reload the page to apply model change
    window.location.reload();
  };

  const currentModel = MODELS.find((m) => m.id === selectedModel) || MODELS[0];

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="text-sm"
      >
        {currentModel.name}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="ml-2"
        >
          <polyline points="3 4.5 6 7.5 9 4.5"></polyline>
        </svg>
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden max-h-96 overflow-y-auto">
            {MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => handleModelChange(model.id)}
                className={`w-full px-4 py-2.5 text-left text-sm hover:bg-white/5 transition-colors ${
                  model.id === selectedModel
                    ? "bg-white/10 text-white font-medium"
                    : "text-white/70"
                }`}
              >
                {model.name}
                {model.id === selectedModel && (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="inline ml-2"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
