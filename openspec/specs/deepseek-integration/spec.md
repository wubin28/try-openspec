# deepseek-integration Specification

## Purpose
TBD - created by archiving change add-deepseek-api-optimization. Update Purpose after archive.
## Requirements
### Requirement: DeepSeek API Configuration

The application MUST load the DeepSeek API key from environment variables and validate its presence before making API calls.

**Acceptance Criteria:**
- API key is read from `DEEPSEEK_API_KEY` environment variable
- API endpoint checks for key presence before making external calls
- Missing key results in HTTP 500 error with descriptive message
- Key is never exposed to client-side code
- `.env.local` is listed in `.gitignore`
- `.env.example` provides template for configuration

#### Scenario: API Key is Configured

**Given** the environment variable `DEEPSEEK_API_KEY` is set to a valid key
**When** the `/api/optimize` endpoint is called
**Then** the API key is successfully loaded from environment
**And** the DeepSeek API client is initialized with the key
**And** requests to DeepSeek include the key in Authorization header

#### Scenario: API Key is Missing

**Given** the environment variable `DEEPSEEK_API_KEY` is not set
**When** the `/api/optimize` endpoint is called
**Then** the endpoint returns HTTP 500 status code
**And** the response body contains `{"success": false, "error": "DEEPSEEK_API_KEY not configured"}`
**And** no external API call is made to DeepSeek

#### Scenario: Developer Sets Up Project

**Given** a developer clones the repository
**When** they read the setup documentation
**Then** they find `.env.example` with placeholder `DEEPSEEK_API_KEY=your-key-here`
**And** they create `.env.local` with their actual key
**And** the `.env.local` file is not tracked by git

---

### Requirement: Domain Analysis and Expert Prefix Generation

The application MUST analyze the user's prompt to identify the knowledge domain and generate an appropriate expert role prefix using DeepSeek API.

**Acceptance Criteria:**
- Prompt content is analyzed to extract primary topic/domain
- DeepSeek API is called to generate domain-specific expert prefix
- Prefix format: "你是 [领域]专家" (e.g., "你是 AI 辅助软件开发专家")
- Analysis considers keywords, context, and topic classification
- Generated prefix is returned in API response
- Prefix is different from static "你是专家 " used in common sense mode

#### Scenario: Programming-Related Prompt

**Given** the user submits prompt "请问氛围编程这个提法是谁在什么时候提出的"
**When** the `/api/optimize` endpoint processes the request
**Then** the system identifies the domain as "AI辅助软件开发" or similar
**And** the DeepSeek API generates prefix "你是 AI 辅助软件开发专家"
**And** the response includes `{"prefix": "你是 AI 辅助软件开发专家"}`

#### Scenario: Medical-Related Prompt

**Given** the user submits prompt "什么是糖尿病的早期症状"
**When** the `/api/optimize` endpoint processes the request
**Then** the system identifies the domain as "医学" or "健康"
**And** the DeepSeek API generates prefix like "你是 医学专家" or "你是 健康顾问"
**And** the prefix reflects medical expertise

#### Scenario: General Knowledge Prompt

**Given** the user submits prompt "北京的人口是多少"
**When** the `/api/optimize` endpoint processes the request
**Then** the system identifies a general knowledge domain
**And** the DeepSeek API generates an appropriate expert prefix
**And** the prefix is more specific than generic "你是专家 "

---

### Requirement: Hallucination-Reduction Suffix Appending

The application MUST append the standard hallucination-reduction suffix to all DeepSeek-optimized prompts.

**Acceptance Criteria:**
- Suffix text is exactly: " 请提供主要观点的3个不同出处的网页链接以便我查验。如果你不知道或查不到,就实说,不要编造"
- Suffix is appended after the user's original (or fluency-optimized) prompt
- Suffix includes leading space for proper formatting
- Suffix is consistent with common sense mode (same text)

#### Scenario: Suffix is Appended to Optimized Prompt

**Given** the user prompt is "请问氛围编程这个提法是谁在什么时候提出的"
**And** the generated prefix is "你是 AI 辅助软件开发专家"
**When** the API constructs the full optimized text
**Then** the suffix is appended: " 请提供主要观点的3个不同出处的网页链接以便我查验。如果你不知道或查不到,就实说,不要编造"
**And** the full text is: `{prefix} {prompt}{suffix}`

---

### Requirement: Text Fluency and Punctuation Optimization

The application MUST optimize the user's prompt for fluency and correct punctuation using DeepSeek API.

**Acceptance Criteria:**
- Punctuation errors are corrected (missing periods, commas, question marks)
- Sentence structure is improved for clarity
- Original meaning and intent are preserved
- Optimization is performed by DeepSeek API (not hardcoded rules)
- Both fluency-optimized and original prompt are available in response

#### Scenario: Prompt with Missing Punctuation

**Given** the user submits "请问氛围编程这个提法是谁在什么时候提出的"
**When** the DeepSeek API processes the prompt
**Then** the optimized prompt adds question mark: "请问氛围编程这个提法是谁在什么时候提出的?"
**And** the sentence structure is evaluated for fluency
**And** the response includes `{"optimizedPrompt": "请问氛围编程这个提法是谁在什么时候提出的?"}`

#### Scenario: Prompt with Grammar Issues

**Given** the user submits a prompt with awkward phrasing
**When** the DeepSeek API processes the prompt
**Then** the grammar and flow are improved
**And** the original intent is preserved
**And** the optimized version is more natural

