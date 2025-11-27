import { useContext, useEffect, useRef, useState } from "react";
import ChatWindow from "../components/ChatWindow";
import ChatInput from "../components/ChatInput";
import ProfileDropdown from "../components/ProfileDropdown";
import { AuthContext } from "../context/AuthContext";
import { sendMessageToN8n } from "../utils/api";

export default function ChatPage() {
  const { user, logout } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (!chatContainerRef.current) return;
    chatContainerRef.current.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  const handleSend = async (text) => {
    // Replace "my" with user's name if it exists in the text
    let processedText = text;
    const userName = user?.name || user?.email || "User";

    if (processedText.toLowerCase().includes("my")) {
      // Replace "my" as a whole word (case-insensitive) with user's name
      processedText = processedText.replace(/\bmy\b/gi, userName);
    }

    const userMsg = {
      role: "user",
      text: text,
      timestamp: Date.now(),
      userName: userName,
    };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);

    try {
      const res = await sendMessageToN8n(processedText, user.name, user.email);
      if (!res) {
        setMessages((m) => [
          ...m,
          {
            role: "bot",
            text: "Sorry, Please try again",
            timestamp: Date.now(),
          },
        ]);
      } else {
        const botText = res[0]?.output;
        setMessages((m) => [
          ...m,
          { role: "bot", text: botText, timestamp: Date.now() },
        ]);
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages((m) => [
        ...m,
        {
          role: "bot",
          text: "Sorry, an error occurred. Please try again.",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">
        <header className="flex-none flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
          <div>
            <img src="/logo.png" alt="Lanatus Systems" className="h-12" />
          </div>
          <div className="flex items-center">
            <ProfileDropdown user={user} onLogout={logout} />
          </div>
        </header>

        <div ref={chatContainerRef} className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto h-full flex flex-col px-4 md:px-6">
            <ChatWindow messages={messages} />
            {loading && (
              <div className="text-sm ml-4 text-gray-500 mb-2">Responding…</div>
            )}
          </div>
        </div>

        <div className="flex-none bg-gray-100">
          <div className="max-w-2xl mx-auto px-4 md:px-6">
            <ChatInput
              onSend={handleSend}
              disabled={loading}
              hasMessages={messages.length > 0}
            />
          </div>
        </div>
      </div>
    </>
  );
}
