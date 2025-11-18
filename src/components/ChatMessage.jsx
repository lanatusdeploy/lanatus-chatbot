import React from "react";

export default function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} items-start gap-2`}>
      <div
        className={`max-w-[75%] px-4 py-2 rounded-2xl ${
          isUser 
            ? "bg-blue-600 text-white rounded-br-sm" 
            : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm"
        }`}
      >
        <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.text}</div>
      </div>
    </div>
  );
}
