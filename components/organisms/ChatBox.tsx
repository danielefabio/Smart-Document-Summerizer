"use client";

import { Badge } from "@/components/ui/badge";
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
import { useState } from "react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
}

const ChatMessagesBox = ({ messages }: { messages: Message[] }) => {
  return (
    <div
      className="bg-black/35 overflow-y-auto max-h-96
        rounded-[var(--radius-2xl)] p-4 space-y-2"
    >
      {messages.map((message) => (
        <div
          key={message.id}
          className={`p-2 ${message.sender === "user" ? "text-right" : "text-left"}`}
        >
          <span
            className={`inline-block px-4 py-2 rounded-[var(--radius-2xl)]
              ${message.sender === "user" ? "bg-primary/50 text-white" : "bg-gray-200 text-black"}`}
          >
            {message.text}
          </span>
        </div>
      ))}
    </div>
  );
};

export function ChatBox() {
  const initialMessages: Message[] = [
    { id: "1", text: "Hello, how can I help you?", sender: "bot" },
    { id: "2", text: "I need assistance with my account.", sender: "user" },
    { id: "3", text: "Sure, I can help you with that.", sender: "bot" },
  ];

  const [messages, setMessages] = useState<Message[]>(initialMessages);

  return (
    <Card className="relative mx-auto w-full pt-0">
      <CardHeader>
        <CardAction>
          <Badge variant="secondary">Featured</Badge>
        </CardAction>
        <CardTitle>Design systems meetup</CardTitle>
        <CardDescription>
          A practical talk on component APIs, accessibility, and shipping
          faster.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChatMessagesBox
          messages={messages}
        />
      </CardContent>
      <CardFooter>
        <Button className="w-full">View Event</Button>
      </CardFooter>
    </Card>
  );
}
