'use client';

import { Issue, IssueStatus } from '@/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Props {
    issues: Issue[];
}

const statusColors: Record<IssueStatus, string> = {
    open: 'bg-green-100 text-green-800',
    in_progress: 'bg-blue-100 text-blue-800',
    blocked: 'bg-red-100 text-red-800',
    done: 'bg-gray-100 text-gray-800',
};

const validTransitions: Record<IssueStatus, IssueStatus[]> = {
    open: ['in_progress', 'blocked'],
    in_progress: ['done', 'blocked'],
    blocked: ['in_progress'],
    done: [],
};

const formatStatus = (s: string) => s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());

export default function IssueTable({ issues }: Props) {
    const router = useRouter();
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const updateStatus = async (id: string, currentStatus: IssueStatus, newStatus: IssueStatus) => {
        setLoadingId(id);
        try {
            const res = await fetch(`/api/issues/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                router.refresh();
            } else {
                const data = await res.json();
                alert(`Error: ${data.error}`);
            }
        } catch (err) {
            alert('Failed to update status');
        } finally {
            setLoadingId(null);
        }
    };

    const deleteIssue = async (id: string) => {
        if (!confirm('Are you sure you want to delete this issue?')) return;
        setLoadingId(id);
        try {
            const res = await fetch(`/api/issues/${id}`, { method: 'DELETE' });
            if (res.ok) {
                router.refresh();
            }
        } catch {
            alert('Failed to delete issue');
        } finally {
            setLoadingId(null);
        }
    };

    if (issues.length === 0) {
        return (
            <div className="p-8 text-center bg-white border rounded-lg shadow-sm text-gray-500">
                No issues found.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto bg-white border rounded-lg shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignee</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {issues.map(issue => (
                        <tr key={issue.id} className={loadingId === issue.id ? 'opacity-50' : ''}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{issue.title}</div>
                                <div className="text-xs text-gray-400">#{issue.id}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[issue.status]}`}>
                                    {formatStatus(issue.status)}
                                </span>

                                {/* Quick actions for status */}
                                {validTransitions[issue.status].length > 0 && (
                                    <div className="mt-2 flex gap-1">
                                        {validTransitions[issue.status].map(nextState => (
                                            <button
                                                key={nextState}
                                                onClick={() => updateStatus(issue.id, issue.status, nextState)}
                                                disabled={loadingId === issue.id}
                                                className="text-[10px] bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded"
                                            >
                                                → {formatStatus(nextState)}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{issue.priority}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{issue.area}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{issue.assignee || 'Unassigned'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(issue.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    onClick={() => deleteIssue(issue.id)}
                                    disabled={loadingId === issue.id}
                                    className="text-red-600 hover:text-red-900 ml-4"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
