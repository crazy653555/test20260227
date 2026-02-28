import React, { useState } from 'react';
import { usePracticeStore } from '../hooks/usePracticeStore';
import { Trash2, ArrowUp, ArrowDown, Plus, Settings } from 'lucide-react';

const TimeSelect = ({ value, onChange, allowEmpty = false, emptyLabel = "End" }: { value: string, onChange: (v: string) => void, allowEmpty?: boolean, emptyLabel?: string }) => {
    const isEmpty = value === '';
    const parts = isEmpty ? ['00', '00', '00'] : value.split(':');
    const h = parts[0] || '00';
    const m = parts[1] || '00';
    const s = parts[2] || '00';

    const update = (newH: string, newM: string, newS: string) => onChange(`${newH}:${newM}:${newS}`);

    return (
        <div className="flex gap-2 items-center flex-wrap">
            {allowEmpty && (
                <label className="flex items-center gap-2 cursor-pointer text-slate-400 text-sm">
                    <input type="checkbox" className="rounded border-gray-700 bg-[#1a2e22] text-[#13ec5b] focus:ring-[#13ec5b]" checked={isEmpty} onChange={(e) => onChange(e.target.checked ? '' : '00:00:00')} />
                    <span>{emptyLabel}</span>
                </label>
            )}
            {!isEmpty && (
                <>
                    <select required value={h} onChange={(e) => update(e.target.value, m, s)} className="bg-[#1a2e22] text-white border border-gray-700 rounded px-2 py-1 text-sm focus:border-[#13ec5b] focus:ring-1 focus:ring-[#13ec5b] custom-scrollbar">
                        {Array.from({ length: 24 }).map((_, i) => <option key={i} value={i.toString().padStart(2, '0')}>{i.toString().padStart(2, '0')}h</option>)}
                    </select>
                    <select required value={m} onChange={(e) => update(h, e.target.value, s)} className="bg-[#1a2e22] text-white border border-gray-700 rounded px-2 py-1 text-sm focus:border-[#13ec5b] focus:ring-1 focus:ring-[#13ec5b] custom-scrollbar">
                        {Array.from({ length: 60 }).map((_, i) => <option key={i} value={i.toString().padStart(2, '0')}>{i.toString().padStart(2, '0')}m</option>)}
                    </select>
                    <select required value={s} onChange={(e) => update(h, m, e.target.value)} className="bg-[#1a2e22] text-white border border-gray-700 rounded px-2 py-1 text-sm focus:border-[#13ec5b] focus:ring-1 focus:ring-[#13ec5b] custom-scrollbar">
                        {Array.from({ length: 60 }).map((_, i) => <option key={i} value={i.toString().padStart(2, '0')}>{i.toString().padStart(2, '0')}s</option>)}
                    </select>
                </>
            )}
        </div>
    );
};

