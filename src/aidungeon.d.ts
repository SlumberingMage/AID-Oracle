declare class AiDungeonHistoryAction {
  text: string
  rawText: string
  type: 'start' | 'continue' | 'do' | 'say' | 'story' | 'see' | string
}

declare class AiDungeonStoryCard {
  id: number
  keys: string
  entry: string
  type: string
}

declare class AiDungeonMemory {
  context: string
  authorsNote: string
  frontMemory: string
}

declare class AiDungeonPlaceholder {
  question: string
  answer: string
}

declare class AiDungeonState {
  memory: AiDungeonMemory
  message?: string
  placeholders?: AiDungeonPlaceholder[]
  [key: string]: any
}

declare class AiDungeonInfo {
  characterNames: string[]
  actionCount: number
  maxChars?: number
  memoryLength?: number
  [key: string]: any
}

declare class AiDungeonReturn {
  text?: string
  stop?: boolean
  state?: AiDungeonState
  history?: AiDungeonHistoryAction[]
  storyCards?: AiDungeonStoryCard[]
  info?: AiDungeonInfo
}

declare const text: string
declare const history: AiDungeonHistoryAction[]
declare const storyCards: AiDungeonStoryCard[]
declare const worldInfo: AiDungeonStoryCard[]
declare const state: AiDungeonState
declare const info: AiDungeonInfo

declare function log(message: unknown): void
declare function addStoryCard(keys: string, entry: string, type?: string): number | false
declare function addWorldEntry(keys: string, entry: string, type?: string): number | false
declare function removeStoryCard(index: number): void
declare function removeWorldEntry(index: number): void
declare function updateStoryCard(index: number, keys: string, entry: string, type?: string): void
declare function updateWorldEntry(index: number, keys: string, entry: string, type?: string): void
