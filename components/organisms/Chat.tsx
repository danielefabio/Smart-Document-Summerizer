"use client";

import {
  ArrowUpIcon,
  PaperclipIcon,
  PlusIcon,
  RotateCwIcon,
} from "lucide-react";

import MessageAnimated from "@/components/atoms/MessageAnimated";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRef, useState } from "react";
import { Input } from "@base-ui/react";
import { InputFile } from "./InputFile";
import { Document, Message } from "@/app/types/chat";
import DocumentList from "../molecules/DocumentList";
import EmptyMessage from "../molecules/EmptyMessage";
import { TypingIndicator } from "../atoms/TypingIndicator";
import { MessageItem } from "../molecules/MessageItem";

export function Chat() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState<string>("");
  const [isFetching, setFetching] = useState<boolean>(false);
  const [isConnecting, setConnecting] = useState<boolean>(false);
  const inputFile = useRef<HTMLInputElement>(null);

  const addNewUserMessage = (question: string) => {
    if (question && question.length > 0) {
      const msg = createNewMessage({ role: "user", content: question });
      setMessages((prev) => [...prev, msg]);
    }
  };

  /*
    | Update last message if role is bot
    | Otherwise create a new bot message
  */
  const updateBotMessage = (text: string) => {
    if (text && text.length > 0) {
      setMessages((prev) => {
        const lastMsg = prev[prev.length - 1];

        if (lastMsg?.role === "bot") {
          return [...prev.slice(0, -1), { ...lastMsg, content: text }];
        }

        const newMsg = createNewMessage({ role: "bot", content: text });

        return [...prev, newMsg];
      });
    }
  };

  const createNewMessage = ({ role, content }: Partial<Message>): Message => {
    const id = crypto.randomUUID();
    return {
      id: id,
      role: role,
      content: content,
    } as Message;
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const currentQuestion = question.trim();
    if (!currentQuestion) return;

    setConnecting(true);
    addNewUserMessage(question);
    setQuestion("");

    try {
      const res = await fetch("/api/ollama", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          documents: documents.map(
            (doc) => `DOC: ${doc.name}, CONTENT: ${doc.content}`,
          ),
        }),
      });

      // 2. Gestione degli errori HTTP (es. 500 Server Error o 400 Bad Request)
      if (!res.ok) {
        throw new Error(`Errore del server: ${res.status} ${res.statusText}`);
      }

      if (!res.body) {
        throw new Error("Il server non ha restituito un body leggibile.");
      }

      // Read the Stream from Next.js backend
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let response = "";
      setConnecting(false);
      setFetching(true);
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const textChunk = decoder.decode(value, { stream: true });
        response += textChunk;
        updateBotMessage(response);
      }
    } catch (error) {
      setConnecting(false);
      console.error("Errore nel recupero dello stream:", error);
      updateBotMessage(
        "Si è verificato un errore durante la generazione della risposta.",
      );
    } finally {
      setConnecting(false);
      setFetching(false);
    }
  };

  const removeDocumentOnClick = (idToRemove: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== idToRemove));
  };

  const reset = () => {
    setQuestion("");
    setMessages([]);
    setDocuments([]);
  };

  // const showLoading = () => messages.at(-1)?.role !== "bot" && loading;

  return (
    <MessageScrollerProvider defaultScrollPosition="end">
      <div className="relative w-full h-full flex flex-col min-h-0 overflow-hidden p-2 sm:p-4">
        {/* La card occupa rigidamente il 100% dello spazio assegnato */}
        <Card className="mx-auto h-full w-full flex flex-col overflow-hidden border bg-white dark:bg-zinc-950">
          <CardHeader className="gap-1 border-b">
            <CardTitle>New Chat</CardTitle>
            <CardDescription>How can I help you today?</CardDescription>
            <CardAction>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Reset conversation"
                      onClick={() => reset()}
                      disabled={isFetching || isConnecting}
                    >
                      <RotateCwIcon />
                    </Button>
                  }
                />
                <TooltipContent>
                  <p>Reset</p>
                </TooltipContent>
              </Tooltip>
            </CardAction>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">
            {messages.length === 0 ? (
              <EmptyMessage />
            ) : (
              <MessageScroller>
                <MessageScrollerViewport>
                  <MessageScrollerContent
                    aria-busy={isFetching || isConnecting}
                    className="p-(--card-spacing)"
                  >
                    {messages.map((message) => (
                      <MessageItem key={message.id} message={message} />
                    ))}
                    {isConnecting && (
                      <MessageScrollerItem messageId="loading-indicator">
                        <TypingIndicator />
                      </MessageScrollerItem>
                    )}
                  </MessageScrollerContent>
                </MessageScrollerViewport>
                <MessageScrollerButton />
              </MessageScroller>
            )}
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <form onSubmit={handleSubmit} className="w-full">
              <InputGroup>
                <DocumentList
                  documents={documents}
                  removeDocumentOnClick={removeDocumentOnClick}
                />
                <div className="h-14 w-full px-3 py-2.5">
                  <Input
                    className="line-clamp-2 bg-black/10 rounded-[var(--radius-lg)] w-full p-2"
                    type="text"
                    value={question}
                    placeholder={`Ask any question about the file`}
                    onChange={(e) => setQuestion(e.target.value)}
                  />
                </div>
                <InputGroupAddon align="block-end" className="pt-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <InputGroupButton
                          aria-label="Add files"
                          type="button"
                          size="icon-sm"
                          variant="outline"
                        >
                          <PlusIcon />
                        </InputGroupButton>
                      }
                    />
                    <DropdownMenuContent
                      align="start"
                      side="top"
                      className="w-44"
                    >
                      <DropdownMenuItem
                        onClick={() => {
                          inputFile.current?.click();
                        }}
                      >
                        <PaperclipIcon />
                        Select a PDF file
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <InputGroupButton
                    type="submit"
                    variant="default"
                    size="icon-sm"
                    disabled={isFetching || isConnecting}
                    className="ml-auto"
                  >
                    <ArrowUpIcon />
                    <span className="sr-only">Send</span>
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </form>
          </CardFooter>
        </Card>
        <InputFile
          className="hidden"
          ref={inputFile}
          setDocument={(doc: Document) =>
            setDocuments((prev) => [...prev, doc])
          }
        />
      </div>
    </MessageScrollerProvider>
  );
}
