# Design: AI Hallucination Reducer UI

**Change ID:** `build-ai-hallucination-reducer-ui`

## Architecture Overview

This change implements a pure client-side React application within the existing Next.js framework. No server-side logic, API routes, or database interactions are required.

```
┌─────────────────────────────────────────┐
│         Browser (Client-Side)           │
│  ┌───────────────────────────────────┐  │
│  │     app/page.tsx Component        │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │   React State Management    │  │  │
│  │  │  - inputPrompt: string      │  │  │
│  │  │  - enhancedPrompts: array   │  │  │
│  │  └─────────────────────────────┘  │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │  UI Components (JSX)        │  │  │
│  │  │  - Title                    │  │  │
│  │  │  - Output History           │  │  │
│  │  │  - Input Textarea           │  │  │
│  │  │  - Enhancement Button       │  │  │
│  │  └─────────────────────────────┘  │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │  Enhancement Logic          │  │  │
│  │  │  - Prefix + Input + Suffix  │  │  │
│  │  └─────────────────────────────┘  │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Styling: Tailwind CSS + Custom Theme  │
└─────────────────────────────────────────┘
```

## Component Design

### Primary Component: `app/page.tsx`

**Type:** React Client Component
**Directive:** `'use client'` (required for state and interactivity)

#### State Management

```typescript
// State variables
const [inputPrompt, setInputPrompt] = useState<string>('');
const [enhancedPrompts, setEnhancedPrompts] = useState<string[]>([]);
```

#### Event Handlers

1. **handleEnhance()**: Triggered on button click
   - Validates input is not empty
   - Constructs enhanced prompt: `prefix + inputPrompt + suffix`
   - Appends to enhancedPrompts array
   - Clears inputPrompt
   - Scrolls output container to bottom

2. **handleInputChange()**: Updates inputPrompt state on textarea change

#### Layout Structure

```
┌──────────────────────────────────────────┐
│              Page Container              │
│  ┌────────────────────────────────────┐  │
│  │    Title: "减少 AI 幻觉"           │  │
│  └────────────────────────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │     Enhanced Prompts Output        │  │
│  │  ┌──────────────────────────────┐  │  │
│  │  │ [Enhanced Prompt 1]          │  │  │
│  │  │ [Enhanced Prompt 2]          │  │  │
│  │  │ ...                          │  │  │
│  │  └──────────────────────────────┘  │  │
│  │  (Scrollable, max-height set)      │  │
│  └────────────────────────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │   Input Area (Flex Container)      │  │
│  │  ┌───────────────┬──────────────┐  │  │
│  │  │   Textarea    │   Button     │  │  │
│  │  │  (flex-grow)  │ "查询常识"   │  │  │
│  │  │   Multiple    │              │  │  │
│  │  │   rows        │              │  │  │
│  │  └───────────────┴──────────────┘  │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

## Visual Design System

### Color Palette (Orange Theme)

```css
Primary Orange:   #EA580C (orange-600) - Buttons, accents
Light Orange:     #FED7AA (orange-200) - Backgrounds, highlights
Dark Orange:      #9A3412 (orange-800) - Text, borders
Neutral Gray:     #F5F5F5 - Page background
White:            #FFFFFF - Card backgrounds
Text Primary:     #1F2937 (gray-800)
Text Secondary:   #6B7280 (gray-500)
```

### Typography

- **Title**: 2xl/3xl font size, bold (600-700 weight), orange-800 color
- **Body Text**: Base size, regular weight (400), gray-800 color
- **Button Text**: Medium size, medium weight (500), white color
- **Input Text**: Base size, regular weight, gray-900 color

### Spacing & Layout

- **Container Padding**: 4-6 units (1rem-1.5rem)
- **Component Gaps**: 4-6 units between major sections
- **Border Radius**: Medium (0.5rem) for inputs and buttons
- **Max Width**: Container constrained to 4xl (56rem) on large screens

## Responsive Design Strategy

### Mobile-First Approach

**Breakpoint:** 640px (Tailwind `sm:` prefix)

#### Mobile Layout (< 640px)
- Single column layout
- Full-width input and button
- Button below textarea (stacked vertically)
- Reduced padding and margins
- Touch-friendly button size (min 44px height)

#### Desktop Layout (≥ 640px)
- Input and button side-by-side (flex-row)
- Textarea takes ~75% width (flex-grow)
- Button fixed width (~25%)
- Increased padding for breathing room
- Centered container with max-width

### Tailwind Responsive Classes

```
// Mobile-first example
className="flex flex-col sm:flex-row gap-2 sm:gap-4"
//          Mobile ↑       Desktop ↑
```

## Interaction Design

### User Flow

1. **Initial State**
   - Empty input textarea with placeholder text
   - Empty output area (or helpful message)
   - Button in default state

2. **User Types Prompt**
   - Textarea expands if needed (auto-resize consideration)
   - Button remains enabled

3. **User Clicks Button**
   - Visual feedback (button hover/active states)
   - Enhanced prompt appears at bottom of output area
   - Smooth scroll animation to latest prompt
   - Input clears immediately
   - Focus returns to textarea for next input

4. **Multiple Iterations**
   - Output area accumulates enhanced prompts
   - Scrollbar appears when content exceeds max-height
   - User can review previous enhancements

### Accessibility Considerations

- **Keyboard Navigation**: Tab order: textarea → button → repeat
- **Enter Key**: Optional enhancement - Enter submits (requires onKeyDown)
- **Focus Management**: Auto-focus textarea after enhancement
- **Screen Readers**: Proper labels and ARIA attributes
- **Contrast Ratios**: WCAG AA compliance (4.5:1 minimum)

## Technical Implementation Patterns

### State Update Pattern

```typescript
const handleEnhance = () => {
  if (inputPrompt.trim() === '') return;

  const enhanced = `你是专家 ${inputPrompt} 请提供主要观点的3个不同出处的网页链接以便我查验。如果你不知道或查不到，就实说，不要编造`;

  setEnhancedPrompts(prev => [...prev, enhanced]);
  setInputPrompt('');

  // Scroll to bottom
  setTimeout(() => {
    outputRef.current?.scrollTo({
      top: outputRef.current.scrollHeight,
      behavior: 'smooth'
    });
  }, 100);
};
```

### Scroll Reference Pattern

```typescript
const outputRef = useRef<HTMLDivElement>(null);

