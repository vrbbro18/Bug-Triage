export type IssueStatus = 'open' | 'in_progress' | 'done' | 'blocked';
export type IssuePriority = 'low' | 'medium' | 'high' | 'critical';
export type IssueArea = 'frontend' | 'backend' | 'infrastructure' | 'design';

export interface Issue {
    id: string;
    title: string;
    priority: IssuePriority;
    area: IssueArea;
    status: IssueStatus;
    assignee?: string;
    createdAt: string; // ISO string
}
