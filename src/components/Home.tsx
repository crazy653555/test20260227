import React from 'react';

interface HomeProps {
    onCreateProject: () => void;
    onViewProjects?: () => void;
}

export const Home: React.FC<HomeProps> = ({ onCreateProject, onViewProjects }) => {
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen flex flex-col overflow-x-hidden">
            <div className="flex flex-col grow w-full">
                <header className="w-full border-b border-gray-200 dark:border-gray-800 bg-surface-light dark:bg-surface-dark px-6 py-4 sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 text-primary flex items-center justify-center bg-[#13ec5b]/10 rounded-lg">
                                <span className="material-symbols-outlined text-[#13ec5b]">fitness_center</span>
                            </div>
                            <h1 className="text-xl font-bold tracking-tight">MY TRAINING PLAN</h1>
                        </div>
                        <div className="hidden md:flex items-center gap-8">
                            <a className="text-sm font-medium hover:text-[#13ec5b] transition-colors" href="#">Dashboard</a>
                            <a className="text-sm font-medium text-[#13ec5b]" href="#">My Projects</a>
                            <a className="text-sm font-medium hover:text-[#13ec5b] transition-colors" href="#">Library</a>
                            <a className="text-sm font-medium hover:text-[#13ec5b] transition-colors" href="#">Community</a>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={onCreateProject}
                                className="bg-[#13ec5b] hover:bg-[#13ec5b]/90 text-slate-900 px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-lg">add</span>
                                <span>New Project</span>
                            </button>
                            <div
                                className="w-10 h-10 rounded-full bg-cover bg-center border-2 border-[#13ec5b] cursor-pointer"
                                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDmyITLY2fi1g6B8hu2wtmdTAJMfJJ3EhRj1ZPGU9ZoYlx3mGefm2dwhz1UofssG_N8qMMwp-I7gCPjAR7ii-7BpkXvQ0O4GTVcSR0miIhLOqeOkZ6n4eKYOJ6KLxkirnEJ6L1tvC3YGdHJD1zC4op_fKNnogAV1VgeCsHmrb_saiF5p6yKgJRBa9HUSTPK9kapgwdNokHGfU25pJ8MrdRSNMIWa0V540wrmGMVjfmXscO8A0QB75hmlsWTTn-6dmFb6r6jsA2lPlYQ')" }}
                            />
                        </div>
                    </div>
                </header>

                <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-10">
                    <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h2 className="text-4xl font-black tracking-tight mb-2">Welcome back, Athlete</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-lg">Manage your training cycles and progress.</p>
                        </div>
                    </div>

                    <div className="w-full flex flex-col gap-10">
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[#13ec5b]">folder_open</span>
                                    My Projects
                                </h3>
                                <div className="flex items-center gap-4">
                                    <div className="relative hidden sm:block">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                                        <input
                                            className="pl-9 pr-4 py-1.5 text-sm bg-surface-light dark:bg-[#1a2e22] border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-1 focus:ring-[#13ec5b] focus:border-[#13ec5b] text-white"
                                            placeholder="Search projects..."
                                            type="text"
                                        />
                                    </div>
                                    <a className="text-sm font-medium text-[#13ec5b] hover:text-[#13ec5b]/80" href="#">View All</a>
                                </div>
                            </div>

                            {/* Project Cards (Mock Data based on Stitch UI) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Card 1 */}
                                <div
                                    onClick={onViewProjects}
                                    className="group bg-surface-light dark:bg-[#1a2e22] rounded-xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
                                >
                                    <div className="flex items-start gap-4">
                                        <div
                                            className="w-20 h-20 rounded-lg bg-cover bg-center shrink-0"
                                            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB1T_I4ZyuFfoNs1MrIPn7BzuXOvBi9hOtSuai2NxuUC7Q6XBcuoqUxT5Wh-aSF7sCjJhepIfjN8mMNHKnlIfnaONkihsTNh4fKnOc75XzafftABE9jnYaQXWUFOkNAvZ8s6voYGAxU3j0OJnu9ACtULDCgYbq4k5neYo6bwv4-eJ7uSicMbXl2dqAtfrGfdynS9mzNQ6H_v5Wkzje9eK3Ap1_0CBejiU8BliOMmXRGlMbvM4ezu8iXLCrfwYtnWMCI59kdVZL82qCt')" }}
                                        />
                                        <div className="flex-1 min-w-0 pr-8">
                                            <h4 className="text-lg font-bold truncate group-hover:text-[#13ec5b] transition-colors">Daily Training Plan</h4>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 truncate">Your personal daily routines.</p>
                                            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-2">
                                                <div className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">schedule</span> Variable
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">layers</span> Custom
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            className="absolute top-4 right-4 text-slate-400 hover:text-[#13ec5b] transition-colors bg-background-light dark:bg-[#112116] p-1.5 rounded-lg border border-transparent hover:border-[#13ec5b]/20"
                                            title="Configure Project"
                                        >
                                            <span className="material-symbols-outlined text-xl">settings</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
};