---

### Requirement: API Error Handling

The application MUST handle DeepSeek API failures gracefully and return meaningful error responses.

**Acceptance Criteria:**
- Network errors return HTTP 503 with message "DeepSeek service unavailable"
- Invalid API key returns HTTP 401 with message "Invalid API key"
- Timeout (>10 seconds) returns HTTP 504 with message "Request timeout"
- Rate limiting returns HTTP 429 with message "Rate limit exceeded"
- All errors include `{"success": false, "error": "<message>"}`

#### Scenario: DeepSeek API is Unreachable

**Given** the DeepSeek API endpoint is down or unreachable
**When** the `/api/optimize` endpoint attempts to call DeepSeek
**Then** the network request fails
**And** the endpoint returns HTTP 503 status code
**And** the response body is `{"success": false, "error": "DeepSeek service unavailable"}`

#### Scenario: API Key is Invalid

**Given** the `DEEPSEEK_API_KEY` is set but incorrect
**When** the DeepSeek API rejects the authentication
**Then** the endpoint returns HTTP 401 status code
**And** the response body is `{"success": false, "error": "Invalid API key"}`

#### Scenario: Request Timeout

**Given** the DeepSeek API takes longer than 10 seconds to respond
**When** the timeout threshold is exceeded
**Then** the request is aborted
**And** the endpoint returns HTTP 504 status code
**And** the response body is `{"success": false, "error": "Request timeout"}`

---

### Requirement: API Response Format

The application MUST return a consistent JSON response format for successful and failed optimization requests.

**Acceptance Criteria:**
- Success response includes: `success`, `prefix`, `optimizedPrompt`, `suffix`, `fullText`
- Error response includes: `success: false`, `error`
- `fullText` is the concatenation: `{prefix} {optimizedPrompt}{suffix}`
- All string fields use UTF-8 encoding
- Response has `Content-Type: application/json`

#### Scenario: Successful Optimization Response

**Given** the DeepSeek API successfully processes a prompt
**When** the `/api/optimize` endpoint returns the result
**Then** the response status is HTTP 200
**And** the response body structure is:
```json
{
  "success": true,
  "prefix": "你是 AI 辅助软件开发专家",
  "optimizedPrompt": "请问氛围编程这个提法是谁在什么时候提出的?",
  "suffix": " 请提供主要观点的3个不同出处的网页链接以便我查验。如果你不知道或查不到,就实说,不要编造",
  "fullText": "你是 AI 辅助软件开发专家 请问氛围编程这个提法是谁在什么时候提出的? 请提供主要观点的3个不同出处的网页链接以便我查验。如果你不知道或查不到,就实说,不要编造"
}
```

#### Scenario: Error Response Format

**Given** an error occurs during optimization
**When** the endpoint returns the error
**Then** the response body structure is:
```json
{
  "success": false,
  "error": "DeepSeek service unavailable"
}
```
**And** the HTTP status code reflects the error type

---

### Requirement: API Endpoint Route

The application MUST expose a POST endpoint at `/api/optimize` for prompt optimization requests.

**Acceptance Criteria:**
- Endpoint path is `/api/optimize`
- Accepts POST requests only (GET/PUT/DELETE return 405)
- Request body must contain `{"prompt": "string"}`
- Empty or whitespace-only prompts return HTTP 400 "Prompt is required"
- Endpoint is server-side only (not accessible from static export)

#### Scenario: Valid POST Request

**Given** a client sends POST to `/api/optimize` with body `{"prompt": "什么是机器学习"}`
**When** the endpoint receives the request
**Then** the request is processed
**And** a JSON response is returned (success or error)

#### Scenario: Invalid HTTP Method

**Given** a client sends GET to `/api/optimize`
**When** the endpoint receives the request
**Then** HTTP 405 "Method Not Allowed" is returned

#### Scenario: Missing Prompt in Request

**Given** a client sends POST to `/api/optimize` with body `{}`
**When** the endpoint validates the request
**Then** HTTP 400 is returned
**And** the response is `{"success": false, "error": "Prompt is required"}`

---

### Requirement: Automated API Tests

The application MUST include API-level automated tests for the `/api/optimize` endpoint following TDD approach.

**Acceptance Criteria:**
- Tests are written before implementation
- Tests use Vitest framework
- Tests mock DeepSeek API using MSW (Mock Service Worker)
- Tests cover success cases, error cases, and edge cases
- Tests run with `npm test` or `vitest` command
- Initial test run shows failures (no implementation yet)

#### Scenario: Test Suite for Domain Analysis

**Given** the test file `__tests__/api/optimize.test.ts` exists
**When** the test suite runs
**Then** tests verify domain-specific prefix generation for:
- Programming prompts → programming expert prefix
- Medical prompts → medical expert prefix
- General prompts → appropriate general prefix

#### Scenario: Test Suite for Error Handling

**Given** the test file includes error case tests
**When** MSW mocks simulate:
- Missing API key
- DeepSeek service down
- Invalid API key
- Request timeout
**Then** each test verifies the correct HTTP status and error message

#### Scenario: TDD Workflow - Initial Test Run

**Given** the tests are written but implementation does not exist
**When** the developer runs `npm test`
**Then** all tests fail with clear error messages
**And** the test output guides implementation
**And** the developer can proceed to implement the API endpoint

---

