import { useCallback, useRef } from 'react';

interface UseTTSOptions {
    rate?: number; // 語速，預設 1
    pitch?: number; // 音調，預設 1
    volume?: number; // 音量，預設 1
    lang?: string; // 語言，預設 'zh-TW'
}

export const useTTS = (options: UseTTSOptions = {}) => {
    const { rate = 1, pitch = 1, volume = 1, lang = 'zh-TW' } = options;
    const synth = window.speechSynthesis;
    const isSpeakingRef = useRef(false);

    const speak = useCallback(
        (text: string, onEnd?: () => void) => {
            if (!synth) {
                console.warn('此瀏覽器不支援 Web Speech API (TTS)');
                onEnd?.();
                return;
            }

            // 若正在說話，可選擇中斷目前發言 (或可以調整為排入佇列)
            if (synth.speaking) {
                synth.cancel();
            }

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = rate;
            utterance.pitch = pitch;
            utterance.volume = volume;
            utterance.lang = lang;

            utterance.onstart = () => {
                isSpeakingRef.current = true;
            };

            utterance.onend = () => {
                isSpeakingRef.current = false;
                onEnd?.();
            };

            utterance.onerror = (e) => {
                console.error(' TTS 發聲錯誤:', e);
                isSpeakingRef.current = false;
                onEnd?.();
            };

            synth.speak(utterance);
        },
        [synth, rate, pitch, volume, lang]
    );

    const cancel = useCallback(() => {
        if (synth && synth.speaking) {
            synth.cancel();
            isSpeakingRef.current = false;
        }
    }, [synth]);

    return { speak, cancel, isSpeaking: isSpeakingRef.current };
};
