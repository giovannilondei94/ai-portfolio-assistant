"use client";

import { FormEvent, PointerEvent as ReactPointerEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  buildWelcomeMessage,
  chatWidgetUiConfig,
  ChatWidgetLocale,
  getChatWidgetCopy
} from "@/lib/config/chat-widget";
import { ChatMessage, ChatResponse } from "@/types/chat";

type ChatWidgetProps = {
  profileName: string;
  profileSlug?: string;
  locale?: ChatWidgetLocale;
};

export default function ChatWidget({
  profileName,
  profileSlug,
  locale = chatWidgetUiConfig.defaultLocale
}: ChatWidgetProps) {
  const copy = getChatWidgetCopy(locale);
  const welcomeMessage = buildWelcomeMessage(profileName, locale);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      role: "assistant",
      content: welcomeMessage
    }
  ]);
  const [panelWidth, setPanelWidth] = useState<number>(chatWidgetUiConfig.defaultWidth);
  const [panelHeight, setPanelHeight] = useState<number>(chatWidgetUiConfig.defaultHeight);
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
    function handlePointerMove(event: PointerEvent) {
      const resizeState = resizeStateRef.current;

      if (!resizeState) {
        return;
      }

      const width = resizeState.startWidth - (event.clientX - resizeState.startX);
      const height = resizeState.startHeight - (event.clientY - resizeState.startY);
      const maxHeight = Math.max(chatWidgetUiConfig.minHeight, Math.floor(window.innerHeight * 0.88));

      setPanelWidth(
        Math.min(Math.max(width, chatWidgetUiConfig.minWidth), chatWidgetUiConfig.maxWidth)
      );
      setPanelHeight(Math.min(Math.max(height, chatWidgetUiConfig.minHeight), maxHeight));
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
    const normalizedContent = content.trim();

    if (!normalizedContent || isLoading) {
      return;
    }

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: normalizedContent }];

    setMessages(nextMessages);
    setInputValue("");
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

      const data = (await response.json()) as ChatResponse;

      if (!response.ok || !("reply" in data)) {
        throw new Error("error" in data ? data.error : "Request failed.");
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          role: "assistant",
          content: data.reply
        }
      ]);
    } catch (error) {
      const message = error instanceof Error ? error.message : copy.genericErrorMessage;

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
    void sendMessage(inputValue);
  }

  return (
    <>
      {isOpen ? (
        <div
          className="fixed right-4 bottom-4 z-50 flex max-h-[calc(100vh-2rem)] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.18)]"
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
              const isUserMessage = message.role === "user";

              return (
                <div
                  key={`${message.role}-${index}-${message.content}`}
                  className={isUserMessage ? "flex justify-end" : "flex justify-start"}
                >
                  <div
                    className={[
                      "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm",
                      isUserMessage
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
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                placeholder={copy.inputPlaceholder}
                disabled={isLoading}
                className="min-w-0 flex-1 rounded-2xl border border-zinc-300 px-4 py-3 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-950"
              />
              <button
                type="submit"
                disabled={isLoading || inputValue.trim().length === 0}
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
