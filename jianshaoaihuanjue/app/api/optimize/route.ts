import { NextRequest, NextResponse } from 'next/server';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const SUFFIX = ' 请提供主要观点的3个不同出处的网页链接以便我查验。如果你不知道或查不到,就实说,不要编造';

export async function POST(request: NextRequest) {
  try {
    // 1. Validate API key
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'DEEPSEEK_API_KEY not configured' },
        { status: 500 }
      );
    }

    // 2. Parse and validate request body
    const body = await request.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // 3. Call DeepSeek API to analyze domain and generate expert prefix
    const prefix = await generateExpertPrefix(apiKey, prompt);

    // 4. Call DeepSeek API to optimize punctuation and fluency
    const optimizedPrompt = await optimizePunctuation(apiKey, prompt);

    // 5. Construct full text
    const fullText = `${prefix} ${optimizedPrompt}${SUFFIX}`;

    // 6. Return success response
    return NextResponse.json({
      success: true,
      prefix,
      optimizedPrompt,
      suffix: SUFFIX,
      fullText,
    });
  } catch (error: any) {
    // Handle network errors or DeepSeek API failures
    const errorMessage = error.message?.toLowerCase() || '';
    const isNetworkError =
      errorMessage.includes('fetch') ||
      errorMessage.includes('network') ||
      errorMessage.includes('deepseek api error') ||
      error.name === 'TypeError' ||
      error.cause?.code === 'ECONNREFUSED';

    if (isNetworkError) {
      return NextResponse.json(
        { success: false, error: 'DeepSeek service unavailable' },
        { status: 503 }
      );
    }

    // Generic error fallback
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function generateExpertPrefix(apiKey: string, prompt: string): Promise<string> {
  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content:
              '你是一个领域分析专家。根据用户的提示词内容,识别其所属的知识领域,并生成一个简洁的专家角色前缀。格式必须是:"你是 [领域]专家",例如"你是 AI 辅助软件开发专家"、"你是 医学专家"。只返回前缀文本,不要有其他内容。',
          },
          {
            role: 'user',
            content: `请为以下提示词生成专家角色前缀:\n\n${prompt}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 50,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedPrefix = data.choices?.[0]?.message?.content?.trim() || '你是专家';

    return generatedPrefix;
  } catch (error) {
    // If DeepSeek fails, throw to be caught by main handler
    throw error;
  }
}

async function optimizePunctuation(apiKey: string, prompt: string): Promise<string> {
  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content:
              '你是一个文本优化专家。优化用户输入的提示词,修正标点符号错误,提高语句流畅度。保持原意不变,只返回优化后的文本,不要有其他解释。',
          },
          {
            role: 'user',
            content: `优化以下提示词的标点符号和流畅度:\n\n${prompt}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    const optimized = data.choices?.[0]?.message?.content?.trim() || prompt;

    return optimized;
  } catch (error) {
    // If optimization fails, return original prompt
    return prompt;
  }
}
