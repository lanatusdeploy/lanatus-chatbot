import React, { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";

export default function ChatWindow({ messages }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 p-6 bg-gray-100">
      {messages.length === 0 && (
        <div className="text-center text-gray-400 mt-16">
          <div className="text-4xl mb-4">👋</div>
          <div className="text-lg">Say Hello to get started</div>
        </div>
      )}
      <div className="space-y-4">
        {messages.map((m, i) => (
          <ChatMessage key={i} message={m} />
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
}
