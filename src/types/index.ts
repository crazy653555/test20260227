export interface PracticeItem {
  id: string;
  youtubeUrl: string;
  name: string;
  practiceDuration: number; // 練習時間 (秒)
  restDuration: number; // 休息時間 (秒)
  startSecond?: number; // 影片開始播放秒數
  endSecond?: number; // 影片結束播放秒數
}

export type TimerState = 'IDLE' | 'PREPARING' | 'PRACTICING' | 'RESTING' | 'FINISHED';
