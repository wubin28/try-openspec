# Tasks: Build AI Hallucination Reducer UI

**Change ID:** `build-ai-hallucination-reducer-ui`

## Task Overview

This document outlines the implementation tasks for building the AI Hallucination Reducer UI. Tasks are ordered to deliver user-visible progress incrementally while maintaining a working application state after each step.

---

## Implementation Tasks

### Task 1: Update Page Metadata and Layout Configuration ✓

**Description:** Configure page title, description, and language settings to reflect the AI Hallucination Reducer purpose.

**Files to Modify:**
- `jianshaoaihuanjue/app/layout.tsx`

**Changes:**
- Update `metadata.title` to "减少 AI 幻觉"
- Update `metadata.description` to describe the tool (e.g., "帮助优化 AI 提示词,减少幻觉,提高准确性")
- Update HTML `lang` attribute to "zh" or "zh-CN"

**Acceptance:**
- Browser tab shows "减少 AI 幻觉"
- Meta description is updated
- No console errors

**Dependencies:** None (can start immediately)

**Estimated Complexity:** Low

---

### Task 2: Add Orange Theme CSS Variables ✓

**Description:** Define orange color palette variables in global styles for consistent theming.

**Files to Modify:**
- `jianshaoaihuanjue/app/globals.css`

**Changes:**
- Add CSS custom properties in `:root`:
  - `--primary: #EA580C` (orange-600)
  - `--primary-light: #FED7AA` (orange-200)
  - `--primary-dark: #9A3412` (orange-800)
- Optionally update `--background` and `--foreground` if needed

**Acceptance:**
- CSS variables are defined and accessible
- No visual changes yet (variables are defined but not used)
- Build succeeds without errors

**Dependencies:** None (can be done in parallel with Task 1)

**Estimated Complexity:** Low

---

### Task 3: Create Basic Page Structure with Title ✓

**Description:** Replace the default Next.js welcome page with a basic structure containing the page title.

**Files to Modify:**
- `jianshaoaihuanjue/app/page.tsx`

**Changes:**
- Add `'use client'` directive at top of file
- Remove all default Next.js content (Image imports, links, etc.)
- Create a centered container layout
- Add page title "减少 AI 幻觉" with orange-800 color and appropriate sizing
- Apply basic responsive padding and max-width

**Acceptance:**
- Page displays only the title "减少 AI 幻觉"
- Title is styled with orange theme color
- Title is responsive (2xl on mobile, 3xl on desktop)
- Background is clean (white or light gray)
- No broken imports or console errors

**Dependencies:** Task 1 (metadata), Task 2 (CSS variables)

**Estimated Complexity:** Low

---

### Task 4: Add Input Textarea Component ✓

**Description:** Implement the multi-line textarea for user prompt input with proper styling and state management.

**Files to Modify:**
- `jianshaoaihuanjue/app/page.tsx`

**Changes:**
- Import `useState` from React
- Add state: `const [inputPrompt, setInputPrompt] = useState<string>('')`
- Create `<textarea>` element with:
  - Value bound to `inputPrompt` state
  - `onChange` handler updating state
  - 4-6 rows attribute
  - Placeholder text in Chinese (e.g., "请输入您的提示词...")
  - Tailwind styling: border, padding, rounded corners, orange focus ring
  - Responsive width (full width on mobile, constrained on desktop)

**Acceptance:**
- Textarea is visible below the title
- User can type and see text in real-time
- Textarea supports multiple lines
- Orange theme is applied (focus border color)
- Textarea is responsive

**Dependencies:** Task 3 (basic page structure)

**Estimated Complexity:** Low-Medium

---

### Task 5: Add Enhancement Button ✓

**Description:** Implement the "查询常识" button with orange styling and position it relative to the textarea.

**Files to Modify:**
- `jianshaoaihuanjue/app/page.tsx`

**Changes:**
- Create a flex container wrapping textarea and button
- Add `<button>` element with:
  - Text: "查询常识"
  - `onClick` handler (placeholder function for now)
  - Tailwind styling: orange-600 background, white text, padding, rounded
  - Hover state: orange-700 background
  - Responsive positioning:
    - Mobile (<640px): Full width, below textarea (flex-col)
    - Desktop (≥640px): Fixed width, right of textarea (flex-row)

