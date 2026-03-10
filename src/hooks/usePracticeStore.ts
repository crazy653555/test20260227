import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import type { PracticeItem } from '../types';

// Hardcoded for V1
const PROJECT_ID = '00000000-0000-0000-0000-000000000001';

export const usePracticeStore = () => {
    const queryClient = useQueryClient();

    // GET Project (for global rest video)
    const { data: projectData } = useQuery({
        queryKey: ['project', PROJECT_ID],
        queryFn: async () => {
            const res = await api.get(`/projects/${PROJECT_ID}`);
            return res.data;
        }
    });

    const restVideoUrl = projectData?.globalRestVideoUrl || 'https://www.youtube.com/watch?v=leZaQ2JIvTM';

    const updateProjectMutation = useMutation({
        mutationFn: async (newUrl: string) => {
            if (!projectData) return;
            await api.put(`/projects/${PROJECT_ID}`, {
                ...projectData,
                globalRestVideoUrl: newUrl
            });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['project', PROJECT_ID] })
    });

    const setRestVideoUrl = (url: string) => {
        updateProjectMutation.mutate(url);
    };

    // GET Stages (Items)
    const { data: items = [] } = useQuery<PracticeItem[]>({
        queryKey: ['stages', PROJECT_ID],
        queryFn: async () => {
            const res = await api.get(`/stages/project/${PROJECT_ID}`);
            return res.data;
        }
    });

    // Mutations
    const addMutation = useMutation({
        mutationFn: async (item: Omit<PracticeItem, 'id' | 'projectId'>) => {
            await api.post('/stages', { ...item, projectId: PROJECT_ID });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['stages', PROJECT_ID] })
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, updatedFields }: { id: string, updatedFields: Partial<Omit<PracticeItem, 'id'>> }) => {
            const target = items.find(i => i.id === id);
            if (!target) return;
            await api.put(`/stages/${id}`, { ...target, ...updatedFields });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['stages', PROJECT_ID] })
    });

    const removeMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/stages/${id}`);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['stages', PROJECT_ID] })
    });

    const reorderMutation = useMutation({
        mutationFn: async (updates: { id: string, orderIdx: number }[]) => {
            await api.put(`/stages/project/${PROJECT_ID}/reorder`, updates);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['stages', PROJECT_ID] })
    });

    const addItem = (item: Omit<PracticeItem, 'id'>) => addMutation.mutate(item);

    const updateItem = (id: string, updatedFields: Partial<Omit<PracticeItem, 'id'>>) => {
        updateMutation.mutate({ id, updatedFields });
    };

    const removeItem = (id: string) => removeMutation.mutate(id);

    const moveItem = (index: number, direction: 'UP' | 'DOWN') => {
        if (
            (direction === 'UP' && index === 0) ||
            (direction === 'DOWN' && index === items.length - 1)
        ) return;

        const newItems = [...items];
        const swapIndex = direction === 'UP' ? index - 1 : index + 1;
        [newItems[index], newItems[swapIndex]] = [newItems[swapIndex], newItems[index]];

        // Re-assign orderIdx for all to be safe
        const updates = newItems.map((item, idx) => ({ id: item.id, orderIdx: idx }));

        // Optimistically update cache to feel snappy? Or just let mutation invalidate.
        // For simplicity, we just mutate and wait for refetch.
        reorderMutation.mutate(updates);
    };

    return {
        items,
        addItem,
        updateItem,
        removeItem,
        moveItem,
        restVideoUrl,
        setRestVideoUrl
    };
};
