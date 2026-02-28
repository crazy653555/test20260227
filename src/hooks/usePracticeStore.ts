import { useState, useEffect } from 'react';
import type { PracticeItem } from '../types';

const STORAGE_KEY = 'mytrainingplan_practice_items';
const REST_URL_STORAGE_KEY = 'mytrainingplan_rest_video_url';

export const usePracticeStore = () => {
    const [items, setItems] = useState<PracticeItem[]>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    });

    const [restVideoUrl, setRestVideoUrl] = useState<string>(() => {
        return localStorage.getItem(REST_URL_STORAGE_KEY) || 'https://www.youtube.com/watch?v=leZaQ2JIvTM';
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    useEffect(() => {
        localStorage.setItem(REST_URL_STORAGE_KEY, restVideoUrl);
    }, [restVideoUrl]);

    const addItem = (item: Omit<PracticeItem, 'id'>) => {
        const newItem: PracticeItem = {
            ...item,
            id: crypto.randomUUID(),
        };
        setItems((prev) => [...prev, newItem]);
    };

    const updateItem = (id: string, updatedFields: Partial<Omit<PracticeItem, 'id'>>) => {
        setItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
        );
    };

    const removeItem = (id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const moveItem = (index: number, direction: 'UP' | 'DOWN') => {
        if (
            (direction === 'UP' && index === 0) ||
            (direction === 'DOWN' && index === items.length - 1)
        ) return;

        setItems((prev) => {
            const newItems = [...prev];
            const swapIndex = direction === 'UP' ? index - 1 : index + 1;
            [newItems[index], newItems[swapIndex]] = [newItems[swapIndex], newItems[index]];
            return newItems;
        });
    };

    return { items, addItem, updateItem, removeItem, moveItem, restVideoUrl, setRestVideoUrl };
};
