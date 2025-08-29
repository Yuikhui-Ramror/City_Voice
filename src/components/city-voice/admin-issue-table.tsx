'use client';
import { useState } from 'react';
import {
  ChevronDown,
  MoreHorizontal,
  ArrowUpDown,
  FileCog,
  Bot,
  Check,
  X,
  ShieldQuestion,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockIssues, issueCategories, departments, Issue, IssueStatus, mockUsers } from '@/lib/data';
import { routeReport, RouteReportOutput } from '@/ai/flows/route-reports-to-correct-department';
import { reprioritizeIssueOnVerification } from '@/ai/flows/reprioritize-issue-on-verification';
import { useToast } from '@/hooks/use-toast';

const statusColors: { [key in IssueStatus]: string } = {
  Submitted: 'bg-gray-500 hover:bg-gray-500',
  Acknowledged: 'bg-blue-500 hover:bg-blue-500',
  'In Progress': 'bg-yellow-500 hover:bg-yellow-500',
  Resolved: 'bg-green-500 hover:bg-green-500',
};

const TOKENS_PER_VERIFIED_ISSUE = 1;

export function AdminIssueTable() {
  const [issues, setIssues] = useState<Issue[]>(mockIssues);
  const [users, setUsers] = useState(mockUsers);
  const [filters, setFilters] = useState({ category: 'all', location: '' });
  const [sort, setSort] = useState({ key: 'priority', order: 'desc' });
  const [aiSuggestion, setAiSuggestion] = useState<RouteReportOutput | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const { toast } = useToast();

  const handleStatusChange = (id: string, newStatus: IssueStatus) => {
    setIssues(issues.map(issue => issue.id === id ? { ...issue, status: newStatus } : issue));
  };
  
  const handleDeptChange = (id: string, newDept: string) => {
    setIssues(issues.map(issue => issue.id === id ? { ...issue, department: newDept } : issue));
  };
  
  const handleVerification = async (issueId: string, isVerified: boolean) => {
    const issueToUpdate = issues.find(i => i.id === issueId);
    if (!issueToUpdate) return;

    // Avoid re-awarding tokens
    const alreadyVerified = issueToUpdate.verified === true;
    if (isVerified && !alreadyVerified) {
        setUsers(prevUsers => ({
            ...prevUsers,
            [issueToUpdate.userId]: {
                ...prevUsers[issueToUpdate.userId],
                tokens: (prevUsers[issueToUpdate.userId].tokens || 0) + TOKENS_PER_VERIFIED_ISSUE
            }
        }));
         toast({
            title: "Token Awarded!",
            description: `${users[issueToUpdate.userId].name} received ${TOKENS_PER_VERIFIED_ISSUE} token for valid report.`,
        });
    }

    setIssues(issues.map(i => i.id === issueId ? { ...i, verified: isVerified } : i));

    try {
        const { newPriorityScore, reasoning } = await reprioritizeIssueOnVerification({
            issueDescription: issueToUpdate.text,
            currentPriority: issueToUpdate.priority,
            isVerified: isVerified,
            engagement: issueToUpdate.engagement,
        });

        setIssues(issues.map(i => i.id === issueId ? { ...i, priority: newPriorityScore } : i));
        toast({
            title: `Issue Priority Updated to ${newPriorityScore}`,
            description: reasoning,
        });

    } catch(e) {
        console.error("Failed to re-prioritize issue", e);
        toast({
            title: "AI Re-prioritization Failed",
            description: "Could not update priority via AI. Please adjust manually if needed.",
            variant: "destructive"
        })
    }
  };

  const getAiRouting = async (issue: Issue) => {
    setIsAiLoading(true);
    setIsAiModalOpen(true);
    setAiSuggestion(null);
    try {
      const suggestion = await routeReport({
        description: issue.text,
        category: issue.category,
        location: issue.location,
      });
      setAiSuggestion(suggestion);
    } catch(e) {
        console.error(e);
        toast({
            title: "AI Suggestion Failed",
            description: "Could not get a suggestion from the AI. Please assign manually.",
            variant: "destructive"
        })
        setIsAiModalOpen(false);
    } finally {
        setIsAiLoading(false);
    }
  };

  const applyAiSuggestion = (issueId: string) => {
    if (aiSuggestion) {
      handleDeptChange(issueId, aiSuggestion.department);
      toast({
        title: "Department Assigned",
        description: `Issue ${issueId} assigned to ${aiSuggestion.department}.`
      })
    }
    setIsAiModalOpen(false);
  }

  const filteredIssues = issues
    .filter(issue => 
      (filters.category === 'all' || issue.category === filters.category) &&
      (issue.location.toLowerCase().includes(filters.location.toLowerCase()))
    )
    .sort((a, b) => {
      const key = sort.key as keyof Issue;
      let valA = a[key];
      let valB = b[key];
      if (key === 'priority') {
          valA = a.priority;
          valB = b.priority;
      }

      if (valA === undefined || valB === undefined) return 0;

      if (valA < valB) return sort.order === 'asc' ? -1 : 1;
      if (valA > valB) return sort.order === 'asc' ? 1 : -1;
      return 0;
    });

  const handleSort = (key: string) => {
    if (sort.key === key) {
      setSort({ key, order: sort.order === 'asc' ? 'desc' : 'asc' });
    } else {
      setSort({ key, order: 'desc' });
    }
  };


  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-2">
        <Input
          placeholder="Filter by location..."
          value={filters.location}
          onChange={(event) => setFilters({...filters, location: event.target.value})}
          className="max-w-sm"
        />
        <Select
          onValueChange={(value) => setFilters({...filters, category: value})}
          defaultValue="all"
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {issueCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('priority')}>
                  Priority <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Verification</TableHead>
              <TableHead>Assigned Dept.</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredIssues.map((issue) => (
              <TableRow key={issue.id} className={issue.verified === false ? 'bg-destructive/10' : ''}>
                <TableCell className="font-medium">{issue.id}</TableCell>
                <TableCell><Badge variant="outline">{issue.category}</Badge></TableCell>
                <TableCell>{issue.location}</TableCell>
                <TableCell>{issue.priority}</TableCell>
                <TableCell>
                  <Select value={issue.status} onValueChange={(value) => handleStatusChange(issue.id, value as IssueStatus)}>
                    <SelectTrigger className="w-36 h-8">
                       <SelectValue>
                         <Badge className={statusColors[issue.status]}>{issue.status}</Badge>
                       </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {Object.keys(statusColors).map(status => (
                            <SelectItem key={status} value={status}>
                                <Badge className={statusColors[status as IssueStatus]}>{status}</Badge>
                            </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <Button variant="outline" size="sm" className='w-32 justify-start'>
                             {issue.verified === true && <><Check className="mr-2 h-4 w-4 text-green-600"/> Verified</>}
                             {issue.verified === false && <><X className="mr-2 h-4 w-4 text-red-600"/> Invalid</>}
                             {issue.verified === undefined && <><ShieldQuestion className="mr-2 h-4 w-4 text-gray-500"/> Unreviewed</>}
                           </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onSelect={() => handleVerification(issue.id, true)}>
                                <Check className="mr-2 h-4 w-4 text-green-600"/> Mark as Verified
                            </DropdownMenuItem>
                             <DropdownMenuItem onSelect={() => handleVerification(issue.id, false)}>
                                <X className="mr-2 h-4 w-4 text-red-600"/> Mark as Invalid
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
                <TableCell>
                  <Select value={issue.department || ''} onValueChange={(value) => handleDeptChange(issue.id, value as string)}>
                    <SelectTrigger className="w-40 h-8">
                       <SelectValue placeholder="Unassigned" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">Unassigned</SelectItem>
                        {departments.map(dept => (
                            <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => getAiRouting(issue)}>
                        <Bot className="mr-2 h-4 w-4"/>
                        Auto-Assign (AI)
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">Delete Issue</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Dialog open={isAiModalOpen} onOpenChange={setIsAiModalOpen}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="font-headline flex items-center gap-2"><Bot /> AI Routing Suggestion</DialogTitle>
                        <DialogDescription>
                          Based on the issue details, our AI recommends the following department.
                        </DialogDescription>
                      </DialogHeader>
                      {isAiLoading ? <div className='py-8 text-center'>Loading AI suggestion...</div> : 
                      aiSuggestion && (
                        <div className="space-y-4">
                            <div className='rounded-lg border bg-muted p-4'>
                                <p className='text-sm text-muted-foreground'>Recommended Department</p>
                                <p className='text-lg font-semibold text-primary'>{aiSuggestion.department}</p>
                            </div>
                            <div className='rounded-lg border p-4'>
                                <p className='text-sm text-muted-foreground'>Reasoning</p>
                                <p>{aiSuggestion.reason}</p>
                            </div>
                        </div>
                      )}
                      <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsAiModalOpen(false)}>Cancel</Button>
                        <Button onClick={() => applyAiSuggestion(issue.id)} disabled={isAiLoading || !aiSuggestion}>
                          Assign to {aiSuggestion?.department}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
