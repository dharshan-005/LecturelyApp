export interface Subtitle {
  id: number;
  start: string;
  end: string;
  original: string;
  translated: string;
}

export type AppView = 'upload' | 'processing' | 'editor';