export const PracticeConfig: React.FC = () => {
    const { items, addItem, removeItem, updateItem, moveItem, restVideoUrl, setRestVideoUrl } = usePracticeStore();

    const [newName, setNewName] = useState('');
    const [newUrl, setNewUrl] = useState('');
    const [newPracticeDuration, setNewPracticeDuration] = useState<string>('00:01:00');
    const [newRestDuration, setNewRestDuration] = useState<string>('00:00:15');
    const [newStartSecond, setNewStartSecond] = useState<string>('00:00:00');
    const [newEndSecond, setNewEndSecond] = useState<string>('');

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [editUrl, setEditUrl] = useState('');
    const [editPracticeDuration, setEditPracticeDuration] = useState('');
    const [editRestDuration, setEditRestDuration] = useState('');
    const [editStartSecond, setEditStartSecond] = useState('');
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

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName || !newUrl) return;

        const startSec = timeToSeconds(newStartSecond);
        const endSec = newEndSecond ? timeToSeconds(newEndSecond) : undefined;
        const pracSec = timeToSeconds(newPracticeDuration);
        const restSec = timeToSeconds(newRestDuration);

        if (endSec !== undefined && endSec <= startSec) {
            alert('影片結束時間必須大於開始時間！');
            return;
        }
        if (pracSec <= 0) {
            alert('練習時間必須大於 0');
            return;
        }

        addItem({
            name: newName,
            youtubeUrl: newUrl,
            practiceDuration: pracSec,
            restDuration: restSec,
            startSecond: newStartSecond ? startSec : undefined,
            endSecond: endSec,
        });

        setNewName('');
        setNewUrl('');
        setNewStartSecond('00:00:00');
        setNewEndSecond('');
    };

    const handleEditStart = (item: any) => {
        setEditingId(item.id);
        setEditName(item.name);
        setEditUrl(item.youtubeUrl || '');
        setEditPracticeDuration(secondsToTime(item.practiceDuration));
        setEditRestDuration(secondsToTime(item.restDuration));
        setEditStartSecond(item.startSecond !== undefined ? secondsToTime(item.startSecond) : '00:00:00');
        setEditEndSecond(item.endSecond !== undefined ? secondsToTime(item.endSecond) : '');
    };

    const handleEditSave = (id: string) => {
        const startSec = timeToSeconds(editStartSecond);
        const endSec = editEndSecond ? timeToSeconds(editEndSecond) : undefined;
        const pracSec = timeToSeconds(editPracticeDuration);
        const restSec = timeToSeconds(editRestDuration);

        updateItem(id, {
            name: editName,
            youtubeUrl: editUrl,
            practiceDuration: pracSec,
            restDuration: restSec,
            startSecond: editStartSecond ? startSec : undefined,
            endSecond: endSec,
        });

        setEditingId(null);
    };

    return (
        <div className="w-full">
            <div className="mb-6 bg-[#112116] border border-[#244730] rounded-xl p-4 lg:p-6 shadow-sm">
                <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2 text-slate-300">Global Rest Background Video</label>
                    <input
                        type="url"
                        className="w-full bg-[#1a2e22] border border-[#244730] text-white rounded-lg px-4 py-2 text-sm focus:border-[#13ec5b] focus:ring-1 focus:ring-[#13ec5b] transition-all"
                        value={restVideoUrl}
                        onChange={e => setRestVideoUrl(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                    />
                    <p className="text-xs text-slate-500 mt-2">Plays during rest periods. Auto-starts at a random time if it's a long video.</p>
                </div>
            </div>

            <form onSubmit={handleAdd} className="mb-10 bg-[#112116] border border-[#244730] rounded-xl p-4 lg:p-6 shadow-sm">
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Plus className="text-[#13ec5b]" size={20} /> Add New Stage
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-slate-300">Stage Name</label>
                        <input type="text" className="w-full bg-[#1a2e22] border border-[#244730] text-white rounded-lg px-4 py-2 text-sm focus:border-[#13ec5b] focus:ring-1 focus:ring-[#13ec5b] transition-all" value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g., Warm Up / Push Ups" required />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-slate-300">YouTube URL</label>
                        <input type="url" className="w-full bg-[#1a2e22] border border-[#244730] text-white rounded-lg px-4 py-2 text-sm focus:border-[#13ec5b] focus:ring-1 focus:ring-[#13ec5b] transition-all" value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." required />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 relative z-50">
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-slate-300">Practice Time</label>
                        <TimeSelect value={newPracticeDuration} onChange={setNewPracticeDuration} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-slate-300">Rest Time</label>
                        <TimeSelect value={newRestDuration} onChange={setNewRestDuration} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-slate-300">Video Start</label>
                        <TimeSelect value={newStartSecond} onChange={setNewStartSecond} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-slate-300">Video End</label>
                        <TimeSelect value={newEndSecond} onChange={setNewEndSecond} allowEmpty={true} />
                    </div>
                </div>

                <button type="submit" className="w-full md:w-auto bg-[#1a2e22] hover:bg-[#244730] text-[#13ec5b] border border-[#13ec5b] px-6 py-2 rounded-lg text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2">
                    <Plus size={16} /> Add Stage to Timeline
                </button>
            </form>

            <div className="relative border-l-2 border-dashed border-[#244730] ml-4 md:ml-8 pb-10">
                {items.length === 0 ? (
                    <div className="pl-8 pt-4">
                        <p className="text-slate-500">Timeline is empty. Add stages above to build your training plan.</p>
                    </div>
                ) : (
                    items.map((item, index) => (
                        <div key={item.id} className="relative mb-8 pl-8 md:pl-12 group">
                            {/* Timeline Node */}
                            <div className="absolute -left-[17px] top-6 w-[32px] h-[32px] rounded-full bg-[#112116] border-4 border-[#13ec5b] flex items-center justify-center shadow-[0_0_10px_rgba(19,236,91,0.3)] z-10">
                                <span className="text-xs font-bold text-white">{index + 1}</span>
                            </div>

                            <div className="bg-[#112116] border border-[#244730] rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md hover:border-[#13ec5b]/50 transition-all group-hover:bg-[#15291b]">
                                {editingId === item.id ? (
                                    <div className="flex flex-col gap-4">
                                        <input type="text" className="w-full bg-[#1a2e22] border border-[#244730] text-white rounded-lg px-4 py-2 font-bold focus:border-[#13ec5b] focus:ring-1 focus:ring-[#13ec5b]" value={editName} onChange={e => setEditName(e.target.value)} placeholder="Stage Name" />
                                        <input type="url" className="w-full bg-[#1a2e22] border border-[#244730] text-white rounded-lg px-4 py-2 text-sm focus:border-[#13ec5b] focus:ring-1 focus:ring-[#13ec5b] transition-all" value={editUrl} onChange={e => setEditUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." required />

                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-[#0b0f10] p-4 rounded-lg">
                                            <div>
                                                <p className="text-xs text-slate-400 mb-1">Practice</p>
                                                <TimeSelect value={editPracticeDuration} onChange={setEditPracticeDuration} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-400 mb-1">Rest</p>
                                                <TimeSelect value={editRestDuration} onChange={setEditRestDuration} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-400 mb-1">Start</p>
                                                <TimeSelect value={editStartSecond} onChange={setEditStartSecond} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-400 mb-1">End</p>
                                                <TimeSelect value={editEndSecond} onChange={setEditEndSecond} allowEmpty={true} />
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-2 mt-2">
                                            <button onClick={() => setEditingId(null)} className="px-4 py-1.5 rounded text-sm text-slate-400 hover:text-white bg-[#1a2e22] hover:bg-[#244730] transition-colors">Cancel</button>
                                            <button onClick={() => handleEditSave(item.id)} className="px-4 py-1.5 rounded text-sm font-bold text-[#112217] bg-[#13ec5b] hover:bg-[#13ec5b]/90 transition-colors">Save</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-white text-lg uppercase tracking-tight truncate pr-8">{item.name}</h3>
                                            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-400">
                                                <span className="flex items-center gap-1 uppercase tracking-tight font-medium text-[#13ec5b]">
                                                    Time: {secondsToTime(item.practiceDuration)}
                                                </span>
                                                <span className="flex items-center gap-1 uppercase tracking-tight">
                                                    Rest: {secondsToTime(item.restDuration)}
                                                </span>
                                                {(item.startSecond !== undefined || item.endSecond !== undefined) && (
                                                    <span className="flex items-center gap-1 uppercase tracking-tight bg-[#1a2e22] px-2 py-0.5 rounded text-slate-300">
                                                        Clip: {secondsToTime(item.startSecond ?? 0)} - {item.endSecond ? secondsToTime(item.endSecond) : 'End'}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button onClick={() => moveItem(index, 'UP')} disabled={index === 0} className="p-2 rounded text-slate-400 hover:text-white hover:bg-[#244730] disabled:opacity-30 disabled:hover:bg-transparent transition-colors" title="Move Up">
                                                <ArrowUp size={18} />
                                            </button>
                                            <button onClick={() => moveItem(index, 'DOWN')} disabled={index === items.length - 1} className="p-2 rounded text-slate-400 hover:text-white hover:bg-[#244730] disabled:opacity-30 disabled:hover:bg-transparent transition-colors" title="Move Down">
                                                <ArrowDown size={18} />
                                            </button>
                                            <button onClick={() => handleEditStart(item)} className="p-2 rounded text-slate-400 hover:text-[#13ec5b] hover:bg-[#1a2e22] transition-colors" title="Edit">
                                                <Settings size={18} />
                                            </button>
                                            <button onClick={() => removeItem(item.id)} className="p-2 rounded text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors" title="Delete">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