**Acceptance:**
- Button is visible and clickable
- Button displays "查询常识"
- Orange theme is applied consistently
- Hover state works on desktop
- Button is positioned correctly on mobile (below) and desktop (right)
- Clicking button logs to console or shows alert (temporary)

**Dependencies:** Task 4 (textarea component)

**Estimated Complexity:** Medium

---

### Task 6: Implement Prompt Enhancement Logic ✓

**Description:** Create the core function that generates enhanced prompts by adding prefix and suffix.

**Files to Modify:**
- `jianshaoaihuanjue/app/page.tsx`

**Changes:**
- Add state: `const [enhancedPrompts, setEnhancedPrompts] = useState<string[]>([])`
- Implement `handleEnhance` function:
  ```typescript
  const handleEnhance = () => {
    if (inputPrompt.trim() === '') return;

    const prefix = '你是专家 ';
    const suffix = ' 请提供主要观点的3个不同出处的网页链接以便我查验。如果你不知道或查不到,就实说,不要编造';
    const enhanced = `${prefix}${inputPrompt}${suffix}`;

    setEnhancedPrompts(prev => [...prev, enhanced]);
    setInputPrompt('');
  };
  ```
- Connect `onClick` handler to this function
- Log enhanced prompts to console for verification

**Acceptance:**
- Clicking button with valid input generates enhanced prompt
- Enhanced prompt has correct format (prefix + input + suffix)
- Input is cleared after enhancement
- Empty/whitespace input does not trigger enhancement
- Console shows correct enhanced prompt

**Dependencies:** Task 5 (button component)

**Estimated Complexity:** Medium

---

### Task 7: Add Enhanced Prompts Output Display ✓

**Description:** Create the scrollable output area that displays all enhanced prompts above the input section.

**Files to Modify:**
- `jianshaoaihuanjue/app/page.tsx`

**Changes:**
- Add `useRef` import: `import { useState, useRef } from 'react'`
- Create ref: `const outputRef = useRef<HTMLDivElement>(null)`
- Add output container above the input section with:
  - Ref attached: `ref={outputRef}`
  - Map over `enhancedPrompts` array to render each prompt
  - Styling: max-height (20rem), overflow-y-auto, scrollbar
  - Each prompt: padding, border or background, margin between items
  - Orange-themed accents (border color or background tint)
- Conditional rendering: Show placeholder if array is empty

**Acceptance:**
- Enhanced prompts appear in the output area after button click
- Multiple prompts stack vertically in chronological order
- Scrollbar appears when content exceeds max-height
- Each prompt is visually separated
- Empty state shows helpful message or is hidden
- Orange theme is applied to output area styling

**Dependencies:** Task 6 (enhancement logic)

**Estimated Complexity:** Medium

---

### Task 8: Implement Automatic Scroll to Latest Prompt ✓

**Description:** Add smooth scroll animation to show the newest enhanced prompt when generated.

**Files to Modify:**
- `jianshaoaihuanjue/app/page.tsx`

**Changes:**
- Add `useEffect` import: `import { useState, useRef, useEffect } from 'react'`
- Implement scroll effect:
  ```typescript
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
  ```
- Alternative: Use `requestAnimationFrame` if setTimeout causes issues

**Acceptance:**
- Output area scrolls smoothly to bottom when new prompt is added
- Scroll animation is smooth (not instant)
- Scroll delay (100ms) allows DOM to update first
- User can still manually scroll before/during/after auto-scroll

**Dependencies:** Task 7 (output display)

**Estimated Complexity:** Low-Medium

---

### Task 9: Responsive Layout Refinement ✓

**Description:** Fine-tune responsive behavior to ensure perfect mobile and desktop layouts.

**Files to Modify:**
- `jianshaoaihuanjue/app/page.tsx`

