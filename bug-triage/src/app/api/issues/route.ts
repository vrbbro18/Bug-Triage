import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { IssueArea, IssueStatus } from '@/types';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as IssueStatus | null;
    const area = searchParams.get('area') as IssueArea | null;

    let issues = store.getIssues();

    if (status) {
        issues = issues.filter(issue => issue.status === status);
    }
    if (area) {
        issues = issues.filter(issue => issue.area === area);
    }

    return NextResponse.json(issues);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, priority, area } = body;

        if (!title || !priority || !area) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newIssue = store.addIssue({
            title,
            priority,
            area,
            status: 'open',
        });

        return NextResponse.json(newIssue, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}
