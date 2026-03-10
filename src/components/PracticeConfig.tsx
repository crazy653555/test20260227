import React, { useState, useMemo } from 'react';
import { usePracticeStore } from '../hooks/usePracticeStore';

interface PracticeConfigProps {
    onStartPractice?: () => void;
    onBack?: () => void;
}

const TimeSelect = ({ value, onChange, allowEmpty = false, emptyLabel = "End" }: { value: string, onChange: (v: string) => void, allowEmpty?: boolean, emptyLabel?: string }) => {
    const isEmpty = value === '';
    const parts = isEmpty ? ['00', '00', '00'] : value.split(':');
    const h = parts[0] || '00';
    const m = parts[1] || '00';
    const s = parts[2] || '00';

    const update = (newH: string, newM: string, newS: string) => onChange(`${newH}:${newM}:${newS}`);

    return (
        <div className="grid grid-cols-3 gap-2">
            {!isEmpty && (
                <>
                    <div className="relative">
                        <select required value={h} onChange={(e) => update(e.target.value, m, s)} className="w-full appearance-none bg-white dark:bg-[#112217] border border-slate-200 dark:border-[#346544] rounded-lg py-2 px-1 text-center font-mono text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#19e65e] custom-scrollbar">
                            {Array.from({ length: 24 }).map((_, i) => <option key={i} value={i.toString().padStart(2, '0')}>{i.toString().padStart(2, '0')}h</option>)}
                        </select>
                    </div>
                    <div className="relative">
                        <select required value={m} onChange={(e) => update(h, e.target.value, s)} className="w-full appearance-none bg-white dark:bg-[#112217] border border-slate-200 dark:border-[#346544] rounded-lg py-2 px-1 text-center font-mono text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#19e65e] custom-scrollbar">
                            {Array.from({ length: 60 }).map((_, i) => <option key={i} value={i.toString().padStart(2, '0')}>{i.toString().padStart(2, '0')}m</option>)}
                        </select>
                    </div>
                    <div className="relative">
                        <select required value={s} onChange={(e) => update(h, m, e.target.value)} className="w-full appearance-none bg-white dark:bg-[#112217] border border-slate-200 dark:border-[#346544] rounded-lg py-2 px-1 text-center font-mono text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#19e65e] custom-scrollbar">
                            {Array.from({ length: 60 }).map((_, i) => <option key={i} value={i.toString().padStart(2, '0')}>{i.toString().padStart(2, '0')}s</option>)}
                        </select>
                    </div>
                </>
            )}
            {allowEmpty && (
                <label className="col-span-3 flex items-center gap-2 cursor-pointer text-slate-400 text-sm mt-1">
                    <input type="checkbox" className="rounded border-gray-700 bg-[#1a2e22] text-[#19e65e] focus:ring-[#19e65e]" checked={isEmpty} onChange={(e) => onChange(e.target.checked ? '' : '00:00:00')} />
                    <span>{emptyLabel} (Play to end)</span>
                </label>
            )}
        </div>
    );
};

