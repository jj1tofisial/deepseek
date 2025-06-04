"use client";
import { assets } from "@/assets/assets";
import Image from "next/image";
import React, { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";

const PromptBox = ({ setIsLoading, isLoading }) => {
  const [prompt, setPrompt] = useState("");
  const { user, chats, setChats, selectedChat, setSelectedChat } = useAppContext();

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendPrompt(e);
    }
  };

  const generateTitle = async (userPrompt, assistantReply) => {
    try {
      const { data } = await axios.post("/api/chat/title", {
        prompt: `Generate a short and descriptive title (max 5 words) for this conversation:\nUser: ${userPrompt}\nAssistant: ${assistantReply}`,
      });
      if (data.success && data.title) return data.title;
    } catch (err) {
      console.error("Title generation failed", err.message);
    }
    return null;
  };

  const sendPrompt = async (e) => {
    e.preventDefault();
    const promptCopy = prompt.trim();
    if (!promptCopy) return;

    try {
      if (!user) return toast.error("Login to send message");
      if (!selectedChat) return toast.error("No chat selected");
      if (isLoading) return toast.error("Wait for the previous response");

      setIsLoading(true);
      setPrompt("");

      const userPrompt = {
        role: "user",
        content: promptCopy,
        timestamp: Date.now(),
      };

      // Save message count before adding user message
      const prevMessageCount = selectedChat.messages.length;

      // Add user message locally
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === selectedChat._id
            ? { ...chat, messages: [...chat.messages, userPrompt] }
            : chat
        )
      );
      setSelectedChat((prev) => ({
        ...prev,
        messages: [...prev.messages, userPrompt],
      }));

      // Request AI response
      const { data } = await axios.post("/api/chat/ai", {
        chatId: selectedChat._id,
        prompt: promptCopy,
      });

      if (!data.success) {
        toast.error(data.message || "AI response failed");
        setPrompt(promptCopy);
        setIsLoading(false);
        return;
      }

      const assistantReply = data.data.content;

      // Create assistant message object for animation
      const assistantMessage = {
        role: "assistant",
        content: "",
        timestamp: Date.now(),
      };

      // Add assistant message with empty content first to selectedChat (for animation)
      setSelectedChat((prev) => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
      }));

      // Animate assistant reply word by word
      const words = assistantReply.split(" ");
      for (let i = 0; i < words.length; i++) {
        // Delay word animation with a small pause
        await new Promise((r) => setTimeout(r, i === 0 ? 0 : 100));
        assistantMessage.content = words.slice(0, i + 1).join(" ");
        setSelectedChat((prev) => {
          const updatedMessages = [...prev.messages];
          updatedMessages[updatedMessages.length - 1] = { ...assistantMessage };
          return { ...prev, messages: updatedMessages };
        });
      }

      // Now that animation finished, add full assistant message to chats list
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === selectedChat._id
            ? {
                ...chat,
                messages: [...chat.messages, { role: "assistant", content: assistantReply, timestamp: Date.now() }],
              }
            : chat
        )
      );

      // Rename chat only if this is the first AI reply (i.e., before user message there were 0 messages)
      if (prevMessageCount === 0) {
        const newTitle = await generateTitle(promptCopy, assistantReply);
        if (newTitle) {
          const renameRes = await axios.post("/api/chat/rename", {
            chatId: selectedChat._id,
            name: newTitle,
          });

          if (renameRes.data.success) {
            // Update chat title locally
            setChats((prevChats) =>
              prevChats.map((chat) =>
                chat._id === selectedChat._id ? { ...chat, name: newTitle } : chat
              )
            );
            setSelectedChat((prev) => ({ ...prev, name: newTitle }));
          }
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      setPrompt(promptCopy);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={sendPrompt}
      className={`w-full ${
        selectedChat?.messages?.length > 0 ? "max-w-3xl" : "max-w-2xl"
      } bg-[#404045] p-4 rounded-3xl mt-4 transition-all`}
    >
      <textarea
        onKeyDown={handleKeyDown}
        className="outline-none w-full resize-none overflow-hidden break-words bg-transparent text-white"
        rows={2}
        placeholder="Message DeepSeek"
        required
        onChange={(e) => setPrompt(e.target.value)}
        value={prompt}
        disabled={isLoading}
      />

      <div className="flex items-center justify-between text-sm mt-2">
        <div className="flex items-center gap-2">
          <div className="relative group">
            <p className="flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition">
              <Image src={assets.deepthink_icon} alt="" width={20} height={20} />
              DeepThink (R1)
            </p>
            <span className="absolute left-0 -translate-x-full top-1/2 -translate-y-1/2 hidden group-hover:flex bg-black text-white text-[10px] px-2 py-1 rounded-md whitespace-nowrap z-10 after:content-[''] after:absolute after:right-[-6px] after:top-1/2 after:-translate-y-1/2 after:border-4 after:border-transparent after:border-l-black">
              Think before responding to solve reasoning problems
            </span>
          </div>

          <div className="relative group">
            <p className="flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition">
              <Image src={assets.search_icon} alt="" width={20} height={20} />
              Search
            </p>
            <span className="absolute right-0 translate-x-full top-1/2 -translate-y-1/2 hidden group-hover:flex bg-black text-white text-[10px] px-2 py-1 rounded-md whitespace-nowrap z-10 after:content-[''] after:absolute after:left-[-6px] after:top-1/2 after:-translate-y-1/2 after:border-4 after:border-transparent after:border-r-black">
              Search the web when necessary
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative group">
            <Image
              src={assets.pin_icon}
              alt=""
              width={16}
              height={16}
              className="cursor-pointer"
            />
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center bg-black text-white text-xs px-3 py-2 rounded-md z-10 whitespace-nowrap after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-black">
              <span className="text-white text-xs">Text extraction only</span>
              <span className="text-gray-400 text-[10px]">
                Upload docs or Images (Max 50MB, 100MB)
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`${
              prompt ? "bg-primary" : "bg-[#71717a]"
            } rounded-full p-2 cursor-pointer ${isLoading ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            <Image
              src={prompt ? assets.arrow_icon : assets.arrow_icon_dull}
              alt=""
              width={14}
              height={14}
              className="aspect-square"
            />
          </button>
        </div>
      </div>
    </form>
  );
};

export default PromptBox;
