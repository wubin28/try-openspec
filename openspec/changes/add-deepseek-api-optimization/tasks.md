# Implementation Tasks

## 1. Test Infrastructure Setup
- [ ] 1.1 Install testing dependencies (vitest, @vitest/ui, msw for API mocking)
- [ ] 1.2 Configure vitest.config.ts for Next.js environment
- [ ] 1.3 Create `__tests__/api/` directory structure
- [ ] 1.4 Set up MSW (Mock Service Worker) for DeepSeek API mocking

## 2. API-Level Tests (TDD - Write First)
- [ ] 2.1 Write test: DeepSeek API endpoint returns domain-specific prefix
- [ ] 2.2 Write test: API correctly appends hallucination-reduction suffix
- [ ] 2.3 Write test: API handles missing API key error (returns 500)
- [ ] 2.4 Write test: API handles DeepSeek service unavailable (returns 503)
- [ ] 2.5 Write test: API optimizes punctuation and fluency
- [ ] 2.6 Run tests and verify they fail (no implementation yet)

## 3. DeepSeek API Integration
- [ ] 3.1 Create `.env.example` with DEEPSEEK_API_KEY placeholder
- [ ] 3.2 Add `.env.local` to `.gitignore` (if not already present)
- [ ] 3.3 Create `app/api/optimize/route.ts` Next.js API endpoint
- [ ] 3.4 Implement DeepSeek API client (fetch to DeepSeek endpoint)
- [ ] 3.5 Implement domain analysis logic (extract topic from user prompt)
- [ ] 3.6 Implement expert prefix generation via DeepSeek
- [ ] 3.7 Implement suffix appending and text fluency optimization
- [ ] 3.8 Add error handling for API failures

## 4. UI Updates
- [ ] 4.1 Add second button "应对未知与复杂" to page.tsx
- [ ] 4.2 Implement `handleDeepSeekOptimize` function (calls /api/optimize)
- [ ] 4.3 Add loading state during API call (disable button, show spinner)
- [ ] 4.4 Add visual distinction for AI-optimized prompts (different border/badge color)
- [ ] 4.5 Implement error toast component (red theme, 10-second auto-dismiss)
- [ ] 4.6 Add error toast to UI when API call fails

## 5. Testing and Validation
- [ ] 5.1 Run API tests and fix any failures
- [ ] 5.2 Manual test: "查询常识" still works with static prefix
- [ ] 5.3 Manual test: "应对未知与复杂" calls DeepSeek and shows different output
- [ ] 5.4 Manual test: Error toast appears when API key is missing
- [ ] 5.5 Manual test: Responsive layout with two buttons (mobile/desktop)
- [ ] 5.6 Verify visual distinction between static and AI-optimized prompts

## 6. Documentation
- [ ] 6.1 Update README.md with DeepSeek API setup instructions
- [ ] 6.2 Document environment variable requirements
- [ ] 6.3 Add example prompts for testing both optimization modes
