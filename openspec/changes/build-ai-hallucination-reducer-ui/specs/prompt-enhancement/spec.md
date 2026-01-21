# Spec: Prompt Enhancement

**Capability:** prompt-enhancement
**Change ID:** build-ai-hallucination-reducer-ui
**Status:** Draft

## Overview

Defines the logic and behavior for enhancing user-provided prompts with anti-hallucination framing. This capability handles the core transformation of input prompts by adding expert context and citation requirements to reduce AI hallucination risks.

---

## ADDED Requirements

### Requirement: Prompt Enhancement Logic

The application MUST generate enhanced prompts by concatenating a predefined prefix, the user's original prompt, and a predefined suffix.

**Acceptance Criteria:**
- Prefix text is exactly: "你是专家 " (with trailing space)
- Suffix text is exactly: " 请提供主要观点的3个不同出处的网页链接以便我查验。如果你不知道或查不到，就实说，不要编造" (with leading space)
- Enhanced prompt format: `{prefix}{userPrompt}{suffix}`
- Original prompt is preserved exactly as entered (no trimming beyond validation)
- Enhanced prompt maintains proper spacing between segments

#### Scenario: User Enhances a Simple Prompt

**Given** the user enters the prompt "什么是机器学习"
**When** the user clicks the "查询常识" button
**Then** the system generates an enhanced prompt:
```
你是专家 什么是机器学习 请提供主要观点的3个不同出处的网页链接以便我查验。如果你不知道或查不到,就实说,不要编造
```
**And** the prefix "你是专家 " appears before the user's text
**And** the suffix appears after the user's text
**And** all segments are properly concatenated with spaces

#### Scenario: User Enhances a Multi-Line Prompt

**Given** the user enters a multi-line prompt:
```
请解释量子计算的基本原理
包括叠加态和纠缠态
```
**When** the user clicks the "查询常识" button
**Then** the system generates an enhanced prompt preserving line breaks:
```
你是专家 请解释量子计算的基本原理
包括叠加态和纠缠态 请提供主要观点的3个不同出处的网页链接以便我查验。如果你不知道或查不到,就实说,不要编造
```
**And** the original line breaks are maintained in the output

#### Scenario: User Enhances a Prompt with Special Characters

**Given** the user enters "如何使用Python编写'Hello World'程序?"
**When** the user clicks the "查询常识" button
**Then** the enhanced prompt correctly includes the single quotes and question mark:
```
你是专家 如何使用Python编写'Hello World'程序? 请提供主要观点的3个不同出处的网页链接以便我查验。如果你不知道或查不到,就实说,不要编造
```
**And** no characters are escaped or altered

---

### Requirement: Input Validation

The application MUST validate user input before generating enhanced prompts and handle empty or invalid inputs gracefully.

**Acceptance Criteria:**
- Empty input (zero characters) triggers no action
- Whitespace-only input (spaces, tabs, newlines) triggers no action
- Valid input (any non-whitespace characters) triggers enhancement
- No error messages are displayed for invalid input (silent validation)
- Button click with invalid input has no visible effect

#### Scenario: User Clicks Button with Empty Input

**Given** the textarea is completely empty
**When** the user clicks the "查询常识" button
**Then** no enhanced prompt is generated
**And** the output area remains unchanged
**And** the textarea remains empty
**And** no error message is displayed

#### Scenario: User Clicks Button with Whitespace-Only Input

**Given** the textarea contains only spaces and newlines "   \n  "
**When** the user clicks the "查询常识" button
**Then** no enhanced prompt is generated
**And** the output area remains unchanged
**And** the textarea content is not cleared
**And** no error message is displayed

#### Scenario: User Enters Valid Input After Failed Attempt

**Given** the user previously clicked the button with empty input
**And** no action occurred
**When** the user types "机器学习" in the textarea
**And** clicks the button again
**Then** the enhanced prompt is generated successfully
**And** the prompt is added to the output area

---

### Requirement: Input Clearing After Enhancement

The application MUST automatically clear the input textarea immediately after successfully generating an enhanced prompt.

**Acceptance Criteria:**
- Textarea is cleared (set to empty string) after enhancement
- Clearing occurs within the same button click handler
- Clearing happens before scroll animation completes
- User can immediately begin typing a new prompt
- Textarea placeholder text reappears after clearing

#### Scenario: User Generates Enhancement and Continues

**Given** the textarea contains "什么是深度学习"
**When** the user clicks the "查询常识" button
**Then** the enhanced prompt is added to the output area
**And** the textarea is immediately cleared (empty string)
**And** the placeholder text reappears in the textarea
**When** the user starts typing a new prompt
**Then** the new text appears without any residual content

#### Scenario: Rapid Consecutive Enhancements

**Given** the textarea contains "第一个问题"
**When** the user clicks the button
**And** immediately types "第二个问题" (without waiting for animations)
**And** clicks the button again
**Then** two separate enhanced prompts are generated
**And** each enhancement uses the correct corresponding input
**And** the textarea is empty after both operations

---

### Requirement: Enhanced Prompt Storage and Display

The application MUST store all enhanced prompts in order and display them in the output area.

**Acceptance Criteria:**
- Enhanced prompts are stored in a client-side array (React state)
- Prompts are stored in chronological order (oldest first)
- New prompts are appended to the end of the array
- All prompts remain visible in the output area until page reload
- No limit on the number of stored prompts (within browser memory constraints)
- Each prompt is individually displayed with visual separation

#### Scenario: User Generates Three Prompts in Sequence

