/// <summary>
/// 代表一個單獨訓練階段 (Stage) 的資料結構
/// </summary>
export interface PracticeItem {
  /// 階段的唯一識別碼 (對應後端 Stage.Id)
  id: string;
  /// 所屬專案的唯一識別碼
  projectId?: string;
  /// 訓練階段的名稱 (例如："深蹲"、"伏地挺身")
  stageName: string;
  /// 該階段搭配播放的 YouTube 影片連結
  youtubeUrl: string;
  /// 本階段所設定的訓練時間長度 (秒)
  practiceSeconds: number;
  /// 本階段結束後所需要的休息時間長度 (秒)
  restSeconds: number;
  /// 影片開始播放的秒數
  startSecond?: number;
  /// 影片結束播放的秒數 (可選填)
  endSecond?: number;
  /// 在所有階段列表中的排序順序 (數字越小越前面)
  orderIdx?: number;
}

/// <summary>
/// 定義整個訓練計畫在播放時可能處於的狀態
/// IDLE (閒置) -> PREPARING (預備倒數) -> PRACTICING (訓練中) -> RESTING (休息中) -> FINISHED (全部完成)
/// </summary>
export type TimerState = 'IDLE' | 'PREPARING' | 'PRACTICING' | 'RESTING' | 'FINISHED';
