import { assets } from '@/assets/assets';
import Image from 'next/image';
import React, { useEffect } from 'react';
import Markdown from 'react-markdown';
import Prism from 'prismjs';
import toast from 'react-hot-toast';

const Message = ({ role, content, onRegenerate, isLoading }) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [content]);

  const copyMessage = () => {
    navigator.clipboard.writeText(content);
    toast.success("Copied!");
  };

  return (
    <div className="flex flex-col items-center w-full max-w-3xl text-sm">
      <div className={`relative w-full mb-8 ${role === 'user' ? 'flex flex-col items-end' : ''}`}>
        <div
          className={`group relative flex max-w-2xl py-3 rounded-xl ${
            role === 'user' ? 'bg-[#414158] px-5' : 'gap-3'
          }`}
        >
          {role === 'user' ? (
            <>
              <span className="text-white/90 whitespace-pre-wrap break-words">{content}</span>
              <div className="opacity-0 group-hover:opacity-100 absolute -left-16 top-2.5 transition-all flex items-center gap-2 opacity-70">
                <div className="relative group/tooltip">
                  <Image onClick={copyMessage} src={assets.copy_icon} alt="Copy" className="w-4 cursor-pointer" />
                  <div className="absolute -top-9 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <span className="bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 transition-opacity shadow-lg">
                      Copy
                    </span>
                    <div className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-black opacity-0 group-hover/tooltip:opacity-100 transition-opacity -mt-1" />
                  </div>
                </div>
                <div className="relative group/tooltip">
                  <Image src={assets.pencil_icon} alt="Edit" className="w-[18px] cursor-pointer" />
                  <div className="absolute -top-9 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <span className="bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 transition-opacity shadow-lg">
                      Edit
                    </span>
                    <div className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-black opacity-0 group-hover/tooltip:opacity-100 transition-opacity -mt-1" />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <Image
                src={assets.logo_icon}
                alt="Assistant Logo"
                className="h-9 w-9 p-1 border border-white/15 rounded-full flex-shrink-0"
              />
              <div className="flex-1">
                <div className="prose max-w-full text-sm prose-div:mb-2 prose-div:leading-relaxed prose-pre:my-2 prose-pre:rounded-md prose-pre:bg-gray-100 prose-pre:p-2 prose-pre:text-xs prose-code:bg-gray-200 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-[13px] whitespace-pre-wrap break-words">
                  <Markdown
                    components={{
                      code({ inline, className, children }) {
                        const text = String(children).replace(/\n$/, '');
                        if (inline) {
                          return <code className={className}>{text}</code>;
                        }
                        return (
                          <pre className={className}>
                            <code>{text}</code>
                          </pre>
                        );
                      },
                      p({ children }) {
                        const isCodeOnly =
                          children.length === 1 && children[0]?.type === 'pre';

                        return isCodeOnly ? (
                          <>{children}</>
                        ) : (
                          <div className="mb-2 leading-relaxed text-[14px]">{children}</div>
                        );
                      },
                      li({ children }) {
                        return <li className="ml-4 list-disc text-[14px]">{children}</li>;
                      },
                      h3({ children }) {
                        return <h3 className="mt-4 text-[15px] font-semibold">{children}</h3>;
                      },
                      em({ children }) {
                        return <em className="text-gray-600">{children}</em>;
                      },
                      strong({ children }) {
                        return <strong className="font-semibold text-white">{children}</strong>;
                      },
                    }}
                  >
                    {content}
                  </Markdown>
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-all flex items-center gap-3 opacity-70 mt-2 ml-0">
                  <div className="relative group/tooltip">
                    <Image onClick={copyMessage} src={assets.copy_icon} alt="Copy" className="w-[18px] cursor-pointer" />
                    <div className="absolute -top-9 left-1/2 -translate-x-1/2 flex flex-col items-center">
                      <span className="bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 transition-opacity shadow-lg">
                        Copy
                      </span>
                      <div className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-black opacity-0 group-hover/tooltip:opacity-100 transition-opacity -mt-1" />
                    </div>
                  </div>

                  <div className="relative group/tooltip">
                    <Image
                      src={assets.regenerate_icon}
                      alt="Regenerate"
                      className={`w-4 cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => {
                        if (!isLoading && onRegenerate) {
                          onRegenerate();
                        }
                      }}
                    />
                    <div className="absolute -top-9 left-1/2 -translate-x-1/2 flex flex-col items-center">
                      <span className="bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 transition-opacity shadow-lg">
                        {isLoading ? 'Regenerating...' : 'Regenerate'}
                      </span>
                      <div className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-black opacity-0 group-hover/tooltip:opacity-100 transition-opacity -mt-1" />
                    </div>
                  </div>

                  <div className="relative group/tooltip">
                    <Image src={assets.like_icon} alt="Like" className="w-4 cursor-pointer" />
                    <div className="absolute -top-9 left-1/2 -translate-x-1/2 flex flex-col items-center">
                      <span className="bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 transition-opacity shadow-lg">
                        Like
                      </span>
                      <div className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-black opacity-0 group-hover/tooltip:opacity-100 transition-opacity -mt-1" />
                    </div>
                  </div>

                  <div className="relative group/tooltip">
                    <Image src={assets.dislike_icon} alt="Dislike" className="w-4 cursor-pointer" />
                    <div className="absolute -top-9 left-1/2 -translate-x-1/2 flex flex-col items-center">
                      <span className="bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 transition-opacity shadow-lg">
                        Dislike
                      </span>
                      <div className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-black opacity-0 group-hover/tooltip:opacity-100 transition-opacity -mt-1" />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
