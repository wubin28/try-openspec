import { http, HttpResponse } from 'msw';

// DeepSeek API base URL
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

export const handlers = [
  // Mock successful DeepSeek API response for programming topic
  http.post(DEEPSEEK_API_URL, async ({ request }) => {
    const body = await request.json() as any;
    const userMessage = body.messages?.find((m: any) => m.role === 'user')?.content || '';

    // Simulate domain analysis and prefix generation
    let prefix = '你是专家';

    if (userMessage.includes('编程') || userMessage.includes('代码') || userMessage.includes('软件')) {
      prefix = '你是 AI 辅助软件开发专家';
    } else if (userMessage.includes('医') || userMessage.includes('健康') || userMessage.includes('症状')) {
      prefix = '你是 医学专家';
    } else if (userMessage.includes('历史') || userMessage.includes('文化')) {
      prefix = '你是 历史文化专家';
    }

    return HttpResponse.json({
      choices: [
        {
          message: {
            role: 'assistant',
            content: prefix,
          },
        },
      ],
    });
  }),
];
