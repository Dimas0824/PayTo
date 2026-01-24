/**
 * Approvals log tab for supervisor actions.
 */

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import type { ApprovalLog } from '../../types';

type ApprovalsTabProps = {
    logs: ApprovalLog[];
};

export default function ApprovalsTab({ logs }: ApprovalsTabProps) {
    return (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 gap-4">
                {logs.map(log => (
                    <div key={log.id} className="bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl p-4 flex items-start gap-4 shadow-sm">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${log.action === 'VOID_TRANSACTION' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                            }`}>
                            <AlertTriangle size={20} />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between">
                                <h4 className="font-bold text-slate-800">{log.action.replace('_', ' ')}</h4>
                                <span className="text-xs font-mono text-slate-400">{log.time}</span>
                            </div>
                            <p className="text-sm text-slate-600 mt-1">
                                Kasir: <span className="font-medium text-slate-800">{log.cashier}</span> •
                                Alasan: <span className="italic">"{log.reason}"</span>
                            </p>
                        </div>
                        <div>
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200">
                                {log.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
