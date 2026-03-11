export interface PracticeItem {
  id: string;
  projectId?: string;
  stageName: string;
  youtubeUrl: string;
  practiceSeconds: number;
  restSeconds: number;
  startSecond?: number;
  endSecond?: number;
  orderIdx?: number;
}

export type TimerState = 'IDLE' | 'PREPARING' | 'PRACTICING' | 'RESTING' | 'FINISHED';
