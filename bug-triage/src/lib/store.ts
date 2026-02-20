import { Issue, IssueStatus, IssuePriority, IssueArea } from '@/types';

// In-memory store
let issues: Issue[] = [
    {
        id: '1',
        title: 'Fix hydration error on dashboard',
        priority: 'high',
        area: 'frontend',
        status: 'open',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    },
    {
        id: '2',
        title: 'Setup database replication',
        priority: 'critical',
        area: 'infrastructure',
        status: 'in_progress',
        assignee: 'Alice',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    },
    {
        id: '3',
        title: 'Update primary button color',
        priority: 'low',
        area: 'design',
        status: 'open',
        createdAt: new Date().toISOString(),
    },
    {
        id: '4',
        title: 'Implement user password reset API',
        priority: 'medium',
        area: 'backend',
        status: 'blocked',
        assignee: 'Bob',
        createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    },
];

export const store = {
    getIssues: () => [...issues],
    findIssue: (id: string) => issues.find((issue) => issue.id === id),
    addIssue: (issueData: Omit<Issue, 'id' | 'createdAt'>) => {
        const newIssue: Issue = {
            ...issueData,
            id: Math.random().toString(36).substring(2, 9),
            createdAt: new Date().toISOString(),
        };
        issues.unshift(newIssue);
        return newIssue;
    },
    updateIssue: (id: string, updates: Partial<Issue>) => {
        const index = issues.findIndex((issue) => issue.id === id);
        if (index === -1) return null;
        issues[index] = { ...issues[index], ...updates };
        return issues[index];
    },
    deleteIssue: (id: string) => {
        const index = issues.findIndex((issue) => issue.id === id);
        if (index === -1) return false;
        issues.splice(index, 1);
        return true;
    },
};
