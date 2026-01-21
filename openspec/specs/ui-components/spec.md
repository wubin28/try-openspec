# ui-components Specification

## Purpose
TBD - created by archiving change build-ai-hallucination-reducer-ui. Update Purpose after archive.
## Requirements
### Requirement: Page Title Display

The application MUST display a prominent title "减少 AI 幻觉" (Reduce AI Hallucinations) at the top of the page.

**Acceptance Criteria:**
- Title text is "减少 AI 幻觉" in Chinese characters
- Title uses large font size (2xl or 3xl on Tailwind scale)
- Title uses bold or semibold font weight (600-700)
- Title color uses orange theme (orange-800 or darker)
- Title is visually distinct from other page content

#### Scenario: Desktop User Views Page Title

**Given** a user accesses the application on a desktop browser
**When** the page loads
**Then** the title "减少 AI 幻觉" is displayed at the top
**And** the title uses 3xl font size
**And** the title color is orange-800
**And** the title is horizontally centered or left-aligned based on container

#### Scenario: Mobile User Views Page Title

**Given** a user accesses the application on a mobile device
**When** the page loads
**Then** the title "减少 AI 幻觉" is displayed at the top
**And** the title uses 2xl font size (responsive sizing)
**And** the title remains readable with appropriate padding
**And** the title does not overflow the viewport

---

### Requirement: Multi-Line Text Input Field

The application MUST provide a multi-line textarea input field for users to enter their original prompts.

**Acceptance Criteria:**
- Input field is a `<textarea>` HTML element (not single-line input)
- Textarea allows multiple lines of text
- Textarea expands vertically to show at least 4-6 rows initially
- Textarea has appropriate placeholder text in Chinese
- Textarea has visible border and styling matching orange theme
- Textarea is keyboard-accessible and supports standard text editing

#### Scenario: User Enters Short Prompt

**Given** the textarea is empty
**When** a user types a single-line prompt like "什么是机器学习"
**Then** the text appears in the textarea
**And** the textarea displays the full text without scrolling
**And** the user can continue editing the text

#### Scenario: User Enters Long Multi-Line Prompt

**Given** the textarea is empty
**When** a user types a prompt spanning 10 lines
**Then** all lines are visible in the textarea
**And** a vertical scrollbar appears if content exceeds initial height
**And** the user can scroll to view all content
**And** the textarea does not expand beyond a reasonable max-height

#### Scenario: User Clears and Re-enters Prompt

**Given** the textarea contains text
**When** the user selects all text and deletes it
**Then** the textarea becomes empty
**And** the placeholder text reappears
**When** the user types new text
**Then** the new text replaces the placeholder

---

### Requirement: Enhancement Button Positioning

The application MUST display a "查询常识" (Query Common Sense) button positioned to the right of the text input field.

**Acceptance Criteria:**
- Button displays text "查询常识" in Chinese
- Button is positioned to the right of the textarea on desktop (≥640px)
- Button is positioned below the textarea on mobile (<640px)
- Button uses orange theme colors (background: orange-600, text: white)
- Button has appropriate padding and readable text size
- Button has hover and active states for visual feedback

#### Scenario: Desktop User Sees Button Layout

**Given** a user accesses the page on a desktop browser (≥640px width)
**When** the page loads
**Then** the button is positioned to the right of the textarea
**And** the button and textarea are in a horizontal flex layout
**And** the textarea takes approximately 70-80% of the width
**And** the button takes the remaining width
**And** the button height matches or complements the textarea height

#### Scenario: Mobile User Sees Button Layout

**Given** a user accesses the page on a mobile device (<640px width)
**When** the page loads
**Then** the button is positioned below the textarea
**And** the button and textarea are in a vertical stack layout
**And** the button spans the full width of the container
**And** there is appropriate spacing between textarea and button

#### Scenario: User Hovers Over Button (Desktop)

**Given** the button is displayed on desktop
**When** the user hovers the mouse over the button
**Then** the button background color darkens (orange-700)
**And** the cursor changes to pointer
**And** the transition is smooth (100-200ms)

#### Scenario: User Clicks Button

**Given** the button is displayed
**When** the user clicks the button
**Then** the button shows an active/pressed state visually
**And** the prompt enhancement logic is triggered (see prompt-enhancement spec)

---

### Requirement: Enhanced Prompts Output Display

The application MUST display all generated enhanced prompts (from both modes) in a scrollable output area with visual type differentiation.