export const PracticeConfig: React.FC<PracticeConfigProps> = ({ onStartPractice, onBack }) => {
    const { items, addItem, removeItem, updateItem, moveItem, restVideoUrl, setRestVideoUrl } = usePracticeStore();

    const [editingId, setEditingId] = useState<string | 'NEW' | null>(null);
    const [editName, setEditName] = useState('');
    const [editUrl, setEditUrl] = useState('');
    const [editPracticeDuration, setEditPracticeDuration] = useState('00:01:00');
    const [editRestDuration, setEditRestDuration] = useState('00:00:15');
    const [editStartSecond, setEditStartSecond] = useState('00:00:00');
    const [editEndSecond, setEditEndSecond] = useState('');

    const timeToSeconds = (timeStr: string) => {
        if (!timeStr) return 0;
        const parts = timeStr.split(':').map(Number);
        if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
        if (parts.length === 2) return parts[0] * 60 + parts[1];
        return parts[0] || 0;
    };

    const secondsToTime = (secs: number) => {
        if (secs === undefined || isNaN(secs)) return '';
        const h = Math.floor(secs / 3600);
        const m = Math.floor((secs % 3600) / 60);
        const s = secs % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const totalSeconds = useMemo(() => {
        return items.reduce((acc, item) => acc + item.practiceSeconds + item.restSeconds, 0);
    }, [items]);

    const formatTotalTime = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleEditStart = (item: any) => {
        setEditingId(item.id);
        setEditName(item.stageName);
        setEditUrl(item.youtubeUrl || '');
        setEditPracticeDuration(secondsToTime(item.practiceSeconds));
        setEditRestDuration(secondsToTime(item.restSeconds));
        setEditStartSecond(item.startSecond !== undefined ? secondsToTime(item.startSecond) : '00:00:00');
        setEditEndSecond(item.endSecond !== undefined ? secondsToTime(item.endSecond) : '');
    };

    const handleAddNewClick = () => {
        setEditingId('NEW');
        setEditName('');
        setEditUrl('');
        setEditPracticeDuration('00:01:00');
        setEditRestDuration('00:00:15');
        setEditStartSecond('00:00:00');
        setEditEndSecond('');
    };

    const extractVideoId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const handleEditSave = (e?: React.MouseEvent) => {
        if (e) e.preventDefault();

        if (!editName || !editUrl) {
            alert('Please fill in both name and URL.');
            return;
        }

        const startSec = timeToSeconds(editStartSecond);
        const endSec = editEndSecond ? timeToSeconds(editEndSecond) : undefined;
        const pracSec = timeToSeconds(editPracticeDuration);
        const restSec = timeToSeconds(editRestDuration);

        if (endSec !== undefined && endSec <= startSec) {
            alert('Video end time must be greater than start time!');
            return;
        }
        if (pracSec <= 0) {
            alert('Practice duration must be greater than 0');
            return;
        }

        const payload = {
            stageName: editName,
            youtubeUrl: editUrl,
            practiceSeconds: pracSec,
            restSeconds: restSec,
            startSecond: editStartSecond ? startSec : undefined,
            endSecond: endSec,
        };

        if (editingId === 'NEW') {
            addItem(payload);
        } else if (editingId) {
            updateItem(editingId, payload);
        }

        setEditingId(null);
    };

    let accumulatedTime = 0;

    return (
        <div className="flex flex-col h-screen bg-[#f6f8f6] dark:bg-[#112116] text-slate-900 dark:text-slate-100 font-sans overflow-hidden">
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-[#244730] px-4 md:px-10 py-4 bg-white dark:bg-[#112116] sticky top-0 z-40">
                <div className="flex items-center gap-4">
                    <div className="size-8 flex items-center justify-center rounded-lg bg-[#19e65e]/20 text-[#19e65e]">
                        <span className="material-symbols-outlined">fitness_center</span>
                    </div>
                    <h2 className="text-lg font-bold leading-tight tracking-tight uppercase">My Training Plan</h2>
                </div>
                <div className="hidden md:flex flex-1 justify-end gap-8">
                    {/* Header Nav Omitted for brevity */}
                </div>
            </header>

            <div className="flex flex-1 relative h-[calc(100vh-73px)] overflow-hidden">
                <main className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
                    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 p-4 md:p-8">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-[#244730]">
                            <div className="flex flex-col gap-2">
                                <button type="button" onClick={onBack} className="flex w-max items-center gap-2 text-sm text-[#19e65e] font-medium uppercase tracking-tight hover:underline">
                                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                                    <span>Back to Project Overview</span>
                                </button>
                                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white uppercase">Training Configuration</h1>
                                <p className="text-slate-500 dark:text-[#93c8a5] tracking-tight">Configure your interval training stages sequentially</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-[#1a2e22] text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2 mr-2">
                                    <span className="material-symbols-outlined text-[18px]">timer</span>
                                    Total: {formatTotalTime(totalSeconds)} min
                                </div>
                                <button onClick={onStartPractice} disabled={items.length === 0} className="flex cursor-pointer items-center justify-center rounded-lg h-10 px-6 bg-[#19e65e] text-[#112217] text-sm font-bold shadow-lg shadow-[#19e65e]/20 hover:bg-[#19e65e]/90 transition-all gap-2 uppercase tracking-tight disabled:opacity-50 disabled:cursor-not-allowed">
                                    <span className="material-symbols-outlined text-[20px]">play_arrow</span>
                                    Start Training
                                </button>
                            </div>
                        </div>

                        {/* Global Rest Video Setting */}
                        <div className="mb-2 bg-white dark:bg-[#1a2e22] border border-slate-200 dark:border-[#244730] rounded-xl p-4 shadow-sm">
                            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300 uppercase tracking-tight">Global Rest Background Video</label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                        <span className="material-symbols-outlined text-[18px]">link</span>
                                    </div>
                                    <input
                                        type="url"
                                        className="w-full bg-slate-50 dark:bg-[#112217] border border-slate-200 dark:border-[#346544] rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#19e65e] focus:ring-1 focus:ring-[#19e65e]"
                                        value={restVideoUrl}
                                        onChange={e => setRestVideoUrl(e.target.value)}
                                        placeholder="https://www.youtube.com/watch?v=..."
                                    />
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-[#93c8a5] mt-2">Plays during rest periods. Auto-starts at a random time if it's a long video.</p>
                        </div>

                        <div className="relative pl-4 md:pl-0">
                            {/* Vertical Line */}
                            <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-slate-200 dark:bg-[#244730] md:left-[80px] z-0"></div>

                            {items.length === 0 && (
                                <div className="pl-12 md:pl-[120px] py-8 text-slate-500 dark:text-[#93c8a5]">
                                    Timeline is empty. Add stages below to build your training plan.
                                </div>
                            )}

                            {items.map((item, index) => {
                                const startAcc = accumulatedTime;
                                const endAcc = accumulatedTime + item.practiceSeconds;
                                accumulatedTime += (item.practiceSeconds + item.restSeconds);

                                const isEditing = editingId === item.id;

                                return (
                                    <React.Fragment key={item.id}>
                                        <div className="relative grid grid-cols-[auto_1fr] gap-4 md:gap-8 items-start group mb-2">
                                            <div className="relative flex flex-col items-center pt-2 z-10 w-[60px] md:w-[160px]">
                                                <div className={`absolute right-[-24px] md:right-[60px] top-4 size-12 rounded-full border-4 ${isEditing ? 'border-[#19e65e] bg-[#19e65e] text-[#112217] shadow-[0_0_15px_rgba(25,230,94,0.4)]' : 'border-white dark:border-[#112116] bg-slate-100 dark:bg-[#1a2e22] text-slate-400 dark:text-[#93c8a5]'} flex items-center justify-center cursor-pointer shadow-md z-20 transition-colors`}>
                                                    <span className="font-bold text-lg">{index + 1}</span>
                                                </div>
                                                <div className="hidden md:block absolute right-[120px] top-5 text-right w-32">
                                                    <span className="block text-sm font-bold text-slate-900 dark:text-white">{formatTotalTime(startAcc)}</span>
                                                    <span className="block text-xs text-slate-500 dark:text-[#93c8a5]">to {formatTotalTime(endAcc)}</span>
                                                </div>
                                            </div>

                                            <div className="pl-12 md:pl-0 w-full">
                                                <div className={`bg-white dark:bg-[#1a2e22] border ${isEditing ? 'border-[#19e65e] ring-1 ring-[#19e65e]/20' : 'border-slate-200 dark:border-[#244730]'} rounded-xl p-4 shadow-sm hover:shadow-md hover:border-[#19e65e]/50 transition-all group relative`}>
                                                    {isEditing && (
                                                        <div className="absolute right-0 top-0 p-3">
                                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#19e65e] text-[#112217] uppercase tracking-widest">Editing</span>
                                                        </div>
                                                    )}
                                                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                                                        <div className="w-full sm:w-40 aspect-video rounded-lg bg-slate-200 dark:bg-[#112217] shrink-0 relative overflow-hidden group/thumb cursor-pointer border border-[#244730]">
                                                            {item.youtubeUrl ? (
                                                                <img src={`https://img.youtube.com/vi/${extractVideoId(item.youtubeUrl)}/hqdefault.jpg`} className="w-full h-full object-cover opacity-80" alt="Thumbnail" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center">
                                                                    <span className="material-symbols-outlined text-4xl text-slate-600">movie</span>
                                                                </div>
                                                            )}
                                                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                                                                <span className="material-symbols-outlined text-white text-4xl drop-shadow-lg">play_circle</span>
                                                            </div>
                                                            <span className="absolute bottom-1 right-1 bg-black/70 px-1.5 py-0.5 rounded text-[10px] text-white font-mono">{secondsToTime(item.practiceSeconds)}</span>
                                                        </div>

                                                        <div className="flex flex-col flex-1 min-w-0 w-full">
                                                            <div className="flex justify-between items-start mr-16 sm:mr-0">
                                                                <div className="flex-1 truncate">
                                                                    <h3 className="font-bold text-slate-900 dark:text-white text-lg uppercase tracking-tight truncate">{item.stageName}</h3>
                                                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-1 truncate">{item.youtubeUrl}</p>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-1 mt-2 sm:mt-0 sm:absolute sm:right-4 sm:top-4">
                                                                <button onClick={() => moveItem(index, 'UP')} disabled={index === 0} className="size-8 rounded-full hover:bg-slate-100 dark:hover:bg-[#244730] text-slate-400 disabled:opacity-30 flex items-center justify-center" title="Move Up"><span className="material-symbols-outlined text-[18px]">arrow_upward</span></button>
                                                                <button onClick={() => moveItem(index, 'DOWN')} disabled={index === items.length - 1} className="size-8 rounded-full hover:bg-slate-100 dark:hover:bg-[#244730] text-slate-400 disabled:opacity-30 flex items-center justify-center" title="Move Down"><span className="material-symbols-outlined text-[18px]">arrow_downward</span></button>
                                                                <button onClick={() => handleEditStart(item)} className={`size-8 rounded-full hover:bg-slate-100 dark:hover:bg-[#244730] transition-colors flex items-center justify-center ${isEditing ? 'text-[#19e65e]' : 'text-slate-400 hover:text-blue-400'}`} title="Edit">
                                                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                                                </button>
                                                                <button onClick={() => removeItem(item.id)} className="size-8 rounded-full hover:bg-slate-100 dark:hover:bg-[#244730] text-slate-400 hover:text-red-400 transition-colors flex items-center justify-center" title="Delete">
                                                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                                                </button>
                                                            </div>

                                                            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-[#112217]/50 p-2 rounded-lg border border-slate-100 dark:border-[#244730]/50 w-fit">
                                                                <span className="flex items-center gap-1 text-[#19e65e] font-bold uppercase tracking-tight"><span className="material-symbols-outlined text-[14px]">timer</span> Rest: {item.restSeconds}s</span>
                                                                {(item.startSecond !== undefined || item.endSecond !== undefined) && (
                                                                    <>
                                                                        <div className="w-px h-3 bg-slate-300 dark:bg-[#244730]"></div>
                                                                        <span className="flex items-center gap-1 uppercase tracking-tight"><span className="material-symbols-outlined text-[14px]">smart_display</span> Clip: {secondsToTime(item.startSecond || 0)} - {item.endSecond ? secondsToTime(item.endSecond) : 'End'}</span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Insert Button divider */}
                                        <div className="relative grid grid-cols-[auto_1fr] gap-8 items-center py-1 group/add">
                                            <div className="relative z-10 flex justify-center w-[60px] md:w-[160px]">
                                                {/* Hidden logically because we add at the end for simple flow, but kept for UI identicalness */}
                                            </div>
                                            <div className="pl-12 md:pl-0 flex items-center h-6">
                                                <div className="h-[1px] w-full bg-[#19e65e]/20 hidden group-hover/add:block dashed border-b border-dashed border-[#19e65e]/30"></div>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                );
                            })}
                        </div>

                        <div className="flex justify-center mt-6 mb-20 pl-12 md:pl-0">
                            <button type="button" onClick={handleAddNewClick} className="flex items-center gap-2 px-6 py-3 rounded-full border border-dashed border-slate-300 dark:border-[#346544] text-slate-500 dark:text-[#93c8a5] hover:border-[#19e65e] hover:text-[#19e65e] hover:bg-slate-50 dark:hover:bg-[#1a2e22] transition-all w-full md:w-auto justify-center uppercase tracking-tight font-bold">
                                <span className="material-symbols-outlined">add_circle</span>
                                <span>Add New Stage</span>
                            </button>
                        </div>
                    </div>
                </main>

                {/* Right Sidebar Form */}
                {editingId && (
                    <aside className="relative w-full md:w-[400px] bg-white dark:bg-[#112217] border-l border-slate-200 dark:border-[#244730] shadow-xl flex flex-col shrink-0 absolute inset-y-0 right-0 z-50 md:static">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-[#244730] bg-white dark:bg-[#112217]">
                            <div className="flex flex-col">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                                    {editingId === 'NEW' ? 'New Stage' : 'Edit Stage'}
                                </h2>
                            </div>
                            <button onClick={() => setEditingId(null)} className="size-8 rounded-full hover:bg-slate-100 dark:hover:bg-[#244730] flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar flex flex-col gap-6">
                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-bold uppercase tracking-tight text-slate-700 dark:text-[#93c8a5]">Video Source URL</label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                            <span className="material-symbols-outlined text-[18px]">link</span>
                                        </div>
                                        <input
                                            className="w-full bg-slate-50 dark:bg-[#1a2e22] border border-slate-200 dark:border-[#346544] rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#19e65e] focus:ring-1 focus:ring-[#19e65e] placeholder-slate-500"
                                            placeholder="Paste YouTube URL"
                                            type="url"
                                            required
                                            value={editUrl}
                                            onChange={(e) => setEditUrl(e.target.value)}
                                        />
                                    </div>
                                </div>
                                {editUrl && extractVideoId(editUrl) && (
                                    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black group border border-slate-200 dark:border-[#244730]">
                                        <img className="w-full h-full object-cover opacity-60 transition-opacity" src={`https://img.youtube.com/vi/${extractVideoId(editUrl)}/hqdefault.jpg`} alt="Preview" />
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-bold uppercase tracking-tight text-slate-700 dark:text-[#93c8a5]">Stage Name</label>
                                <input
                                    className="w-full bg-slate-50 dark:bg-[#1a2e22] border border-slate-200 dark:border-[#346544] rounded-lg py-2.5 px-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#19e65e] focus:ring-1 focus:ring-[#19e65e] font-bold placeholder-slate-500"
                                    type="text"
                                    placeholder="e.g. Warm Up"
                                    required
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                />
                            </div>

                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1a2e22] border border-slate-200 dark:border-[#244730] flex flex-col gap-4">
                                <div className="flex items-center gap-2 mb-1 text-[#19e65e]">
                                    <span className="material-symbols-outlined">timer</span>
                                    <h3 className="font-bold text-sm uppercase tracking-widest">Practice Duration</h3>
                                </div>
                                <TimeSelect value={editPracticeDuration} onChange={setEditPracticeDuration} />
                            </div>

                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1a2e22] border border-slate-200 dark:border-[#244730] flex flex-col gap-4">
                                <div className="flex items-center gap-2 mb-1 text-slate-500 dark:text-[#93c8a5]">
                                    <span className="material-symbols-outlined">movie</span>
                                    <h3 className="font-bold text-sm uppercase tracking-widest">Video Segment</h3>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">Start Time</span>
                                        <TimeSelect value={editStartSecond} onChange={setEditStartSecond} />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">End Time</span>
                                        <TimeSelect value={editEndSecond} onChange={setEditEndSecond} allowEmpty={true} />
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1a2e22] border border-slate-200 dark:border-[#244730] flex flex-col gap-4">
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2 text-slate-500 dark:text-[#93c8a5]">
                                        <span className="material-symbols-outlined">timer_off</span>
                                        <h3 className="font-bold text-sm uppercase tracking-widest">Rest Time</h3>
                                    </div>
                                </div>
                                <TimeSelect value={editRestDuration} onChange={setEditRestDuration} />
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-200 dark:border-[#244730] bg-white dark:bg-[#112217] flex gap-3">
                            <button type="button" onClick={() => setEditingId(null)} className="flex-1 py-3 px-4 rounded-lg border border-slate-300 dark:border-[#346544] text-slate-700 dark:text-slate-300 font-bold text-sm uppercase tracking-tight hover:bg-slate-50 dark:hover:bg-[#1a2e22] transition-colors">
                                Cancel
                            </button>
                            <button type="button" onClick={handleEditSave} className="flex-1 py-3 px-4 rounded-lg bg-[#19e65e] text-[#112217] font-bold text-sm uppercase tracking-tight hover:bg-[#19e65e]/90 transition-colors shadow-lg shadow-[#19e65e]/20">
                                Save Stage
                            </button>
                        </div>
                    </aside>
                )}
            </div>
        </div>
    );
};
