# ui-components Spec Delta

## ADDED Requirements

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

## MODIFIED Requirements

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
