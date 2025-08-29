import { mockIssues } from '@/lib/data';
import { IssueCard } from '@/components/city-voice/issue-card';

export default function DashboardPage() {
  const sortedIssues = [...mockIssues].sort((a, b) => b.priority - a.priority);

  return (
    <div className="container mx-auto max-w-2xl p-4 sm:p-6">
      <div className="space-y-4">
        {sortedIssues.map((issue) => (
          <IssueCard key={issue.id} issue={issue} />
        ))}
      </div>
    </div>
  );
}
