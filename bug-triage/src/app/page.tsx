import { store } from '@/lib/store';
import IssueTable from '@/components/IssueTable';
import IssueFilters from '@/components/IssueFilters';
import CreateIssueModal from '@/components/CreateIssueModal';
import TriageButton from '@/components/TriageButton';
import { IssueStatus, IssueArea } from '@/types';

export const dynamic = 'force-dynamic'; // Prevent caching for prototype

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; area?: string }>;
}) {
  const resolvedSearchParams = await searchParams;

  // Read directly from our "DB" (in-memory store)
  let issues = store.getIssues();

  // Apply server-side filtering
  if (resolvedSearchParams.status) {
    issues = issues.filter(issue => issue.status === resolvedSearchParams.status as IssueStatus);
  }
  if (resolvedSearchParams.area) {
    issues = issues.filter(issue => issue.area === resolvedSearchParams.area as IssueArea);
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8 text-gray-900">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Issue Triage</h1>
            <p className="text-sm text-gray-500 mt-1">Manage, filter, and assign tickets.</p>
          </div>
          <div className="flex items-center gap-3">
            <TriageButton />
            <CreateIssueModal />
          </div>
        </header>

        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="mb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <h2 className="text-lg font-semibold">Active Issues</h2>
            <IssueFilters />
          </div>

          <IssueTable issues={issues} />
        </section>
      </div>
    </main>
  );
}
