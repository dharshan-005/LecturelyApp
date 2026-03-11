export interface Subtitle {
  id: number;
  start: number;
  end: number;
  original: string;
  translated: string;
}

export type AppView = 'upload' | 'processing' | 'editor';