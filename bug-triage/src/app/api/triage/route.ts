import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { IssuePriority } from '@/types';

const priorityWeight: Record<IssuePriority, number> = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
};

export async function POST(request: Request) {
    try {
        const issues = store.getIssues();
        const openIssues = issues.filter(issue => issue.status === 'open');

        if (openIssues.length === 0) {
            return NextResponse.json({ message: 'No open issues available for triage' }, { status: 404 });
        }

        // Sort: highest priority first, then oldest createdAt first
        openIssues.sort((a, b) => {
            const weightDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
            if (weightDiff !== 0) return weightDiff;

            const timeA = new Date(a.createdAt).getTime();
            const timeB = new Date(b.createdAt).getTime();
            return timeA - timeB;
        });

        const nextIssue = openIssues[0];

        // Assign and mark in_progress. Hardcoding assignee for prototype.
        const updatedIssue = store.updateIssue(nextIssue.id, {
            status: 'in_progress',
            assignee: 'Current Engineer (Auto-assigned)',
        });

        return NextResponse.json(updatedIssue, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
