import { describe, it, expect, beforeEach, vi } from 'vitest';
import { POST } from '../../app/api/optimize/route';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';

describe('/api/optimize endpoint', () => {
  const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

  beforeEach(() => {
    // Reset environment variables before each test
    delete process.env.DEEPSEEK_API_KEY;
  });

  describe('Domain-specific prefix generation', () => {
    it('should return programming expert prefix for programming-related prompts', async () => {
      // GIVEN: API key is configured and user submits programming prompt
      process.env.DEEPSEEK_API_KEY = 'test-api-key';
      const request = new Request('http://localhost:3000/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: '请问氛围编程这个提法是谁在什么时候提出的' }),
      });

      // Mock DeepSeek API response
      server.use(
        http.post(DEEPSEEK_API_URL, () => {
          return HttpResponse.json({
            choices: [
              {
                message: {
                  role: 'assistant',
                  content: '你是 AI 辅助软件开发专家',
                },
              },
            ],
          });
        })
      );

      // WHEN: API endpoint is called
      const response = await POST(request);
      const data = await response.json();

      // THEN: Response includes programming expert prefix
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.prefix).toBe('你是 AI 辅助软件开发专家');
      expect(data.prefix).not.toBe('你是专家 '); // Different from static mode
    });

    it('should return medical expert prefix for medical-related prompts', async () => {
      // GIVEN: API key is configured and user submits medical prompt
      process.env.DEEPSEEK_API_KEY = 'test-api-key';
      const request = new Request('http://localhost:3000/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: '什么是糖尿病的早期症状' }),
      });

      server.use(
        http.post(DEEPSEEK_API_URL, () => {
          return HttpResponse.json({
            choices: [
              {
                message: {
                  role: 'assistant',
                  content: '你是 医学专家',
                },
              },
            ],
          });
        })
      );

      // WHEN: API endpoint processes the request
      const response = await POST(request);
      const data = await response.json();

      // THEN: Response includes medical expert prefix
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.prefix).toContain('医学');
    });
  });

  describe('Hallucination-reduction suffix', () => {
    it('should append standard suffix to all optimized prompts', async () => {
      // GIVEN: API key is configured
      process.env.DEEPSEEK_API_KEY = 'test-api-key';
      const request = new Request('http://localhost:3000/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: '什么是机器学习' }),
      });

      server.use(
        http.post(DEEPSEEK_API_URL, () => {
          return HttpResponse.json({
            choices: [
              {
                message: {
                  role: 'assistant',
                  content: '你是 AI 专家',
                },
              },
            ],
          });
        })
      );

      // WHEN: API constructs the full optimized text
      const response = await POST(request);
      const data = await response.json();

      // THEN: Suffix is appended correctly
      const expectedSuffix =
        ' 请提供主要观点的3个不同出处的网页链接以便我查验。如果你不知道或查不到,就实说,不要编造';
      expect(data.success).toBe(true);
      expect(data.suffix).toBe(expectedSuffix);
      expect(data.fullText).toContain(expectedSuffix);
      expect(data.fullText).toBe(`${data.prefix} ${data.optimizedPrompt}${data.suffix}`);
    });
  });

  describe('Error handling - Missing API key', () => {
    it('should return 500 error when API key is not configured', async () => {
      // GIVEN: DEEPSEEK_API_KEY is not set
      delete process.env.DEEPSEEK_API_KEY;
      const request = new Request('http://localhost:3000/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: '什么是机器学习' }),
      });

      // WHEN: API endpoint is called
      const response = await POST(request);
      const data = await response.json();

      // THEN: Returns 500 error with descriptive message
      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('DEEPSEEK_API_KEY not configured');
    });

    it('should not make external API call when key is missing', async () => {
      // GIVEN: DEEPSEEK_API_KEY is not set
      delete process.env.DEEPSEEK_API_KEY;
      const request = new Request('http://localhost:3000/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: '什么是机器学习' }),
      });

      // Mock DeepSeek API to track if it's called
      let apiCalled = false;
      server.use(
        http.post(DEEPSEEK_API_URL, () => {
          apiCalled = true;
          return HttpResponse.json({ choices: [] });
        })
      );

      // WHEN: API endpoint is called
      await POST(request);

      // THEN: No external API call is made
      expect(apiCalled).toBe(false);
    });
  });

  describe('Error handling - DeepSeek service unavailable', () => {
    it('should return 503 error when DeepSeek API is unreachable', async () => {
      // GIVEN: API key is configured but DeepSeek API is down
      process.env.DEEPSEEK_API_KEY = 'test-api-key';
      const request = new Request('http://localhost:3000/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: '什么是机器学习' }),
      });

      // Mock network error
      server.use(
        http.post(DEEPSEEK_API_URL, () => {
          return HttpResponse.error();
        })
      );

      // WHEN: API endpoint attempts to call DeepSeek
      const response = await POST(request);
      const data = await response.json();

      // THEN: Returns 503 error
      expect(response.status).toBe(503);
      expect(data.success).toBe(false);
      expect(data.error).toBe('DeepSeek service unavailable');
    });
  });

  describe('Punctuation and fluency optimization', () => {
    it('should optimize punctuation by adding missing question mark', async () => {
      // GIVEN: User submits prompt without proper punctuation
      process.env.DEEPSEEK_API_KEY = 'test-api-key';
      const request = new Request('http://localhost:3000/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: '请问氛围编程这个提法是谁在什么时候提出的' }),
      });

      server.use(
        http.post(DEEPSEEK_API_URL, async ({ request }) => {
          const body = (await request.json()) as any;
          const userMessage = body.messages?.find((m: any) => m.role === 'user')?.content || '';

          // Return both prefix and optimized prompt
          if (userMessage.includes('优化以下提示词')) {
            return HttpResponse.json({
              choices: [
                {
                  message: {
                    role: 'assistant',
                    content: '请问氛围编程这个提法是谁在什么时候提出的?',
                  },
                },
              ],
            });
          }

          return HttpResponse.json({
            choices: [
              {
                message: {
                  role: 'assistant',
                  content: '你是 AI 辅助软件开发专家',
                },
              },
            ],
          });
        })
      );

      // WHEN: DeepSeek API processes the prompt
      const response = await POST(request);
      const data = await response.json();

      // THEN: Optimized prompt includes question mark
      expect(data.success).toBe(true);
      expect(data.optimizedPrompt).toMatch(/[?。!]/); // Should end with punctuation
    });
  });

  describe('Request validation', () => {
    it('should return 400 error when prompt is missing', async () => {
      // GIVEN: Request without prompt
      process.env.DEEPSEEK_API_KEY = 'test-api-key';
      const request = new Request('http://localhost:3000/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      // WHEN: API endpoint validates the request
      const response = await POST(request);
      const data = await response.json();

      // THEN: Returns 400 error
      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Prompt is required');
    });

    it('should return 400 error when prompt is empty or whitespace', async () => {
      // GIVEN: Request with whitespace-only prompt
      process.env.DEEPSEEK_API_KEY = 'test-api-key';
      const request = new Request('http://localhost:3000/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: '   \n  ' }),
      });

      // WHEN: API endpoint validates the request
      const response = await POST(request);
      const data = await response.json();

      // THEN: Returns 400 error
      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Prompt is required');
    });
  });

  describe('Response format', () => {
    it('should return correct JSON structure for successful optimization', async () => {
      // GIVEN: Valid request
      process.env.DEEPSEEK_API_KEY = 'test-api-key';
      const request = new Request('http://localhost:3000/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: '什么是机器学习' }),
      });

      server.use(
        http.post(DEEPSEEK_API_URL, () => {
          return HttpResponse.json({
            choices: [
              {
                message: {
                  role: 'assistant',
                  content: '你是 AI 专家',
                },
              },
            ],
          });
        })
      );

      // WHEN: API responds
      const response = await POST(request);
      const data = await response.json();

      // THEN: Response has correct structure
      expect(data).toHaveProperty('success');
      expect(data).toHaveProperty('prefix');
      expect(data).toHaveProperty('optimizedPrompt');
      expect(data).toHaveProperty('suffix');
      expect(data).toHaveProperty('fullText');
      expect(data.success).toBe(true);
      expect(typeof data.prefix).toBe('string');
      expect(typeof data.optimizedPrompt).toBe('string');
      expect(typeof data.suffix).toBe('string');
      expect(typeof data.fullText).toBe('string');
    });
  });
});
