import { useState, useEffect, useRef } from "react";
import { FaRobot, FaTimes, FaPaperPlane } from "react-icons/fa";

const DialogflowChatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hello 👋 I'm your StreamX AI Assistant. How can I help you?",
    },
  ]);
  const [input, setInput] = useState("");

  const bottomRef = useRef(null);

  // AUTO SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // SEND MESSAGE
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { from: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const res = await fetch("https://videostreaming-be-1.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.text }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: data.reply || "🤖 Sorry, I didn't understand.",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠️ Server not running." },
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <>
      {/* FLOATING BUTTON */}
      <div
        onClick={() => setOpen(true)}
        className="
          fixed bottom-4 right-4 sm:bottom-6 sm:right-6
          z-[99999]
          bg-whitek-600 hover:bg-purple-700
          p-3 sm:p-4 rounded-full cursor-pointer
          shadow-2xl transition-transform hover:scale-110
        "
      >
        <FaRobot size={20} className="text-white" />
      </div>

      {/* CHAT WINDOW */}
      {open && (
        <div
          className="
            fixed inset-0 sm:inset-auto
            sm:bottom-6 sm:right-6
            w-full sm:w-80 md:w-96
            h-full sm:h-[500px]
            z-[99999]
            bg-pink-500
            sm:rounded-xl
            shadow-2xl
            flex flex-col
            overflow-hidden
            animate-fade-in
          "
        >
          {/* HEADER */}
          <div className="bg-pink-600 p-3 flex justify-between items-center text-white">
            <span className="font-semibold">StreamX AI</span>

            <FaTimes
              onClick={() => setOpen(false)}
              className="cursor-pointer hover:scale-110 transition"
            />
          </div>

          {/* MESSAGES */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`
                  px-3 py-2 rounded-lg text-sm max-w-[80%]
                  break-words
                  ${
                    msg.from === "user"
                      ? "bg-blue-600 ml-auto text-white"
                      : "bg-green-700 text-white"
                  }
                `}
              >
                {msg.text}
              </div>
            ))}

            <div ref={bottomRef} />
          </div>

          {/* INPUT */}
          <div className="p-2 sm:p-3 bg-purple-800 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="
                flex-1 p-2 rounded
                bg-purple-700 text-white
                outline-none text-sm
              "
            />

            <button
              onClick={sendMessage}
              className="
                bg-red-600 hover:bg-red-700
                px-3 sm:px-4 rounded
                flex items-center justify-center
                transition
              "
            >
              <FaPaperPlane className="text-white" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DialogflowChatbot;