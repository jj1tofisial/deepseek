import { assets } from "@/assets/assets";
import Image from "next/image";
import React, { useState } from "react";

const PromptBox = ({ setIsLoading, isLoading }) => {
  const [prompt, setPrompt] = useState("");

  return (
    <form
      className={`w-full ${
        false ? "max-w-3xl" : "max-w-2xl"
      } bg-[#404045] p-4 rounded-3xl mt-4 transition-all`}
    >
      <textarea
        className="outline-none w-full resize-none overflow-hidden break-words bg-transparent text-white"
        rows={2}
        placeholder="Message DeepSeek"
        required
        onChange={(e) => setPrompt(e.target.value)}
        value={prompt}
      />

      <div className="flex items-center justify-between text-sm mt-2">
        <div className="flex items-center gap-2">
          {/* DeepThink */}
          <div className="relative group">
            <p className="flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition">
              <Image
                src={assets.deepthink_icon}
                alt=""
                width={20}
                height={20}
              />
              DeepThink (R1)
            </p>
            <span
              className="absolute left-0 -translate-x-full top-1/2 -translate-y-1/2 hidden group-hover:flex
               bg-black text-white text-[10px] px-2 py-1 rounded-md whitespace-nowrap z-10
               after:content-[''] after:absolute after:right-[-6px] after:top-1/2 after:-translate-y-1/2
               after:border-4 after:border-transparent after:border-l-black"
            >
              Think before responding to solve reasoning problems
            </span>
          </div>

          {/* Search */}
          <div className="relative group">
            <p className="flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition">
              <Image src={assets.search_icon} alt="" width={20} height={20} />
              Search
            </p>
            <span
              className="absolute right-0 translate-x-full top-1/2 -translate-y-1/2 hidden group-hover:flex
               bg-black text-white text-[10px] px-2 py-1 rounded-md whitespace-nowrap z-10
               after:content-[''] after:absolute after:left-[-6px] after:top-1/2 after:-translate-y-1/2
               after:border-4 after:border-transparent after:border-r-black"
            >
              Search the web when necessary
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Pin Icon with Tooltip */}
          <div className="relative group">
            <Image
              src={assets.pin_icon}
              alt=""
              width={16}
              height={16}
              className="cursor-pointer"
            />
            <div
              className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center
               bg-black text-white text-xs px-3 py-2 rounded-md z-10 whitespace-nowrap
               after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2
               after:border-4 after:border-transparent after:border-t-black"
            >
              <span className="text-white text-xs">Text extraction only</span>
              <span className="text-gray-400 text-[10px]">
                Upload docs or Images (Max 50MB, 100MB)
              </span>
            </div>
          </div>

          {/* Send Button */}
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
