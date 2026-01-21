# Proposal: Build AI Hallucination Reducer UI

**Change ID:** `build-ai-hallucination-reducer-ui`
**Status:** Draft
**Author:** AI Assistant
**Date:** 2026-01-21

## Overview

Transform the default Next.js Hello World page into a functional "AI Hallucination Reduction" tool. This web application will help users enhance their AI prompts by automatically adding expert framing and citation requirements to reduce AI hallucinations.

## Problem Statement

The current application displays a generic Next.js starter page with no functional purpose. Users need a tool to:
1. Input prompts that may be sent to AI systems
2. Automatically enhance those prompts with hallucination-reduction techniques
3. View the enhanced prompts in a user-friendly interface
4. Maintain workflow efficiency with automatic input clearing

## Proposed Solution

Replace the existing `app/page.tsx` with an interactive single-page application featuring:

### Core Functionality
- **Input Area**: Multi-line text input for users to enter their original prompts
- **Enhancement Button**: "查询常识" (Query Common Sense) button positioned to the right of input
- **Output Display**: Scrollable area above the input showing enhanced prompts with:
  - Prefix: "你是专家" (You are an expert)
  - Original user prompt
  - Suffix: "请提供主要观点的3个不同出处的网页链接以便我查验。如果你不知道或查不到，就实说，不要编造" (Please provide 3 different web links for main points so I can verify. If you don't know or can't find it, say so honestly, don't fabricate)
- **Auto-clear**: Input field clears after button click to enable rapid iteration

### User Experience
- **Visual Design**: Orange color theme throughout the interface
- **Responsive Layout**: Automatic adaptation for desktop browsers and mobile screens
- **Accessibility**: Clear visual hierarchy, readable fonts, appropriate contrast
- **Smooth Interactions**: Scroll animations for output display, visual feedback on button interactions

## Scope

### In Scope
1. Complete UI redesign of the home page (`app/page.tsx`)
2. Client-side interactivity using React state management
3. Orange-themed styling with Tailwind CSS
4. Responsive design for mobile and desktop viewports
5. Automatic prompt enhancement logic
6. Scrollable output history display
7. Chinese language interface (matching user requirements)

### Out of Scope
- Backend API integration (pure client-side)
- Persistent storage of prompts/history
- User authentication
- Actual AI API calls
- Multi-language support (Chinese only for this iteration)
- Advanced prompt templates or customization

## Technical Approach

### Technology Stack (Unchanged)
- Next.js 16.1.4 with App Router
- React 19.2.3 with Client Components ('use client' directive)
- TypeScript for type safety
- Tailwind CSS 4 for styling

### Architecture Decisions
- **Client-Side Only**: Use React state (`useState`) for managing prompts and output history
- **Single Component**: Keep logic in `page.tsx` initially for simplicity
- **Styling Strategy**: Tailwind utility classes with orange theme customization
- **Responsive Approach**: Mobile-first design with Tailwind responsive breakpoints

## Affected Components

### Modified Files
- `jianshaoaihuanjue/app/page.tsx` - Complete replacement of page content
- `jianshaoaihuanjue/app/layout.tsx` - Update metadata (title, description)
- `jianshaoaihuanjue/app/globals.css` - Add orange theme color variables

### No New Files Required
All functionality can be implemented within existing Next.js structure.

## Acceptance Criteria

### Functional Requirements

**AC-F1: Core User Flow**
- **GIVEN** a user opens the application
- **WHEN** they enter a prompt and click "查询常识"
- **THEN** an enhanced prompt appears with the exact format: `你是专家 {userPrompt} 请提供主要观点的3个不同出处的网页链接以便我查验。如果你不知道或查不到,就实说,不要编造`
- **AND** the input field is cleared immediately
- **AND** the output scrolls to show the new enhanced prompt

**AC-F2: Multiple Prompt Enhancement**
- **GIVEN** a user has generated 3 enhanced prompts
- **WHEN** they generate a 4th prompt
- **THEN** all 4 prompts are displayed in chronological order
- **AND** each prompt is visually distinct and readable
- **AND** the output area scrolls automatically to the newest prompt

**AC-F3: Input Validation**
- **GIVEN** the input field is empty or contains only whitespace
- **WHEN** the user clicks "查询常识"
- **THEN** no action occurs (no new prompt generated)
- **AND** no error message is displayed

### Visual & Design Requirements

**AC-V1: Orange Theme Application**
- **GIVEN** the page is fully loaded
- **THEN** the primary button uses orange-600 (#EA580C) background
- **AND** the button hover state uses orange-700 or darker
- **AND** the title uses orange-800 (#9A3412) or similar dark orange
- **AND** all text meets WCAG AA contrast ratios (≥4.5:1)

**AC-V2: Typography & Layout**
- **GIVEN** the page is rendered
- **THEN** the title "减少 AI 幻觉" is displayed in 2xl (mobile) or 3xl (desktop) font size
- **AND** Chinese characters render correctly without encoding issues
- **AND** all text is readable with appropriate font weights and spacing

### Responsive Design Requirements

**AC-R1: Mobile Layout (< 640px)**
- **GIVEN** viewport width is less than 640px
- **THEN** the button is positioned below the textarea (vertical stack)
- **AND** both elements span full container width
- **AND** the button height is ≥44px (touch-friendly)
- **AND** no horizontal scrolling occurs
- **AND** all content remains accessible and readable

**AC-R2: Desktop Layout (≥ 640px)**
- **GIVEN** viewport width is 640px or greater
- **THEN** the button is positioned to the right of the textarea (horizontal layout)
- **AND** the textarea takes approximately 70-80% of the width
- **AND** the container is horizontally centered with appropriate max-width
- **AND** padding and spacing are optimized for desktop viewing

### Technical Requirements

**AC-T1: Build & Deployment**
- **GIVEN** the implementation is complete
- **WHEN** running `npm run build`
- **THEN** the build completes successfully with no errors
- **AND** no TypeScript errors are present
- **AND** the production build is under reasonable size limits

**AC-T2: Code Quality**
- **GIVEN** the implementation is complete
- **WHEN** running `npm run lint`
- **THEN** ESLint passes with no errors or warnings
- **AND** all TypeScript types are properly defined
- **AND** React best practices are followed (hooks rules, key props, etc.)

**AC-T3: Browser Console**
- **GIVEN** the application is running in development mode
- **WHEN** performing all user interactions
- **THEN** no errors appear in the browser console
- **AND** no warnings appear in the browser console
- **AND** no React hydration errors occur

### User Experience Requirements

**AC-UX1: Interaction Responsiveness**
- **GIVEN** a user interacts with any UI element
- **WHEN** they click the button, type in the textarea, or scroll the output
- **THEN** the response is immediate (<100ms perceived lag)
- **AND** smooth transitions are applied (button hover, scroll animations)
- **AND** visual feedback is clear for all interactions

**AC-UX2: Accessibility**
- **GIVEN** a user navigates with keyboard only
- **WHEN** they use Tab key to navigate
- **THEN** focus moves logically: textarea → button → repeat
- **AND** focus indicators are clearly visible
- **AND** all interactive elements are keyboard accessible

**AC-UX3: Edge Case Handling**
- **GIVEN** various edge case inputs
- **WHEN** testing with:
  - Very long prompts (>1000 characters)
  - Special characters and emoji
  - Multi-line prompts with line breaks
  - Rapid consecutive button clicks
- **THEN** the application handles all cases gracefully without crashes
- **AND** output remains readable and properly formatted

### Cross-Browser Compatibility

**AC-CB1: Modern Browser Support**
- **GIVEN** the application is accessed via different browsers
- **THEN** it functions correctly on:
  - Chrome/Edge (latest version)
  - Firefox (latest version)
  - Safari (latest version)
- **AND** layout and styling are consistent across browsers
- **AND** all interactive features work identically

### Metadata & Configuration

**AC-M1: Page Metadata**
- **GIVEN** the page is loaded
- **THEN** the browser tab title displays "减少 AI 幻觉"
- **AND** the HTML lang attribute is set to "zh" or "zh-CN"
- **AND** meta description describes the tool appropriately

## Success Criteria

1. ✅ Page displays title "减少 AI 幻觉"
2. ✅ Multi-line textarea accepts user input
3. ✅ Button labeled "查询常识" positioned to the right of input
4. ✅ Clicking button generates enhanced prompt with prefix and suffix
5. ✅ Enhanced prompt displays above input area
6. ✅ Input field clears automatically after button click
7. ✅ Output area scrolls to show latest enhanced prompt
8. ✅ Orange color scheme applied consistently
9. ✅ Layout adapts properly on mobile screens (< 640px)
10. ✅ Layout displays correctly on desktop browsers (≥ 640px)

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Orange theme may have poor contrast | Medium | Use WCAG-compliant color shades, test with contrast checkers |
| Mobile layout constraints for button placement | Low | Use flexbox column layout on mobile, row on desktop |
| Overflow handling for long prompts | Low | Implement proper scrolling with max-height constraints |
| Chinese character rendering | Low | Ensure proper UTF-8 encoding, test font fallbacks |

## Dependencies

- None (all required dependencies already installed)

## Timeline Estimate

This is a straightforward UI change with no external dependencies. Implementation can proceed immediately upon approval.

## Open Questions

None - requirements are clear and complete.
