import React, { useState, useRef, useEffect } from "react";

export default function ChatInput({ onSend, disabled, hasMessages = true }) {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]); 

  const submit = async () => {
    if (!text.trim() || disabled) return; 
    setText("");   
    await onSend(text.trim());        
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className={`p-4 ${!hasMessages ? 'flex justify-center' : ''}`}>
      <div className={`relative ${!hasMessages ? 'w-full max-w-2xl' : ''}`}>
        <div className="flex items-start gap-3 bg-gray-100 rounded-[20px] px-4 py-3 border-2 border-gray-400 hover:border-blue-400 focus-within:border-blue-500 shadow-lg focus-within:shadow-lg transition-all">
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask your question..."
            disabled={disabled}
            rows={1}
            className="flex-1 resize-none bg-transparent border-0 focus:outline-none text-gray-800 placeholder-gray-500 text-sm leading-6 min-h-[24px] overflow-hidden"
            style={{ scrollbarWidth: 'thin' }}
          />

          {/* Send button (appears when text is entered) */}
          {text.trim() && (
            <button
              onClick={submit}
              disabled={disabled}
              className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
              title="Send message"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
