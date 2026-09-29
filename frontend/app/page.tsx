"use client";

import { useState } from "react";
import type { FormEvent } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm SmartBot, powered by Hugging Face and Llama 3.1 8B. How can I help you?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const message = input.trim();

    if (!message || loading) {
      return;
    }

    setMessages((current) => [
      ...current,
      {
        role: "user",
        content: message,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8000/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: message,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Backend returned ${response.status}`);
      }

      const data: { response: string } = await response.json();

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.response,
        },
      ]);
    } catch (error) {
      console.error("SmartBot error:", error);

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            "I couldn't connect to SmartBot. Please make sure the SmartBot backend is running.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function createNewConversation() {
    setMessages([
      {
        role: "assistant",
        content:
          "New conversation started. I'm ready to help. What would you like to know?",
      },
    ]);

    setInput("");
  }

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <div className="flex min-h-screen">
        {/* SIDEBAR */}
        <aside className="hidden w-72 flex-col border-r border-white/10 bg-[#0d0d10] p-5 md:flex">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight">
              Smart<span className="text-violet-400">Bot</span>
            </h1>

            <p className="mt-1 text-xs text-zinc-500">
              Intelligent AI Workspace
            </p>
          </div>

          <button
            type="button"
            onClick={createNewConversation}
            className="mb-6 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm transition hover:bg-white/10"
          >
            + New conversation
          </button>

          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
            Recent conversations
          </div>

          <div className="mt-4 space-y-2">
            <div className="rounded-lg bg-white/5 px-3 py-2 text-sm text-zinc-300">
              Current conversation
            </div>
          </div>

          <div className="mt-auto border-t border-white/10 pt-4 text-xs text-zinc-500">
            <div>AI Engine</div>

            <div className="mt-1 text-emerald-400">
              ● Hugging Face
            </div>

            <div className="mt-1 text-zinc-500">
              Llama 3.1 8B Instruct
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <section className="flex min-h-screen flex-1 flex-col">
          {/* HEADER */}
          <header className="flex h-16 items-center justify-between border-b border-white/10 px-5 md:px-8">
            <div>
              <h2 className="font-semibold">SmartBot</h2>

              <p className="text-xs text-zinc-500">
                Hugging Face AI Assistant
              </p>
            </div>

            <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
              ● Online
            </div>
          </header>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-5 py-8 md:px-8">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex ${
                    message.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-5 py-4 text-sm leading-7 ${
                      message.role === "user"
                        ? "bg-violet-600 text-white"
                        : "border border-white/10 bg-[#111116] text-zinc-200"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl border border-white/10 bg-[#111116] px-5 py-4 text-sm text-zinc-400">
                    SmartBot is thinking...
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* INPUT */}
          <div className="border-t border-white/10 bg-[#09090b] p-4 md:p-6">
            <form
              onSubmit={sendMessage}
              className="mx-auto flex w-full max-w-4xl gap-3"
            >
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Message SmartBot..."
                disabled={loading}
                autoComplete="off"
                className="flex-1 rounded-2xl border border-white/10 bg-[#111116] px-5 py-4 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-violet-500/50"
              />

              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="rounded-2xl bg-violet-600 px-6 py-4 text-sm font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? "..." : "Send"}
              </button>
            </form>

            <p className="mx-auto mt-3 max-w-4xl text-center text-[11px] text-zinc-600">
              SmartBot is powered by Hugging Face and Llama 3.1 8B.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}