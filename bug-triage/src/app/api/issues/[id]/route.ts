import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const success = store.deleteIssue(id);

    if (!success) {
        return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
}