**Given** the user generates prompt 1: "问题一"
**And** then generates prompt 2: "问题二"
**And** then generates prompt 3: "问题三"
**When** viewing the output area
**Then** all three enhanced prompts are displayed
**And** they appear in order: prompt 1, prompt 2, prompt 3 (top to bottom)
**And** each prompt is visually distinct (separated by spacing or borders)

#### Scenario: User Reloads Page

**Given** the user has generated 5 enhanced prompts
**When** the user refreshes the browser page (F5 or reload button)
**Then** all enhanced prompts are cleared (not persisted)
**And** the output area returns to empty state
**And** the user can generate new prompts from scratch

---

### Requirement: Automatic Scroll to Latest Prompt

The application MUST automatically scroll the output area to display the newest enhanced prompt when it is generated.

**Acceptance Criteria:**
- Output area scrolls to bottom when new prompt is added
- Scroll animation is smooth (not instant jump)
- Scroll duration is 200-500ms for good UX
- Scroll occurs after the prompt is added to the DOM
- User can still manually scroll during/after automatic scroll

#### Scenario: Output Area is Not Scrollable

**Given** the output area contains 2 prompts
**And** the total height does not exceed max-height (no scrollbar)
**When** the user generates a 3rd prompt
**Then** the prompt appears at the bottom
**And** no scroll animation occurs (not needed)
**And** all three prompts remain visible

#### Scenario: Output Area Requires Scrolling

**Given** the output area contains 8 prompts
**And** the total height exceeds max-height (scrollbar visible)
**And** the user has scrolled to the top to review old prompts
**When** the user generates a 9th prompt
**Then** the output area smoothly scrolls to the bottom
**And** the newest prompt becomes visible
**And** the scroll animation takes approximately 300ms
**And** older prompts scroll out of view at the top

#### Scenario: User Manually Scrolls During Auto-Scroll

**Given** the system is performing an auto-scroll animation
**When** the user manually grabs the scrollbar or uses scroll wheel
**Then** the manual scroll overrides the automatic scroll
**And** the user maintains full control of the scroll position

---

### Requirement: State Management and Reactivity

The application MUST use React state to manage input and output data reactively.

**Acceptance Criteria:**
- Input prompt is stored in React state (`useState`)
- Enhanced prompts array is stored in React state (`useState`)
- State updates trigger automatic re-renders
- Input field value is controlled by state (two-way binding)
- Output area content is derived from state array
- No direct DOM manipulation for state updates

#### Scenario: User Types in Textarea

**Given** the textarea is empty
**When** the user types "机器学习"
**Then** the React state `inputPrompt` updates on each keystroke
**And** the textarea value reflects the current state
**And** the component re-renders efficiently (React optimization)

#### Scenario: Button Click Updates State

**Given** the textarea contains "深度学习"
**When** the user clicks the "查询常识" button
**Then** the `handleEnhance` function is called
**And** a new enhanced prompt is added to the `enhancedPrompts` state array
**And** the `inputPrompt` state is set to empty string
**And** React re-renders the component
**And** the UI reflects the new state (new prompt visible, input cleared)

---

## Related Capabilities

- **ui-components**: Defines the textarea, button, and output display that trigger and show enhanced prompts (REQ-UI-002, REQ-UI-003, REQ-UI-004)

## Implementation Notes

### TypeScript Types

```typescript
// State types
const [inputPrompt, setInputPrompt] = useState<string>('');
const [enhancedPrompts, setEnhancedPrompts] = useState<string[]>([]);
```

### Enhancement Function

```typescript
const handleEnhance = () => {
  // Validation
  if (inputPrompt.trim() === '') return;

  // Enhancement
  const prefix = '你是专家 ';
  const suffix = ' 请提供主要观点的3个不同出处的网页链接以便我查验。如果你不知道或查不到,就实说,不要编造';
  const enhanced = `${prefix}${inputPrompt}${suffix}`;

  // State updates
  setEnhancedPrompts(prev => [...prev, enhanced]);
  setInputPrompt('');

  // Scroll to bottom (handled in useEffect or setTimeout)
};
```

### Scroll Logic

```typescript
const outputRef = useRef<HTMLDivElement>(null);

// After enhancement, trigger scroll
useEffect(() => {
  if (enhancedPrompts.length > 0) {
    outputRef.current?.scrollTo({
      top: outputRef.current.scrollHeight,
      behavior: 'smooth'
    });
  }
}, [enhancedPrompts]);
```

## Edge Cases

1. **Very Long Input**: Prompts >10,000 characters should still work but may cause UI performance issues (acceptable for V1)
2. **Rapid Clicking**: Multiple button clicks in quick succession should queue properly (React state batching handles this)
3. **Unicode Characters**: Emoji, symbols, and non-Chinese characters should be preserved exactly
4. **HTML/Script Tags**: Input is treated as plain text (no XSS risk since no `dangerouslySetInnerHTML` used)

## Testing Validation

Manual testing checklist:
- ✅ Empty input → no action
- ✅ Whitespace-only input → no action
- ✅ Valid input → enhancement generated
- ✅ Input cleared after enhancement
- ✅ Multiple prompts accumulate correctly
- ✅ Scroll to bottom works
- ✅ Special characters preserved
- ✅ Multi-line prompts preserved

## Future Enhancements

- Optional: Configurable prefix/suffix templates
- Optional: Edit and re-enhance existing prompts
- Optional: Export enhanced prompts as text file
- Optional: LocalStorage persistence across sessions
