/**
 * Eidolon Shared Types
 * Core data models used across desktop and web apps
 */

// ============================================
// Conversation & Messages
// ============================================

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  systemPrompt?: string;
  modelId?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  modelId?: string;
  tokenCount?: number;
  createdAt: number;
}

export type MessageRole = Message['role'];

// ============================================
// Documents & Version Control
// ============================================

export interface Document {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  currentBranchId: string;
}

export interface Branch {
  id: string;
  documentId: string;
  name: string;
  parentBranchId?: string;
  createdAt: number;
}

export interface Version {
  id: string;
  branchId: string;
  content: string;
  message?: string;
  createdAt: number;
}

// ============================================
// Image Generation
// ============================================

export interface GeneratedImage {
  id: string;
  prompt: string;
  modelId: string;
  settings: ImageGenerationSettings;
  filePath: string;
  thumbnailPath?: string;
  favorite: boolean;
  createdAt: number;
}

export interface ImageGenerationSettings {
  width?: number;
  height?: number;
  style?: string;
  quality?: 'standard' | 'hd';
  [key: string]: unknown;
}

// ============================================
// Settings
// ============================================

export interface Settings {
  apiKeys: {
    openrouter?: string;
  };
  defaults: {
    modelId: string;
    theme: Theme;
    accentColor: string;
    sendOnEnter: boolean;
    autoSaveInterval: number;
    showTokenCount: boolean;
    showCostEstimate: boolean;
  };
  appearance: {
    fontSize: 'small' | 'medium' | 'large';
    sidebarPosition: 'left' | 'right';
    sidebarCollapsed: boolean;
    compactMode: boolean;
  };
}

export type Theme = 'dark' | 'light' | 'system';

// ============================================
// AI Models
// ============================================

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  contextWindow: number;
  pricing: {
    prompt: number;
    completion: number;
  };
  capabilities: ModelCapabilities;
}

export interface ModelCapabilities {
  chat: boolean;
  vision: boolean;
  functionCalling: boolean;
  streaming: boolean;
}

// ============================================
// API Types
// ============================================

export interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  stream?: boolean;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

export interface ChatMessage {
  role: MessageRole;
  content: string | ChatMessageContent[];
}

export interface ChatMessageContent {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: {
    url: string;
  };
}

export interface ChatCompletionResponse {
  id: string;
  choices: {
    message: {
      role: 'assistant';
      content: string;
    };
    finishReason: string;
  }[];
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface StreamChunk {
  id: string;
  choices: {
    delta: {
      content?: string;
    };
    finishReason?: string;
  }[];
}

// ============================================
// IPC Types (Electron)
// ============================================

export interface IPCChannels {
  // Settings
  'settings:get': () => Promise<Settings>;
  'settings:set': (settings: Partial<Settings>) => Promise<void>;
  'settings:getApiKey': () => Promise<string | null>;
  'settings:setApiKey': (key: string) => Promise<void>;

  // Conversations
  'conversations:list': () => Promise<Conversation[]>;
  'conversations:get': (id: string) => Promise<Conversation | null>;
  'conversations:create': (data: Omit<Conversation, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Conversation>;
  'conversations:update': (id: string, data: Partial<Conversation>) => Promise<void>;
  'conversations:delete': (id: string) => Promise<void>;

  // Messages
  'messages:list': (conversationId: string) => Promise<Message[]>;
  'messages:create': (data: Omit<Message, 'id' | 'createdAt'>) => Promise<Message>;
  'messages:delete': (id: string) => Promise<void>;

  // Documents
  'documents:list': () => Promise<Document[]>;
  'documents:get': (id: string) => Promise<Document | null>;
  'documents:create': (data: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Document>;
  'documents:update': (id: string, data: Partial<Document>) => Promise<void>;
  'documents:delete': (id: string) => Promise<void>;

  // Chat
  'chat:send': (request: ChatCompletionRequest) => Promise<ChatCompletionResponse>;
  'chat:stream': (request: ChatCompletionRequest) => void;
  'chat:cancel': () => void;

  // Models
  'models:list': () => Promise<AIModel[]>;
  'models:refresh': () => Promise<AIModel[]>;
}

// ============================================
// Utility Types
// ============================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Nullable<T> = T | null;

export type AsyncResult<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };
