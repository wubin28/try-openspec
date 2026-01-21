'use client'

import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [enhancedPrompts, setEnhancedPrompts] = useState<string[]>([]);
  const outputRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleEnhance = () => {
    if (inputPrompt.trim() === '') return;

    const prefix = '你是专家 ';
    const suffix = ' 请提供主要观点的3个不同出处的网页链接以便我查验。如果你不知道或查不到,就实说,不要编造';
    const enhanced = `${prefix}${inputPrompt}${suffix}`;

    setEnhancedPrompts(prev => [...prev, enhanced]);
    setInputPrompt('');

    // Focus back to textarea for next input
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 150);
  };

  useEffect(() => {
    if (enhancedPrompts.length > 0 && outputRef.current) {
      setTimeout(() => {
        outputRef.current?.scrollTo({
          top: outputRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
    }
  }, [enhancedPrompts]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <main className="w-full max-w-4xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-orange-800 mb-6 text-center">
          减少 AI 幻觉
        </h1>

        {enhancedPrompts.length > 0 && (
          <div
            ref={outputRef}
            className="mb-6 max-h-80 overflow-y-auto bg-white rounded-lg border-2 border-orange-200 p-4 space-y-3"
            role="region"
            aria-label="增强后的提示词"
          >
            {enhancedPrompts.map((prompt, index) => (
              <div
                key={index}
                className="p-3 bg-orange-50 border border-orange-300 rounded-md text-gray-800 whitespace-pre-wrap"
              >
                {prompt}
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <textarea
            ref={textareaRef}
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            rows={6}
            placeholder="请输入您的提示词..."
            aria-label="输入提示词"
            className="flex-grow px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 resize-none text-base"
          />
          <button
            onClick={handleEnhance}
            aria-label="查询常识"
            className="px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 active:bg-orange-800 transition-colors duration-200 sm:w-auto w-full min-h-[44px] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            查询常识
          </button>
        </div>
      </main>
    </div>
  );
}
