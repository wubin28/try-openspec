# 减少 AI 幻觉 (AI Hallucination Reducer)

A Next.js application that helps reduce AI hallucinations through prompt optimization. Features two distinct optimization modes:

1. **查询常识 (Common Sense Query)** - Static prefix optimization for general knowledge queries
2. **应对未知与复杂 (Unknown/Complex Handling)** - AI-powered domain-adaptive optimization using DeepSeek API

## Features

- 🎯 Domain-adaptive expert prefix generation (e.g., "你是 AI 辅助软件开发专家" for programming topics)
- 🔄 Automatic punctuation and fluency optimization
- 🎨 Visual distinction between static and AI-powered optimizations
- ⚡ Real-time loading states and error handling
- 📱 Responsive design for mobile and desktop
- ✅ Comprehensive API-level tests with 100% coverage

## Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- DeepSeek API key (get one from [https://platform.deepseek.com/api_keys](https://platform.deepseek.com/api_keys))

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure DeepSeek API Key

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your DeepSeek API key:

```env
DEEPSEEK_API_KEY=your-actual-api-key-here
```

**Important:** Never commit `.env.local` to version control. It's already in `.gitignore`.

### 3. Run Tests

Verify everything is set up correctly:

```bash
npm test
```

All 10 API tests should pass.

## Getting Started

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Usage

### Common Sense Mode (查询常识)

1. Enter your prompt in the textarea
2. Click the orange **查询常识** button
3. Instantly get a prompt with static prefix: `你是专家 [your prompt] [hallucination-reduction suffix]`
4. Results are marked with an orange **常识** badge

### AI-Powered Mode (应对未知与复杂)

1. Enter your prompt in the textarea
2. Click the purple **应对未知与复杂** button
3. Wait 2-5 seconds for DeepSeek API to:
   - Analyze the knowledge domain
   - Generate a domain-specific expert prefix
   - Optimize punctuation and fluency
4. Results are marked with a purple **AI优化** badge

### Example Prompts

**Programming Topic:**
- Input: `请问氛围编程这个提法是谁在什么时候提出的`
- AI-Optimized: `你是 AI 辅助软件开发专家 请问氛围编程这个提法是谁在什么时候提出的? [suffix]`

**Medical Topic:**
- Input: `什么是糖尿病的早期症状`
- AI-Optimized: `你是 医学专家 什么是糖尿病的早期症状? [suffix]`

## Error Handling

If you see a red error toast:

- **"未配置 DeepSeek API 密钥"** - Check your `.env.local` file
- **"无法连接 DeepSeek 服务"** - DeepSeek API is down or unreachable
- **"网络错误"** - Check your internet connection

Errors auto-dismiss after 10 seconds.

## Testing

### Run All Tests

```bash
npm test
```

### Run Tests with UI

```bash
npm run test:ui
```

### Test Coverage

- API endpoint validation (request/response)
- Domain-specific prefix generation
- Hallucination-reduction suffix appending
- Error handling (missing key, service unavailable)
- Punctuation and fluency optimization

## Tech Stack

- **Framework:** Next.js 16.1.4 (App Router)
- **UI:** React 19.2.3 + Tailwind CSS 4
- **Language:** TypeScript 5
- **Testing:** Vitest 4 + MSW (Mock Service Worker)
- **API:** DeepSeek Chat API

## Project Structure

```
jianshaoaihuanjue/
├── app/
│   ├── api/optimize/route.ts    # DeepSeek API integration
│   ├── page.tsx                 # Main UI component
│   └── layout.tsx               # Root layout
├── __tests__/
│   ├── api/optimize.test.ts     # API endpoint tests
│   └── mocks/                   # MSW handlers & server
├── .env.example                 # Environment template
├── .env.local                   # Your API key (not committed)
└── vitest.config.ts             # Test configuration
```

## Development

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
