# API Error Troubleshooting

Issues related to OpenRouter API integration.

## Table of Contents

- [Authentication Errors](#authentication-errors)
- [Rate Limiting](#rate-limiting)
- [Streaming Issues](#streaming-issues)
- [Model Not Available](#model-not-available)
- [Timeout Errors](#timeout-errors)

---

## Authentication Errors

### Symptom
```
Error: 401 Unauthorized
```

### Cause
- Invalid API key
- Expired API key
- Key not properly stored/retrieved

### Solution
1. Verify API key is valid at [openrouter.ai](https://openrouter.ai)
2. Check key storage:
   ```typescript
   const key = await safeStorage.decryptString(encryptedKey);
   console.log('Key starts with:', key.substring(0, 8));
   ```
3. Test with curl:
   ```bash
   curl -H "Authorization: Bearer sk-or-..." https://openrouter.ai/api/v1/models
   ```

### Prevention
- Validate key on save
- Show clear error messages for auth failures

---

## Rate Limiting

### Symptom
```
Error: 429 Too Many Requests
```

### Cause
Exceeded API rate limits.

### Solution
1. Implement exponential backoff:
   ```typescript
   async function fetchWithRetry(fn: () => Promise<Response>, maxRetries = 3) {
     for (let i = 0; i < maxRetries; i++) {
       try {
         const response = await fn();
         if (response.status === 429) {
           const waitTime = Math.pow(2, i) * 1000;
           await new Promise(r => setTimeout(r, waitTime));
           continue;
         }
         return response;
       } catch (error) {
         if (i === maxRetries - 1) throw error;
       }
     }
   }
   ```
2. Check rate limit headers in response
3. Implement request queuing

### Prevention
- Add request throttling
- Show user feedback when rate limited

---

## Streaming Issues

### Symptom
- Streaming stops mid-response
- Incomplete responses
- Connection reset errors

### Cause
- Network interruption
- Server-side timeout
- Client not properly handling stream

### Solution
1. Implement proper stream handling:
   ```typescript
   const response = await fetch(url, { ... });
   const reader = response.body?.getReader();

   while (true) {
     const { done, value } = await reader.read();
     if (done) break;
     // Process chunk
   }
   ```
2. Add reconnection logic
3. Handle partial responses gracefully

### Prevention
- Save partial responses
- Allow resuming from last chunk

---

## Model Not Available

### Symptom
```
Error: Model not found or not available
```

### Cause
- Model ID incorrect
- Model temporarily unavailable
- Model requires special access

### Solution
1. Verify model ID against `/models` endpoint
2. Check model availability status
3. Fall back to alternative model:
   ```typescript
   const fallbackModels = [
     'anthropic/claude-3.5-sonnet',
     'openai/gpt-4o',
     'google/gemini-pro',
   ];
   ```

### Prevention
- Refresh model list regularly
- Show model status in UI

---

## Timeout Errors

### Symptom
```
Error: Request timeout
```

### Cause
- Long response generation
- Network latency
- Server overload

### Solution
1. Increase timeout for long requests:
   ```typescript
   const controller = new AbortController();
   const timeout = setTimeout(() => controller.abort(), 120000);

   const response = await fetch(url, {
     signal: controller.signal,
     // ...
   });

   clearTimeout(timeout);
   ```
2. Show progress indicator to user
3. Allow user to cancel long requests

### Prevention
- Set appropriate timeouts based on expected response length
- Warn users about long-running requests

---

## Context Length Exceeded

### Symptom
```
Error: 400 Bad Request - context_length_exceeded
```

### Cause
Message history exceeds model's maximum context window.

### Solution
1. Implement automatic context truncation:
   ```typescript
   function truncateMessages(messages: Message[], maxTokens: number): Message[] {
     // Keep system message, truncate from middle
     const systemMsg = messages.find(m => m.role === 'system')
     const others = messages.filter(m => m.role !== 'system')

     // Keep recent messages, remove old ones
     while (countTokens(messages) > maxTokens && others.length > 2) {
       others.shift()  // Remove oldest
     }

     return systemMsg ? [systemMsg, ...others] : others
   }
   ```
2. Show token count in UI
3. Allow user to clear history

### Prevention
- Monitor token count before sending
- Warn when approaching limit

---

## Insufficient Credits

### Symptom
```
Error: 402 Payment Required
```

### Cause
OpenRouter account has insufficient credits.

### Solution
1. Display clear error to user
2. Link to OpenRouter dashboard to add credits
3. Consider showing estimated cost before sending

### Prevention
- Check credit balance periodically
- Warn when credits are low

---

## Content Filter

### Symptom
```
Error: 400 Bad Request - content_policy_violation
```

### Cause
Request or response flagged by content moderation.

### Solution
1. Show user-friendly message explaining content policy
2. Suggest rephrasing the request
3. Log for review (without sensitive content)

### Prevention
- Pre-filter obvious violations
- Show content guidelines to users

---

## Error Response Format

OpenRouter returns errors in this format:

```json
{
  "error": {
    "message": "Human-readable error message",
    "type": "error_type",
    "code": "error_code"
  }
}
```

Handle all error types appropriately in the UI.
