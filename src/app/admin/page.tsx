import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle, Clock, AlertCircle, FileCog } from "lucide-react";
import { AdminIssueTable } from "@/components/city-voice/admin-issue-table";
import { mockIssues } from "@/lib/data";

export default function AdminDashboardPage() {
  const totalIssues = mockIssues.length;
  const resolvedIssues = mockIssues.filter(i => i.status === 'Resolved').length;
  const pendingIssues = mockIssues.filter(i => i.status !== 'Resolved').length;
  const unassignedIssues = mockIssues.filter(i => !i.department).length;

  return (
    <div className="flex flex-col gap-4 md:gap-8 py-4">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
            <FileCog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalIssues}</div>
            <p className="text-xs text-muted-foreground">All time reports</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Issues</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolvedIssues}</div>
            <p className="text-xs text-muted-foreground">
              {totalIssues > 0 ? ((resolvedIssues / totalIssues) * 100).toFixed(1) : 0}% resolution rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Issues</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingIssues}</div>
            <p className="text-xs text-muted-foreground">Currently being addressed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unassigned</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unassignedIssues}</div>
            <p className="text-xs text-muted-foreground">Awaiting department assignment</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
            <CardTitle className="font-headline">Issue Management</CardTitle>
            <CardDescription>Filter, sort, and manage all reported civic issues.</CardDescription>
        </Header>
        <CardContent>
            <AdminIssueTable />
        </CardContent>
      </Card>
    </div>
  );
}
