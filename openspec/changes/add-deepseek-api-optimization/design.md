# Design Document: DeepSeek API Integration

## Context

The current AI Hallucination Reducer uses a static prefix "你是专家 " for all prompts. This approach lacks domain awareness - a prompt about programming should use a programming expert prefix, while a prompt about medicine should use a medical expert prefix.

**Stakeholders:**
- End users who need more accurate, domain-specific AI responses
- Developers maintaining the codebase (must understand static vs AI-powered modes)

**Constraints:**
- Next.js 16 App Router architecture (server actions, API routes)
- React 19 client-side state management
- No backend database (stateless API calls)
- DeepSeek API key must be configured via environment variable
- Must maintain existing "查询常识" functionality unchanged

## Goals / Non-Goals

**Goals:**
1. Integrate DeepSeek API for intelligent domain analysis
2. Generate context-aware expert prefixes dynamically
3. Clearly differentiate static vs AI-powered optimization in UI
4. Handle API errors gracefully with user-friendly messages
5. Implement TDD workflow with API-level tests first

**Non-Goals:**
- Replacing the existing static optimization (both modes coexist)
- Persistent storage of optimization history
- User authentication or rate limiting
- Streaming responses (simple request-response pattern)
- Custom DeepSeek model fine-tuning

## Decisions

### Decision 1: Next.js API Route vs Server Actions

**Choice:** Use Next.js API Route (`app/api/optimize/route.ts`)

**Rationale:**
- Better separation of concerns (frontend vs backend logic)
- Easier to test in isolation with MSW
- Can be called from client components without mixing server/client code
- Standard REST pattern familiar to developers

**Alternatives considered:**
- Server Actions: More tightly coupled, harder to test independently
- Client-side fetch directly to DeepSeek: Exposes API key to browser (security risk)

### Decision 2: Testing Strategy - TDD with API-Level Tests

**Choice:** Write API endpoint tests first using Vitest + MSW, then implement

**Rationale:**
- Aligns with user requirement (step 0: write tests, see them fail)
- API contract drives implementation design
- Easier to mock DeepSeek responses without hitting real API
- Catches edge cases (missing key, network errors) early

**Alternatives considered:**
- E2E tests only: Too slow for TDD cycle
- No tests: Does not meet requirements
- Unit tests for UI only: Misses API logic validation

### Decision 3: Visual Differentiation - Border Color + Badge

**Choice:** Use different border colors + small badge label

- Static (查询常识): Orange border, badge "常识"
- AI-powered (应对未知与复杂): Blue/purple border, badge "AI优化"

**Rationale:**
- Immediate visual distinction at a glance
- Colorblind-friendly (not relying on color alone, also has text badge)
- Minimal design change, fits existing orange theme

**Alternatives considered:**
- Different background colors: Too visually loud
- Only text labels: Easy to miss
- Icons: Requires icon library dependency

### Decision 4: Error Handling - Toast Notification

**Choice:** Simple toast component (absolute positioned div, auto-dismiss after 10s)

**Rationale:**
- Meets requirement (red theme, 10-second display)
- Non-blocking (doesn't require user action to dismiss)
- Minimal dependency footprint (no toast library needed)

**Implementation:**
```typescript
// State: errorMessage: string | null
// When error occurs: setErrorMessage("无法连接 DeepSeek API")
// useEffect: setTimeout to clear after 10s
```

### Decision 5: DeepSeek API Call Pattern

**Choice:** Two-step API call:
1. Analyze prompt to extract domain → generate expert prefix
2. Return: `{prefix, optimizedPrompt, suffix}`

**Rationale:**
- Keeps frontend simple (just display returned text)
- Backend handles all DeepSeek interaction complexity
- Easy to add fluency optimization in same API call

**API Request:**
```json
POST /api/optimize
{
  "prompt": "请问氛围编程这个提法是谁在什么时候提出的"
}
```

**API Response (success):**
```json
{
  "success": true,
  "prefix": "你是 AI 辅助软件开发专家",
  "optimizedPrompt": "请问氛围编程这个提法是谁在什么时候提出的?",
  "suffix": " 请提供主要观点的3个不同出处的网页链接以便我查验。如果你不知道或查不到,就实说,不要编造",
  "fullText": "{prefix}{optimizedPrompt}{suffix}"
}
```

**API Response (error):**
```json
{
  "success": false,
  "error": "DEEPSEEK_API_KEY not configured"
}
```

## Risks / Trade-offs

### Risk 1: DeepSeek API Latency
**Impact:** User waits 2-5 seconds for AI optimization
**Mitigation:**
- Show loading spinner on button
- Disable button during API call
- Set reasonable timeout (10 seconds)
- Fall back to error message on timeout

### Risk 2: DeepSeek API Costs
**Impact:** Each optimization call costs money
**Mitigation:**
- Document cost implications in README
- Users bring their own API key (cost control)
- No automatic optimization (user must click button)

### Risk 3: Test Flakiness with MSW
**Impact:** Async API mocking can cause intermittent test failures
**Mitigation:**
- Use MSW setup/teardown properly
- Add explicit waitFor assertions
- Run tests multiple times to verify stability

### Trade-off: Two Buttons vs Mode Toggle
**Decision:** Two separate buttons

**Pros:**
- Clear mental model (two distinct actions)
- Faster for users (no toggle step)
- Each button can have its own loading state

**Cons:**
- More UI space required
- Mobile layout needs careful design

**Chosen:** Two buttons (better UX)

## Migration Plan

**Not applicable** - This is an additive change with no breaking changes.

**Rollout:**
1. Deploy with feature enabled immediately
2. Existing users see new button, existing button unchanged
3. New users discover both modes naturally

**Rollback:**
If issues arise, remove:
- Second button from UI
- `/api/optimize` route
- Tests remain (no harm)

## Open Questions

1. **Q:** Should we cache DeepSeek responses for identical prompts?
   **A:** No, for simplicity. May add later if cost becomes issue.

2. **Q:** What if user has no DeepSeek API key?
   **A:** Show error toast, document setup in README. Button remains visible.

3. **Q:** Should we stream the DeepSeek response?
   **A:** No, wait for full response. Streaming adds complexity without major UX benefit for short prompts.

4. **Q:** How to test locally without API key?
   **A:** Tests use MSW to mock API. Manual testing requires real key in `.env.local`.
