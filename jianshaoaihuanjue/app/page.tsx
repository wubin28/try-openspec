'use client'

import { useState, useRef, useEffect } from 'react';

type PromptType = 'static' | 'ai-powered';

interface EnhancedPrompt {
  text: string;
  type: PromptType;
}

export default function Home() {
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [enhancedPrompts, setEnhancedPrompts] = useState<EnhancedPrompt[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleEnhance = () => {
    if (inputPrompt.trim() === '') return;

    const prefix = '你是专家 ';
    const suffix = ' 请提供主要观点的3个不同出处的网页链接以便我查验。如果你不知道或查不到,就实说,不要编造';
    const enhanced = `${prefix}${inputPrompt}${suffix}`;

    setEnhancedPrompts(prev => [...prev, { text: enhanced, type: 'static' }]);
    setInputPrompt('');

    // Focus back to textarea for next input
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 150);
  };

  const handleDeepSeekOptimize = async () => {
    if (inputPrompt.trim() === '') return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: inputPrompt }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        // Show error toast
        setErrorMessage(data.error || '优化失败,请稍后重试');
        return;
      }

      // Add AI-optimized prompt to list
      setEnhancedPrompts(prev => [...prev, { text: data.fullText, type: 'ai-powered' }]);
      setInputPrompt('');

      // Focus back to textarea for next input
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 150);
    } catch (error) {
      setErrorMessage('网络错误,无法连接到服务器');
    } finally {
      setIsLoading(false);
    }
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

  // Auto-dismiss error toast after 10 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      {/* Error Toast */}
      {errorMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4">
          <div className="bg-red-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-start gap-3">
            <div className="flex-1">
              <p className="font-medium">错误</p>
              <p className="text-sm mt-1">{errorMessage}</p>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-white hover:text-red-100 transition-colors"
              aria-label="关闭"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

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
                className={`p-3 rounded-md text-gray-800 whitespace-pre-wrap relative ${
                  prompt.type === 'static'
                    ? 'bg-orange-50 border border-orange-300'
                    : 'bg-purple-50 border border-purple-400'
                }`}
              >
                {/* Badge */}
                <span
                  className={`absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded ${
                    prompt.type === 'static'
                      ? 'bg-orange-200 text-orange-800'
                      : 'bg-purple-200 text-purple-800'
                  }`}
                >
                  {prompt.type === 'static' ? '常识' : 'AI优化'}
                </span>
                <div className="pr-16">{prompt.text}</div>
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
          <div className="flex flex-col gap-2 sm:w-auto w-full">
            <button
              onClick={handleEnhance}
              aria-label="查询常识"
              className="px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 active:bg-orange-800 transition-colors duration-200 w-full min-h-[44px] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              查询常识
            </button>
            <button
              onClick={handleDeepSeekOptimize}
              disabled={isLoading}
              aria-label="应对未知与复杂"
              className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 active:bg-purple-800 transition-colors duration-200 w-full min-h-[44px] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:bg-purple-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>处理中...</span>
                </>
              ) : (
                '应对未知与复杂'
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
