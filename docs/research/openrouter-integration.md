# OpenRouter API Integration Research

## Overview

This document covers integrating OpenRouter's API for the Eidolon desktop application's AI chat and document review features.

## Why OpenRouter?

| Feature | Benefit |
|---------|---------|
| Multi-Provider | Access GPT-4, Claude, Llama, etc. via single API |
| BYOK Model | Users provide their own API key |
| Unified Format | OpenAI-compatible API format |
| Usage Tracking | Built-in cost and usage metrics |
| Fallback Routes | Automatic provider failover |

## API Basics

### Base URL

```
https://openrouter.ai/api/v1
```

### Authentication

```typescript
const headers = {
  'Authorization': `Bearer ${apiKey}`,
  'HTTP-Referer': 'https://eidolon.app',  // Required
  'X-Title': 'Eidolon'                     // Optional, shown in dashboard
}
```

### Models Endpoint

```typescript
// GET /api/v1/models
interface Model {
  id: string                    // e.g., "openai/gpt-4-turbo"
  name: string                  // e.g., "GPT-4 Turbo"
  description: string
  pricing: {
    prompt: string              // Cost per 1M tokens (e.g., "10")
    completion: string          // Cost per 1M tokens
    image: string               // Cost per image (for vision models)
    request: string             // Cost per request
  }
  context_length: number        // Max context window
  architecture: {
    modality: string            // "text", "text+image"
    tokenizer: string           // "GPT", "Claude", etc.
    instruct_type: string | null
  }
  top_provider: {
    context_length: number
    max_completion_tokens: number
    is_moderated: boolean
  }
  per_request_limits: {
    prompt_tokens: string
    completion_tokens: string
  } | null
}
```

## Chat Completions

### Request Format

```typescript
interface ChatCompletionRequest {
  model: string
  messages: Array<{
    role: 'system' | 'user' | 'assistant'
    content: string | Array<{
      type: 'text' | 'image_url'
      text?: string
      image_url?: { url: string }
    }>
  }>
  stream?: boolean
  temperature?: number          // 0-2, default varies by model
  max_tokens?: number
  top_p?: number
  frequency_penalty?: number
  presence_penalty?: number
  stop?: string | string[]
  transforms?: string[]         // OpenRouter-specific transformations
  route?: 'fallback'           // Enable automatic provider fallback
}
```

### Response Format (Non-Streaming)

```typescript
interface ChatCompletionResponse {
  id: string
  model: string                 // Actual model used (may differ if fallback)
  object: 'chat.completion'
  created: number
  choices: Array<{
    index: number
    message: {
      role: 'assistant'
      content: string
    }
    finish_reason: 'stop' | 'length' | 'content_filter' | null
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}
```

## Streaming Implementation

### Server-Sent Events (SSE)

```typescript
// electron/services/openrouter.ts
import { EventEmitter } from 'events'

export class OpenRouterClient extends EventEmitter {
  private apiKey: string
  private baseUrl = 'https://openrouter.ai/api/v1'

  constructor(apiKey: string) {
    super()
    this.apiKey = apiKey
  }

  async *streamChat(
    request: ChatCompletionRequest
  ): AsyncGenerator<StreamChunk, void, unknown> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'HTTP-Referer': 'https://eidolon.app',
        'X-Title': 'Eidolon'
      },
      body: JSON.stringify({ ...request, stream: true })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new OpenRouterError(response.status, error)
    }

    const reader = response.body!.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') return

          try {
            const chunk: StreamChunk = JSON.parse(data)
            yield chunk
          } catch {
            // Skip invalid JSON lines
          }
        }
      }
    }
  }
}

interface StreamChunk {
  id: string
  model: string
  object: 'chat.completion.chunk'
  created: number
  choices: Array<{
    index: number
    delta: {
      role?: 'assistant'
      content?: string
    }
    finish_reason: 'stop' | 'length' | null
  }>
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}
```

