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

  const sendPrompt = async (e) => {
    e.preventDefault();
    const promptCopy = prompt;

    try {
      if (!user) return toast.error("Login to send message");
      if (!selectedChat) return toast.error("No chat selected");
      if (isLoading) return toast.error("Wait for the previous response");

      setIsLoading(true);
      setPrompt("");

      const userPrompt = {
        role: "user",
        content: prompt,
        timestamp: Date.now(),
      };

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

      const { data } = await axios.post("/api/chat/ai", {
        chatId: selectedChat._id,
        prompt,
      });

      if (data.success) {
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat._id === selectedChat._id
              ? { ...chat, messages: [...chat.messages, data.data] }
              : chat
          )
        );

        const message = data.data.content;
        const messageTokens = message.split(" ");
        let assistantMessage = {
          role: "assistant",
          content: "",
          timestamp: Date.now(),
        };

        setSelectedChat((prev) => ({
          ...prev,
          messages: [...prev.messages, assistantMessage],
        }));

        for (let i = 0; i < messageTokens.length; i++) {
          setTimeout(() => {
            assistantMessage.content = messageTokens.slice(0, i + 1).join(" ");
            setSelectedChat((prev) => {
              const updatedMessages = [
                ...prev.messages.slice(0, -1),
                assistantMessage,
              ];
              return { ...prev, messages: updatedMessages };
            });
          }, i * 100);
        }
      } else {
        toast.error(data.message);
        setPrompt(promptCopy);
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
            className={`${
              prompt ? "bg-primary" : "bg-[#71717a]"
            } rounded-full p-2 cursor-pointer`}
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