// In JSX
<div ref={outputRef} className="overflow-y-auto max-h-80">
  {/* Enhanced prompts */}
</div>
```

## Styling Strategy

### Tailwind Configuration

No custom Tailwind config changes needed - use default orange color palette.

### Global CSS Updates

Add orange theme variables to `app/globals.css`:

```css
:root {
  --background: #ffffff;
  --foreground: #171717;
  --primary: #EA580C;      /* Orange-600 */
  --primary-light: #FED7AA; /* Orange-200 */
  --primary-dark: #9A3412;  /* Orange-800 */
}
```

### Component-Level Styling

Use Tailwind utility classes exclusively in JSX - no separate CSS modules or styled-components needed.

## Performance Considerations

### Optimization Strategies

1. **State Updates**: Batch updates using functional setState to avoid unnecessary re-renders
2. **Scroll Performance**: Use `requestAnimationFrame` if scroll stutters
3. **Large Lists**: If enhanced prompts list grows very large (100+ items), consider:
   - Virtual scrolling (future enhancement)
   - Limiting displayed items
   - Local storage persistence with pagination

### Current Scale

For the expected use case (dozens of prompts per session), no performance optimizations are necessary beyond React's default behavior.

## Edge Cases & Error Handling

### Input Validation

| Scenario | Behavior |
|----------|----------|
| Empty input | Button click has no effect (guard clause) |
| Whitespace-only input | Treat as empty (use `.trim()`) |
| Very long input (>10,000 chars) | Allow but may cause UI overflow - rely on scrolling |
| Special characters | Support all UTF-8 characters (Chinese, emoji, etc.) |

### UI Edge Cases

| Scenario | Solution |
|----------|----------|
| No enhanced prompts yet | Display placeholder message or hide output container |
| Output overflow | Scrollable container with max-height |
| Mobile keyboard open | Ensure button remains accessible (viewport units) |
| Rapid button clicks | Prevent duplicate additions (optional debouncing) |

## Future Enhancement Considerations

While out of scope for this change, the architecture supports:

- Copy-to-clipboard button for enhanced prompts
- Delete individual enhanced prompts
- Edit and re-enhance prompts
- Export history as text file
- Customizable prefix/suffix templates
- Persistent storage with localStorage
- Dark mode toggle (orange theme variant)

## Testing Strategy (Validation)

### Manual Testing Checklist

1. ✅ Desktop Chrome/Firefox/Safari - Layout correct
2. ✅ Mobile Chrome/Safari - Layout correct
3. ✅ Enter text → Click button → Enhanced prompt appears
4. ✅ Input clears after enhancement
5. ✅ Multiple enhancements accumulate
6. ✅ Scroll behavior works correctly
7. ✅ Orange theme applied consistently
8. ✅ Accessibility - Tab navigation works
9. ✅ Edge case - Empty input handling
10. ✅ Edge case - Very long input scrolling

### Validation Commands

```bash
# Build check
npm run build

# Lint check
npm run lint

# Development server
npm run dev
```

## Tradeoffs & Decisions

### Decision 1: Client-Side vs Server-Side Enhancement

**Chosen:** Client-side (React state)

**Rationale:**
- No backend needed for simple string concatenation
- Instant response (no network latency)
- Simpler architecture
- Aligns with learning/experimental nature of project

**Tradeoff:** Cannot persist history across sessions (acceptable for V1)

### Decision 2: Single Component vs Multiple Components

**Chosen:** Single component in `page.tsx`

**Rationale:**
- Simpler for small UI
- Easier to understand and maintain
- No premature abstraction
- Can refactor later if complexity grows

**Tradeoff:** Less reusable code (acceptable given single-page scope)

### Decision 3: Tailwind Classes vs CSS Modules

**Chosen:** Tailwind utility classes

**Rationale:**
- Already configured in project
- Faster development
- Better responsive design DX
- No additional files needed

**Tradeoff:** Longer className strings (mitigated by editor extensions)

## Conclusion

This design provides a straightforward, maintainable implementation that fulfills all requirements while keeping the solution simple and aligned with Next.js best practices. The architecture is intentionally minimal to match the experimental nature of the project while remaining extensible for future enhancements.