### IPC Streaming

```typescript
// electron/ipc/chat.ts
import { ipcMain, BrowserWindow } from 'electron'

ipcMain.handle('chat:stream', async (event, request: ChatCompletionRequest) => {
  const client = getOpenRouterClient()
  const window = BrowserWindow.fromWebContents(event.sender)!

  const streamId = crypto.randomUUID()

  // Start streaming in background
  ;(async () => {
    try {
      for await (const chunk of client.streamChat(request)) {
        window.webContents.send('chat:chunk', { streamId, chunk })
      }
      window.webContents.send('chat:complete', { streamId })
    } catch (error) {
      window.webContents.send('chat:error', { streamId, error: serializeError(error) })
    }
  })()

  return { streamId }
})
```

```typescript
// src/lib/chat-api.ts (renderer)
export function streamChat(
  request: ChatCompletionRequest,
  onChunk: (content: string) => void,
  onComplete: () => void,
  onError: (error: Error) => void
): () => void {
  let cancelled = false

  window.api.invoke('chat:stream', request).then(({ streamId }) => {
    const handleChunk = (_: unknown, data: { streamId: string; chunk: StreamChunk }) => {
      if (data.streamId !== streamId || cancelled) return
      const content = data.chunk.choices[0]?.delta?.content
      if (content) onChunk(content)
    }

    const handleComplete = (_: unknown, data: { streamId: string }) => {
      if (data.streamId !== streamId) return
      cleanup()
      onComplete()
    }

    const handleError = (_: unknown, data: { streamId: string; error: unknown }) => {
      if (data.streamId !== streamId) return
      cleanup()
      onError(deserializeError(data.error))
    }

    const cleanup = () => {
      window.api.off('chat:chunk', handleChunk)
      window.api.off('chat:complete', handleComplete)
      window.api.off('chat:error', handleError)
    }

    window.api.on('chat:chunk', handleChunk)
    window.api.on('chat:complete', handleComplete)
    window.api.on('chat:error', handleError)
  })

  // Return cancel function
  return () => { cancelled = true }
}
```

## Error Handling

### Error Types

```typescript
class OpenRouterError extends Error {
  constructor(
    public status: number,
    public body: {
      error: {
        message: string
        type: string
        code: string
      }
    }
  ) {
    super(body.error.message)
    this.name = 'OpenRouterError'
  }
}

// Common error codes
const ErrorCodes = {
  INVALID_API_KEY: 401,
  RATE_LIMITED: 429,
  MODEL_NOT_FOUND: 404,
  CONTEXT_LENGTH_EXCEEDED: 400,
  CONTENT_POLICY_VIOLATION: 400,
  INSUFFICIENT_CREDITS: 402,
  SERVER_ERROR: 500,
  PROVIDER_ERROR: 502
}
```

### Retry Strategy

```typescript
// electron/services/api-client.ts
interface RetryConfig {
  maxRetries: number
  baseDelay: number
  maxDelay: number
  retryableStatuses: number[]
}

const defaultRetryConfig: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 30000,
  retryableStatuses: [429, 500, 502, 503, 504]
}

async function withRetry<T>(
  fn: () => Promise<T>,
  config = defaultRetryConfig
): Promise<T> {
  let lastError: Error

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error

      if (error instanceof OpenRouterError) {
        // Don't retry non-retryable errors
        if (!config.retryableStatuses.includes(error.status)) {
          throw error
        }

        // Handle rate limiting with Retry-After header
        if (error.status === 429) {
          const retryAfter = parseInt(error.body.error.message.match(/\d+/)?.[0] || '60')
          await sleep(retryAfter * 1000)
          continue
        }
      }

      if (attempt < config.maxRetries) {
        const delay = Math.min(
          config.baseDelay * Math.pow(2, attempt),
          config.maxDelay
        )
        await sleep(delay)
      }
    }
  }

  throw lastError!
}
```

## Rate Limiting

