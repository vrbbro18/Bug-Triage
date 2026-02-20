import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { IssueStatus } from '@/types';

// Valid status transitions
const validTransitions: Record<IssueStatus, IssueStatus[]> = {
    open: ['in_progress', 'blocked'],
    in_progress: ['done', 'blocked'],
    blocked: ['in_progress'],
    done: [], // Terminal state (in this prototype, maybe re-opened in real life)
};

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const id = resolvedParams.id;
        const body = await request.json();
        const { status } = body;

        if (!status) {
            return NextResponse.json({ error: 'Status is required' }, { status: 400 });
        }

        const issue = store.findIssue(id);

        if (!issue) {
            return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
        }

        const allowedNextStates = validTransitions[issue.status] || [];
        if (!allowedNextStates.includes(status as IssueStatus)) {
            return NextResponse.json(
                { error: `Invalid transition from ${issue.status} to ${status}` },
                { status: 400 }
            );
        }

        const updatedIssue = store.updateIssue(id, { status: status as IssueStatus });

        return NextResponse.json(updatedIssue);
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}
