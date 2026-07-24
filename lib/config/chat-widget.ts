export type ChatWidgetLocale = "it" | "en";

type ChatWidgetCopy = {
  widgetButtonLabel: string;
  title: string;
  subtitle: string;
  closeLabel: string;
  resizeLabel: string;
  thinkingMessage: string;
  inputPlaceholder: string;
  sendButtonLabel: string;
  genericErrorMessage: string;
  errorPrefix: string;
  suggestions: string[];
};

export const chatWidgetUiConfig = {
  minWidth: 320,
  maxWidth: 560,
  minHeight: 420,
  defaultWidth: 380,
  defaultHeight: 680,
  defaultLocale: "it" as ChatWidgetLocale
} as const;

const chatWidgetCopyByLocale: Record<ChatWidgetLocale, ChatWidgetCopy> = {
  it: {
    widgetButtonLabel: "AI Assistant",
    title: "AI Portfolio Assistant",
    subtitle: "Assistente profilo orientato ai recruiter",
    closeLabel: "Chiudi chat",
    resizeLabel: "Ridimensiona widget chat",
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

function getDisplayProfileName(profileName: string): string {
  const normalizedProfileName = profileName.trim();

  return normalizedProfileName || "questo candidato";
}

export function getChatWidgetCopy(locale: ChatWidgetLocale): ChatWidgetCopy {
  return chatWidgetCopyByLocale[locale];
}

export function buildWelcomeMessage(profileName: string, locale: ChatWidgetLocale): string {
  const displayProfileName = getDisplayProfileName(profileName);

  if (locale === "en") {
    return `Hi, I’m the AI Portfolio Assistant for ${displayProfileName}. Ask me about ${displayProfileName}'s experience, skills, technologies, or background.`;
  }

  return `Ciao, sono l'AI Portfolio Assistant di ${displayProfileName}. Chiedimi informazioni su esperienza, competenze, tecnologie o background di ${displayProfileName}.`;
}
