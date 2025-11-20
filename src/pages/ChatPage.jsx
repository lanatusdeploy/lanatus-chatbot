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
      const res = await sendMessageToN8n(processedText, user.name);
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
        <header className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
          <div>
            <h1 className="text-xl font-semibold bg-linear-to-r from-gray-600 to-gray-400 bg-clip-text text-transparent">
              Lanatus Systems
            </h1>
          </div>
          <div className="flex items-center">
            <ProfileDropdown user={user} onLogout={logout} />
          </div>
        </header>

        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto pt-[73px] scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="max-w-2xl mx-auto h-full flex flex-col px-4 md:px-6">
            <ChatWindow messages={messages} />
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-10 bg-gray-100">
          <div className="max-w-2xl mx-auto px-4 md:px-6">
            {loading && (
              <div className="text-sm ml-4 text-gray-500 mb-2">
                Responding…
              </div>
            )}
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
