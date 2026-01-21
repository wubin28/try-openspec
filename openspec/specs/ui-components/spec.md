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

The application MUST display all generated enhanced prompts in a scrollable output area positioned above the input section.

**Acceptance Criteria:**
- Output area is positioned above the textarea and button
- Output area displays enhanced prompts in chronological order (newest at bottom)
- Output area has a maximum height constraint (e.g., 20rem/80vh)
- Output area shows a vertical scrollbar when content exceeds max-height
- Each enhanced prompt is visually separated (border, background, or spacing)
- Output area automatically scrolls to the newest prompt when added
- Output area is empty or shows placeholder message when no prompts exist

#### Scenario: User Generates First Enhanced Prompt

**Given** the output area is empty (no prompts generated yet)
**When** the user clicks the enhancement button with a valid prompt
**Then** the enhanced prompt appears in the output area
**And** the output area becomes visible (if previously hidden)
**And** the prompt text is fully readable with appropriate styling

#### Scenario: User Generates Multiple Enhanced Prompts

**Given** the output area contains 2 enhanced prompts
**When** the user generates a 3rd enhanced prompt
**Then** the new prompt appears at the bottom of the output area
**And** all 3 prompts are displayed in order (oldest to newest)
**And** the output area automatically scrolls to show the newest prompt
**And** the scroll behavior is smooth (not instant jump)

#### Scenario: Output Area Exceeds Maximum Height

**Given** the user has generated 10 enhanced prompts
**And** the total height exceeds the max-height constraint
**When** the output area renders
**Then** a vertical scrollbar appears on the output area
**And** the user can scroll to view older prompts
**And** the newest prompt is visible without scrolling
**And** older prompts remain accessible via scrolling up

#### Scenario: No Prompts Generated Yet

**Given** the page has just loaded
**And** no enhanced prompts have been generated
**When** the page renders
**Then** the output area either:
  - Displays a helpful message like "增强后的提示词将显示在这里" (Enhanced prompts will appear here)
  - Or is hidden until the first prompt is generated
**And** the empty state does not cause layout confusion

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

The application MUST automatically adapt its layout for mobile screens (<640px) and desktop browsers (≥640px).

**Acceptance Criteria:**
- Desktop layout (≥640px): Button positioned to right of textarea (horizontal)
- Mobile layout (<640px): Button positioned below textarea (vertical)
- Container width constrained on desktop (max-width: 1024px or similar)
- Appropriate padding and margins scale with screen size
- Touch targets on mobile are at least 44px in height
- No horizontal scrolling occurs on mobile devices
- Content remains readable and accessible on all screen sizes

#### Scenario: Desktop User Views Application

**Given** a user accesses the page on a desktop browser (1920x1080)
**When** the page loads
**Then** the container is horizontally centered
**And** the max-width is applied (content does not stretch full-width)
**And** the textarea and button are side-by-side
**And** generous padding is applied for readability
**And** font sizes are optimized for desktop reading distance

#### Scenario: Tablet User Views Application

**Given** a user accesses the page on a tablet (768px width)
**When** the page loads
**Then** the layout uses desktop styles (≥640px breakpoint)
**And** the button is positioned to the right of textarea
**And** the content fits within the viewport without horizontal scroll

#### Scenario: Mobile User Views Application

**Given** a user accesses the page on a mobile phone (375px width)
**When** the page loads
**Then** the layout uses mobile styles (<640px breakpoint)
**And** the button is positioned below the textarea
**And** both elements span the full container width
**And** padding is reduced to maximize screen real estate
**And** touch targets are large enough for finger interaction (≥44px)
**And** no horizontal scrolling is required

#### Scenario: User Rotates Mobile Device

**Given** a user is viewing the page on a mobile device in portrait mode
**When** the user rotates the device to landscape mode
**Then** the layout responds to the new viewport dimensions
**And** the breakpoint threshold (640px) determines layout style
**And** content remains accessible and readable
**And** no layout breaks or overlaps occur

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