**Acceptance Criteria:**
- Output area is positioned above the textarea and buttons
- Prompts displayed in chronological order (newest at bottom)
- Maximum height constraint (e.g., 20rem/80vh)
- Vertical scrollbar when content exceeds max-height
- Each prompt shows visual distinction based on type (static vs AI-powered)
- Output area automatically scrolls to newest prompt
- Empty state shows placeholder or is hidden

#### Scenario: User Generates Prompts of Both Types

**Given** the user generates 2 static prompts
**And** then generates 1 AI-powered prompt
**And** then generates 1 static prompt
**When** viewing the output area
**Then** all 4 prompts are displayed in order
**And** prompts 1, 2, 4 show orange styling ("常识")
**And** prompt 3 shows blue/purple styling ("AI优化")
**And** the output area scrolls to show the newest prompt

---

### Requirement: Orange Color Theme

The application MUST use an orange color scheme consistently across all UI components.

**Acceptance Criteria:**
- Primary color is orange (Tailwind orange-600: #EA580C or similar)
- Button background uses orange-600
- Button hover state uses orange-700
- Title or accents use orange-800 for darker text
- Light backgrounds or highlights use orange-100 or orange-200
- Page background uses neutral color (white, gray-50, or orange-50)
- Text colors have sufficient contrast ratio (WCAG AA: ≥4.5:1)

#### Scenario: User Views Page with Orange Theme

**Given** a user accesses the application
**When** the page loads
**Then** the primary button uses orange-600 background
**And** the title or headings use orange-800 color
**And** hover states darken to orange-700
**And** the overall color palette feels cohesive and orange-themed
**And** all text remains readable against backgrounds (contrast check)

#### Scenario: Accessibility - Contrast Verification

**Given** the orange theme is applied
**When** testing with a contrast checker tool
**Then** button text (white) on orange-600 background has ≥4.5:1 ratio
**And** title text (orange-800) on white/light background has ≥4.5:1 ratio
**And** body text meets WCAG AA standards

---

### Requirement: Responsive Layout for Mobile and Desktop

The application MUST adapt its layout for two buttons and maintain responsive behavior.

**Acceptance Criteria:**
- Desktop (≥640px): Textarea on left, buttons on right (stacked vertically)
- Mobile (<640px): Textarea at top, buttons below (stacked vertically)
- Both buttons have equal height and width (consistency)
- Touch targets on mobile are at least 44px in height
- No horizontal scrolling on any device
- Spacing between buttons is appropriate (0.5rem - 1rem)

#### Scenario: Desktop Layout with Two Buttons

**Given** a user accesses the page on desktop (≥640px)
**When** the page loads
**Then** the textarea is on the left (70-80% width)
**And** the two buttons are on the right in a vertical stack
**And** buttons are equally sized
**And** spacing between buttons is 0.5-1rem

#### Scenario: Mobile Layout with Two Buttons

**Given** a user accesses the page on mobile (<640px)
**When** the page loads
**Then** the textarea is at the top (full width)
**And** the two buttons are below in a vertical stack
**And** both buttons span full width
**And** spacing between buttons is 0.5-1rem
**And** both buttons have minimum 44px height

---

### Requirement: Metadata and Page Configuration

The application MUST update page metadata to reflect the AI Hallucination Reducer purpose.

**Acceptance Criteria:**
- Page title (browser tab) is "减少 AI 幻觉" or similar descriptive title
- Meta description describes the tool's purpose
- HTML lang attribute is set to "zh" or "zh-CN" for Chinese
- No console errors or warnings related to metadata

#### Scenario: User Opens Page in New Tab

**Given** a user opens the application URL
**When** the page loads in a new browser tab
**Then** the tab title displays "减少 AI 幻觉" (or "减少 AI 幻觉 - AI Hallucination Reducer")
**And** the favicon loads (default Next.js favicon acceptable)

#### Scenario: Search Engine Crawls Page

**Given** a search engine crawler accesses the page
**When** the crawler reads the HTML metadata
**Then** the `<title>` tag contains "减少 AI 幻觉"
**And** the meta description explains the tool's purpose
**And** the lang attribute is "zh" or "zh-CN"

---

### Requirement: Dual Enhancement Buttons

The application MUST display two distinct enhancement buttons side-by-side (or stacked on mobile): "查询常识" and "应对未知与复杂".

**Acceptance Criteria:**
- Two buttons are displayed in the input area
- "查询常识" button: orange theme (existing style)
- "应对未知与复杂" button: blue/purple theme (new)
- Desktop (≥640px): Buttons positioned to the right of textarea, stacked vertically or side-by-side
- Mobile (<640px): Buttons below textarea, stacked vertically
- Both buttons have same dimensions for visual consistency
- Each button can have independent loading state
- Buttons are keyboard accessible and properly labeled

#### Scenario: Desktop User Sees Both Buttons

**Given** a user accesses the page on desktop (≥640px)
**When** the page loads
**Then** the "查询常识" button is displayed
**And** the "应对未知与复杂" button is displayed below or beside it
**And** both buttons are aligned and sized consistently
**And** the orange button uses orange-600 background
**And** the blue button uses blue-600 or purple-600 background

#### Scenario: Mobile User Sees Both Buttons

**Given** a user accesses the page on mobile (<640px)
**When** the page loads
**Then** both buttons are displayed below the textarea
**And** buttons are stacked vertically
**And** both buttons span full width of container
**And** appropriate spacing exists between buttons

#### Scenario: User Hovers Over Buttons

**Given** the buttons are displayed on desktop
**When** the user hovers over "查询常识"
**Then** the button darkens to orange-700
**When** the user hovers over "应对未知与复杂"
**Then** the button darkens to blue-700 or purple-700

---

### Requirement: Loading State During API Call

The application MUST display a loading indicator on the "应对未知与复杂" button when an API request is in progress.

**Acceptance Criteria:**
- Button shows loading spinner or text change during API call
- Button is disabled (not clickable) while loading
- Loading state is independent of "查询常识" button
- Loading text example: "处理中..." or spinner icon
- Loading state clears on success or error
- Textarea remains enabled during loading (user can type next prompt)

#### Scenario: User Clicks AI-Powered Button

**Given** the user enters a prompt
**When** the user clicks "应对未知与复杂"
**Then** the button immediately shows loading state (disabled, spinner, or "处理中...")
**And** the user cannot click the button again
**And** the "查询常识" button remains enabled
**When** the API responds (success or error)
**Then** the loading state is cleared
**And** the button returns to normal clickable state

#### Scenario: User Can Queue Next Prompt During Loading

**Given** the AI-powered optimization is in progress
**When** the user types a new prompt in the textarea
**Then** the textarea accepts input normally
**And** the user can prepare the next prompt while waiting

---

### Requirement: Error Toast Notification

The application MUST display a red-themed toast notification for API errors that auto-dismisses after 10 seconds.

**Acceptance Criteria:**
- Toast appears at top of viewport (fixed positioning)
- Background color: red-600 or red-700
- Text color: white
- Error message is user-friendly (not technical stack traces)
- Toast auto-dismisses after exactly 10 seconds
- User can manually dismiss by clicking close button (optional enhancement)
- Only one toast shown at a time (new error replaces old)

#### Scenario: API Key is Missing

**Given** the `DEEPSEEK_API_KEY` is not configured
**When** the user clicks "应对未知与复杂"
**Then** the API returns an error
**And** a red toast appears at the top of the page
**And** the toast message is: "错误: 未配置 DeepSeek API 密钥" or similar
**And** the toast remains visible for 10 seconds
**And** the toast automatically disappears after 10 seconds

#### Scenario: DeepSeek Service Unavailable

**Given** the DeepSeek API is down
**When** the user clicks "应对未知与复杂"
**Then** the API returns a 503 error
**And** a red toast appears with message: "错误: 无法连接 DeepSeek 服务"
**And** the toast auto-dismisses after 10 seconds

#### Scenario: Network Timeout

**Given** the API call takes longer than 10 seconds
**When** the timeout occurs
**Then** a red toast appears with message: "错误: 请求超时,请稍后重试"
**And** the toast auto-dismisses after 10 seconds

---

### Requirement: Visual Distinction for Prompt Types

The application MUST visually differentiate between static and AI-powered prompts in the output area.

**Acceptance Criteria:**
- Static prompts (查询常识): Orange border (orange-300), badge "常识"
- AI-powered prompts (应对未知与复杂): Blue/purple border (blue-400/purple-400), badge "AI优化"
- Badges are positioned at top-right or top-left of prompt card
- Border color is distinct enough to differentiate at a glance
- Badge text is concise (2-4 characters)
- Color scheme is colorblind-friendly (relies on both color AND text)

#### Scenario: User Views Mixed Prompt Types

**Given** the output area contains 3 static and 2 AI-powered prompts
**When** the user views the output area
**Then** static prompts have orange borders and "常识" badge
**And** AI-powered prompts have blue/purple borders and "AI优化" badge
**And** the distinction is immediately clear
**And** scrolling through prompts maintains consistent styling

#### Scenario: Colorblind User Differentiates Prompts

**Given** a colorblind user views the output area
**When** they look at prompts of different types
**Then** they can distinguish types by reading the badge text
**And** the border color difference provides additional visual cue
**And** no information is lost due to color perception

---

