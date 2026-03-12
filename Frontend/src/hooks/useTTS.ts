import { useCallback, useRef } from 'react';

/// <summary>
/// Web Speech API (語音合成) 的設定選項介面
/// </summary>
interface UseTTSOptions {
    rate?: number;   // 語音播放速度，預設為 1 (正常倍速)
    pitch?: number;  // 語音音調高低，預設為 1 (正常音調)
    volume?: number; // 語音音量大小，預設為 1 (最大音量)
    lang?: string;   // 播放使用的語言代碼，預設為 'zh-TW' (繁體中文)
}

/// <summary>
/// 提供語音合成功能 (Text-to-Speech) 的自定義 Hook
/// </summary>
/// <param name="options">初始的語音設定參數</param>
/// <returns>回傳 speak(發聲), cancel(取消), 以及 isSpeaking(正在說話中狀態)</returns>
export const useTTS = (options: UseTTSOptions = {}) => {
    // 解構取得設定值並給予預設值
    const { rate = 1, pitch = 1, volume = 1, lang = 'zh-TW' } = options;
    
    // 取得瀏覽器原生的 SpeechSynthesis 物件
    const synth = window.speechSynthesis;
    
    // 使用 useRef 來追蹤目前是否正在發聲，以避免依賴重繪導致狀態延遲
    const isSpeakingRef = useRef(false);

    /// <summary>
    /// 命令瀏覽器以語音讀出指定的字串
    /// </summary>
    /// <param name="text">欲轉換為語音朗讀的文字內容</param>
    /// <param name="onEnd">朗讀結束後可選的回呼函式 (Callback)</param>
    const speak = useCallback(
        (text: string, onEnd?: () => void) => {
            // 如果瀏覽器不支援 TTS 就提早返回並不中斷程式
            if (!synth) {
                console.warn('此瀏覽器不支援 Web Speech API (TTS)');
                onEnd?.();
                return;
            }

            // 若目前已經有正在說話的內容，先中斷當前的發音，準備讀最新的內容
            if (synth.speaking) {
                synth.cancel();
            }

            // 建立一筆語音內容請求 (Utterance)
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = rate;     // 套用預設語速
            utterance.pitch = pitch;   // 套用預設音調
            utterance.volume = volume; // 套用預設音量
            utterance.lang = lang;     // 套用預設語言

            // 綁定「開始發聲」事件，標記為說話中
            utterance.onstart = () => {
                isSpeakingRef.current = true;
            };

            // 綁定「發聲結束」事件，標記為已結束並呼叫回呼函式
            utterance.onend = () => {
                isSpeakingRef.current = false;
                onEnd?.();
            };

            // 綁定「發聲錯誤」事件
            utterance.onerror = (e) => {
                console.error(' TTS 發聲錯誤:', e);
                isSpeakingRef.current = false;
                onEnd?.();
            };

            // 正式送出這筆請求到合成器朗讀
            synth.speak(utterance);
        },
        [synth, rate, pitch, volume, lang]
    );

    /// <summary>
    /// 取消目前一切正在發出的語音朗讀
    /// </summary>
    const cancel = useCallback(() => {
        if (synth && synth.speaking) {
            synth.cancel();
            isSpeakingRef.current = false;
        }
    }, [synth]);

    // 將可用的操作方法以及當前說話狀態匯出供外部 Component 呼叫使用
    return { speak, cancel, isSpeaking: isSpeakingRef.current };
};
