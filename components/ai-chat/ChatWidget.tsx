"use client";

import { FormEvent, PointerEvent as ReactPointerEvent, useEffect, useMemo, useRef, useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type Locale = "it" | "en";

type Copy = {
  widgetButtonLabel: string;
  title: string;
  subtitle: string;
  closeLabel: string;
  resizeLabel: string;
  welcomeMessage: string;
  thinkingMessage: string;
  inputPlaceholder: string;
  sendButtonLabel: string;
  genericErrorMessage: string;
  errorPrefix: string;
  suggestions: string[];
};

const COPY: Record<Locale, Copy> = {
  it: {
    widgetButtonLabel: "AI Assistant",
    title: "AI Portfolio Assistant",
    subtitle: "Assistente profilo orientato ai recruiter",
    closeLabel: "Chiudi chat",
    resizeLabel: "Ridimensiona widget chat",
    welcomeMessage:
      "Ciao, sono l'AI Portfolio Assistant. Chiedimi informazioni su esperienza, competenze, tecnologie o background del candidato.",
    thinkingMessage: "Sto pensando...",
    inputPlaceholder: "Chiedi informazioni su esperienza, competenze o fit",
    sendButtonLabel: "Invia",
    genericErrorMessage: "Si è verificato un problema durante il contatto con l'assistente.",
    errorPrefix: "Errore",
    suggestions: [
      "Riassumi il profilo",
      "Quali sono le tecnologie che utilizza?",
      "Quali sono i suoi principali punti di forza?"
    ]
  },
  en: {
    widgetButtonLabel: "AI Assistant",
    title: "AI Portfolio Assistant",
    subtitle: "Recruiter-focused profile assistant",
    closeLabel: "Close chat",
    resizeLabel: "Resize chat widget",
    welcomeMessage:
      "Hi, I’m the AI Portfolio Assistant. Ask me about the candidate’s experience, skills, technologies, or background.",
    thinkingMessage: "Thinking...",
    inputPlaceholder: "Ask about experience, skills, or fit",
    sendButtonLabel: "Send",
    genericErrorMessage: "Something went wrong while contacting the assistant.",
    errorPrefix: "Error",
    suggestions: [
      "Summarize the profile",
      "What technologies does he use?",
      "What are his main strengths?"
    ]
  }
};

const MIN_WIDTH = 320;
const MAX_WIDTH = 560;
const MIN_HEIGHT = 420;
const DEFAULT_WIDTH = 380;
const DEFAULT_HEIGHT = 680;
const DEFAULT_LOCALE: Locale = "it";

type ChatWidgetProps = {
  profileName: string;
  profileSlug?: string;
};

function getDisplayProfileName(profileName: string): string {
  return profileName.trim() || "questo candidato";
}

function getWelcomeMessage(profileName: string): string {
  const displayName = getDisplayProfileName(profileName);

  return `Ciao, sono l'AI Portfolio Assistant di ${displayName}. Chiedimi informazioni su esperienza, competenze, tecnologie o background di ${displayName}.`;
}

export default function ChatWidget({ profileName, profileSlug = "example" }: ChatWidgetProps) {
  const copy = COPY[DEFAULT_LOCALE];
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      role: "assistant",
      content: getWelcomeMessage(profileName)
    }
  ]);
  const [panelWidth, setPanelWidth] = useState(DEFAULT_WIDTH);
  const [panelHeight, setPanelHeight] = useState(DEFAULT_HEIGHT);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const resizeStateRef = useRef<{
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
  } | null>(null);

  const visibleMessages = useMemo(() => {
    if (!isLoading) {
      return messages;
    }

    return [...messages, { role: "assistant", content: copy.thinkingMessage }];
  }, [copy.thinkingMessage, isLoading, messages]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end"
    });
  }, [isOpen, visibleMessages]);

  useEffect(() => {
    if (!isOpen || isLoading) {
      return;
    }

    inputRef.current?.focus();
  }, [isOpen, isLoading]);

  useEffect(() => {
    setMessages((currentMessages) => {
      if (
        currentMessages.length !== 1 ||
        currentMessages[0]?.role !== "assistant"
      ) {
        return currentMessages;
      }

      return [
        {
          role: "assistant",
          content: getWelcomeMessage(profileName)
        }
      ];
    });
  }, [profileName]);

  useEffect(() => {
    function handlePointerMove(event: PointerEvent) {
      const resizeState = resizeStateRef.current;

      if (!resizeState) {
        return;
      }

      const width = resizeState.startWidth - (event.clientX - resizeState.startX);
      const height = resizeState.startHeight - (event.clientY - resizeState.startY);
      const maxHeight = Math.max(MIN_HEIGHT, Math.floor(window.innerHeight * 0.88));

      setPanelWidth(Math.min(Math.max(width, MIN_WIDTH), MAX_WIDTH));
      setPanelHeight(Math.min(Math.max(height, MIN_HEIGHT), maxHeight));
    }

    function handlePointerUp() {
      resizeStateRef.current = null;
      document.body.style.userSelect = "";
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  function handleResizeStart(event: ReactPointerEvent<HTMLButtonElement>) {
    resizeStateRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      startWidth: panelWidth,
      startHeight: panelHeight
    };

    document.body.style.userSelect = "none";
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  async function sendMessage(content: string) {
    const trimmedContent = content.trim();

    if (!trimmedContent || isLoading) {
      return;
    }

    const nextMessages = [...messages, { role: "user" as const, content: trimmedContent }];

    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          profileSlug,
          messages: nextMessages
        })
      });

      const data = (await response.json()) as { error?: string; reply?: string };

      if (!response.ok) {
        throw new Error(data.error || "Request failed.");
      }

      if (!data.reply) {
        throw new Error("Empty assistant reply.");
      }

      const reply = data.reply;

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          role: "assistant",
          content: reply
        }
      ]);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : copy.genericErrorMessage;

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          role: "assistant",
          content: `${copy.errorPrefix}: ${message}`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  return (
    <>
      {isOpen ? (
        <div
          className="fixed right-4 bottom-4 z-50 flex max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.18)]"
          style={{
            width: `${panelWidth}px`,
            height: `${panelHeight}px`
          }}
        >
          <button
            type="button"
            onPointerDown={handleResizeStart}
            className="absolute top-0 left-0 z-10 h-5 w-5 cursor-nwse-resize rounded-br-2xl bg-zinc-100/90 transition hover:bg-zinc-200"
            aria-label={copy.resizeLabel}
          />
          <div className="flex items-start justify-between border-b border-zinc-200 px-5 py-4">
            <div className="pr-4">
              <h2 className="text-sm font-semibold text-zinc-950">{copy.title}</h2>
              <p className="mt-1 text-sm text-zinc-500">{copy.subtitle}</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-lg text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
              aria-label={copy.closeLabel}
            >
              ×
            </button>
          </div>

          <div className="border-b border-zinc-100 px-4 py-3">
            <div className="flex flex-wrap gap-2">
              {copy.suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => void sendMessage(suggestion)}
                  disabled={isLoading}
                  className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto bg-zinc-50/70 px-4 py-4">
            {visibleMessages.map((message, index) => {
              const isUser = message.role === "user";

              return (
                <div key={`${message.role}-${index}-${message.content}`} className={isUser ? "flex justify-end" : "flex justify-start"}>
                  <div
                    className={[
                      "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm",
                      isUser
                        ? "rounded-br-md bg-zinc-950 text-white"
                        : "rounded-bl-md border border-zinc-200 bg-white text-zinc-800"
                    ].join(" ")}
                  >
                    {message.content}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="border-t border-zinc-200 bg-white p-4">
            <div className="flex items-end gap-3">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={copy.inputPlaceholder}
                disabled={isLoading}
                className="min-w-0 flex-1 rounded-2xl border border-zinc-300 px-4 py-3 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-950"
              />
              <button
                type="submit"
                disabled={isLoading || input.trim().length === 0}
                className="rounded-2xl bg-zinc-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
              >
                {copy.sendButtonLabel}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setIsOpen(true)}
        disabled={isLoading}
        className="fixed right-4 bottom-4 z-40 inline-flex items-center rounded-full bg-zinc-950 px-5 py-3 text-sm font-medium text-white shadow-[0_18px_45px_rgba(15,23,42,0.22)] transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
      >
        {copy.widgetButtonLabel}
      </button>
    </>
  );
}