### Client-Side Rate Limiter

```typescript
// electron/services/rate-limiter.ts
class RateLimiter {
  private queue: Array<() => void> = []
  private running = 0
  private maxConcurrent: number
  private minDelay: number

  constructor(maxConcurrent = 5, minDelay = 100) {
    this.maxConcurrent = maxConcurrent
    this.minDelay = minDelay
  }

  async acquire(): Promise<void> {
    if (this.running < this.maxConcurrent) {
      this.running++
      return
    }

    return new Promise((resolve) => {
      this.queue.push(resolve)
    })
  }

  release(): void {
    setTimeout(() => {
      this.running--
      const next = this.queue.shift()
      if (next) {
        this.running++
        next()
      }
    }, this.minDelay)
  }

  async wrap<T>(fn: () => Promise<T>): Promise<T> {
    await this.acquire()
    try {
      return await fn()
    } finally {
      this.release()
    }
  }
}

export const rateLimiter = new RateLimiter()
```

## Token Counting

```typescript
// electron/services/tokens.ts
import { encode } from 'gpt-tokenizer'  // Or tiktoken

export function countTokens(text: string, model: string): number {
  // Most models use GPT tokenizer
  // Claude uses different tokenizer but GPT is close enough for estimates
  return encode(text).length
}

export function estimateMessageTokens(messages: Message[]): number {
  let total = 0

  for (const msg of messages) {
    // ~4 tokens per message for formatting
    total += 4
    total += countTokens(msg.content, 'gpt-4')

    if (msg.role === 'system') {
      total += 1  // "name" field overhead
    }
  }

  // Every reply primed with <|start|>assistant<|message|>
  total += 3

  return total
}

export function estimateCost(
  tokens: { input: number; output: number },
  model: Model
): number {
  const inputCost = (tokens.input / 1_000_000) * parseFloat(model.pricing.prompt)
  const outputCost = (tokens.output / 1_000_000) * parseFloat(model.pricing.completion)
  return inputCost + outputCost
}
```

## Model Selection

```typescript
// electron/services/models.ts
import { database } from './database'

export class ModelService {
  private models: Model[] = []
  private lastFetch = 0
  private cacheTime = 1000 * 60 * 60  // 1 hour

  async getModels(forceRefresh = false): Promise<Model[]> {
    const now = Date.now()

    if (!forceRefresh && this.models.length && now - this.lastFetch < this.cacheTime) {
      return this.models
    }

    try {
      const response = await fetch('https://openrouter.ai/api/v1/models')
      const data = await response.json()
      this.models = data.data
      this.lastFetch = now

      // Cache to database for offline access
      this.cacheModels(this.models)

      return this.models
    } catch {
      // Fall back to cached models
      return this.getCachedModels()
    }
  }

  getModelById(id: string): Model | undefined {
    return this.models.find(m => m.id === id)
  }

  getRecommendedModels(): Model[] {
    // Filter to commonly used, well-performing models
    const recommended = [
      'anthropic/claude-3.5-sonnet',
      'openai/gpt-4-turbo',
      'openai/gpt-4o',
      'anthropic/claude-3-opus',
      'meta-llama/llama-3.1-70b-instruct',
      'google/gemini-pro-1.5'
    ]

    return this.models.filter(m => recommended.includes(m.id))
  }

  private cacheModels(models: Model[]): void {
    // Implementation...
  }

  private getCachedModels(): Model[] {
    // Implementation...
  }
}
```

## Security Considerations

1. **API Key Storage**: Use Electron's safeStorage
2. **HTTPS Only**: All requests over TLS
3. **Input Validation**: Sanitize user input before API calls
4. **Rate Limiting**: Prevent abuse
5. **Error Messages**: Don't expose API key in error messages

## References

- [OpenRouter API Documentation](https://openrouter.ai/docs)
- [OpenRouter Models](https://openrouter.ai/models)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference) (compatible format)
