# Implementation Tasks

## 1. Test Infrastructure Setup
- [x] 1.1 Install testing dependencies (vitest, @vitest/ui, msw for API mocking)
- [x] 1.2 Configure vitest.config.ts for Next.js environment
- [x] 1.3 Create `__tests__/api/` directory structure
- [x] 1.4 Set up MSW (Mock Service Worker) for DeepSeek API mocking

## 2. API-Level Tests (TDD - Write First)
- [x] 2.1 Write test: DeepSeek API endpoint returns domain-specific prefix
- [x] 2.2 Write test: API correctly appends hallucination-reduction suffix
- [x] 2.3 Write test: API handles missing API key error (returns 500)
- [x] 2.4 Write test: API handles DeepSeek service unavailable (returns 503)
- [x] 2.5 Write test: API optimizes punctuation and fluency
- [x] 2.6 Run tests and verify they fail (no implementation yet)

## 3. DeepSeek API Integration
- [x] 3.1 Create `.env.example` with DEEPSEEK_API_KEY placeholder
- [x] 3.2 Add `.env.local` to `.gitignore` (if not already present)
- [x] 3.3 Create `app/api/optimize/route.ts` Next.js API endpoint
- [x] 3.4 Implement DeepSeek API client (fetch to DeepSeek endpoint)
- [x] 3.5 Implement domain analysis logic (extract topic from user prompt)
- [x] 3.6 Implement expert prefix generation via DeepSeek
- [x] 3.7 Implement suffix appending and text fluency optimization
- [x] 3.8 Add error handling for API failures

## 4. UI Updates
- [x] 4.1 Add second button "应对未知与复杂" to page.tsx
- [x] 4.2 Implement `handleDeepSeekOptimize` function (calls /api/optimize)
- [x] 4.3 Add loading state during API call (disable button, show spinner)
- [x] 4.4 Add visual distinction for AI-optimized prompts (different border/badge color)
- [x] 4.5 Implement error toast component (red theme, 10-second auto-dismiss)
- [x] 4.6 Add error toast to UI when API call fails

## 5. Testing and Validation
- [x] 5.1 Run API tests and fix any failures
- [x] 5.2 Manual test: "查询常识" still works with static prefix
- [x] 5.3 Manual test: "应对未知与复杂" calls DeepSeek and shows different output
- [x] 5.4 Manual test: Error toast appears when API key is missing
- [x] 5.5 Manual test: Responsive layout with two buttons (mobile/desktop)
- [x] 5.6 Verify visual distinction between static and AI-optimized prompts

## 6. Documentation
- [x] 6.1 Update README.md with DeepSeek API setup instructions
- [x] 6.2 Document environment variable requirements
- [x] 6.3 Add example prompts for testing both optimization modes