**Changes:**
- Review and adjust Tailwind responsive classes:
  - Container: Add responsive padding (px-4 sm:px-6 lg:px-8)
  - Max-width: Constrain on large screens (max-w-4xl)
  - Input/button flex: Ensure proper gap and sizing at all breakpoints
  - Title: Adjust font size (text-2xl sm:text-3xl)
  - Touch targets: Ensure button height ≥44px on mobile
- Test at multiple viewport sizes (375px, 640px, 768px, 1024px, 1920px)

**Acceptance:**
- Layout adapts correctly at all common screen sizes
- No horizontal scrolling on mobile
- Button is easily tappable on mobile (≥44px height)
- Desktop layout uses space efficiently
- Content is centered and constrained on large screens

**Dependencies:** Task 8 (all core functionality complete)

**Estimated Complexity:** Low-Medium

---

### Task 10: Accessibility and Polish ✓

**Description:** Add final touches for accessibility, keyboard support, and visual polish.

**Files to Modify:**
- `jianshaoaihuanjue/app/page.tsx`

**Changes:**
- Add ARIA labels and semantic HTML where appropriate
- Ensure tab order is logical (textarea → button)
- Add keyboard shortcut (optional): Enter key to trigger enhancement
  - Add `onKeyDown` handler to textarea
  - Check for Enter key (with Ctrl/Cmd modifier to avoid conflict with newlines)
- Test focus management after enhancement (auto-focus textarea)
- Verify color contrast ratios with WCAG checker
- Add smooth transitions for button hover states (transition-colors)
- Polish spacing and alignment for visual consistency

**Acceptance:**
- Tab navigation works correctly
- Color contrast meets WCAG AA standards (≥4.5:1)
- Keyboard shortcut works (if implemented)
- Focus returns to textarea after enhancement (if implemented)
- All interactions feel smooth and polished
- No accessibility warnings in browser dev tools

**Dependencies:** Task 9 (responsive layout)

**Estimated Complexity:** Medium

---

### Task 11: Build and Lint Validation ✓

**Description:** Verify the application builds successfully and passes linting checks.

**Files to Modify:** None (testing only)

**Commands to Run:**
```bash
npm run lint
npm run build
npm run dev  # Manual testing
```

**Acceptance:**
- `npm run lint` passes with no errors or warnings
- `npm run build` completes successfully
- Development server runs without errors
- No console errors or warnings in browser
- All features work as expected in production build

**Dependencies:** Task 10 (all implementation complete)

**Estimated Complexity:** Low

---

## Task Summary

| Task | Description | Complexity | Dependencies |
|------|-------------|------------|--------------|
| 1 | Update page metadata | Low | None |
| 2 | Add CSS variables | Low | None |
| 3 | Create basic page structure | Low | 1, 2 |
| 4 | Add textarea component | Low-Med | 3 |
| 5 | Add button component | Medium | 4 |
| 6 | Implement enhancement logic | Medium | 5 |
| 7 | Add output display | Medium | 6 |
| 8 | Implement auto-scroll | Low-Med | 7 |
| 9 | Responsive refinement | Low-Med | 8 |
| 10 | Accessibility polish | Medium | 9 |
| 11 | Build validation | Low | 10 |

## Parallelization Opportunities

- **Tasks 1 and 2** can be done in parallel (independent)
- **Tasks 4-10** must be sequential (each depends on previous)
- **Task 11** is final validation

## Total Estimated Effort

Approximately 11 discrete tasks with incremental user-visible progress. Each task maintains a working application state, allowing for testing and validation at every step.

## Testing Strategy

After each task:
1. Run `npm run dev` to verify changes in browser
2. Test on desktop and mobile viewports
3. Check browser console for errors
4. Verify orange theme is applied consistently

Final testing (Task 11):
1. Full end-to-end user flow testing
2. Cross-browser testing (Chrome, Firefox, Safari)
3. Mobile device testing (real devices if possible)
4. Accessibility audit with browser tools
5. Performance check (no significant lag or memory issues)

## Rollback Plan

If issues arise:
- Each task is small and reversible via git
- Can revert to previous commit if major issues occur
- No database or backend changes to worry about
