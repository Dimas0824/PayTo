/**
 * Sidebar navigation item with active styling.
 */

import React from 'react';

type SidebarItemProps = {
    icon: React.ElementType;
    label: string;
    id: string;
    isActive: boolean;
    onClick: () => void;
};

export default function SidebarItem({ icon: Icon, label, id, isActive, onClick }: SidebarItemProps) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                ? 'bg-white shadow-md text-indigo-600'
                : 'text-slate-500 hover:bg-white/50 hover:text-slate-700'
                }`}
            data-tab-id={id}
        >
            <Icon size={20} className={isActive ? 'stroke-[2.5px]' : ''} />
            <span className="font-medium text-sm">{label}</span>
            {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600"></div>}
        </button>
    );
}
