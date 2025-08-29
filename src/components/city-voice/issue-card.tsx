import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import {
  MessageCircle,
  MoreVertical,
  Share2,
  ThumbsUp,
  MapPin,
} from 'lucide-react';
import type { Issue } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { StatusStepper } from './status-stepper';
import { Separator } from '../ui/separator';

type IssueCardProps = {
  issue: Issue;
};

export function IssueCard({ issue }: IssueCardProps) {
  return (
    <Card className="overflow-hidden bg-card">
      <CardHeader className="flex flex-row items-start gap-4 p-4">
        <Avatar>
          <AvatarImage src={issue.user.avatarUrl} alt={issue.user.name} />
          <AvatarFallback>
            {issue.user.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-semibold">{issue.user.name}</p>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(issue.timestamp, { addSuffix: true })}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Follow Issue</DropdownMenuItem>
            <DropdownMenuItem>Report as Inappropriate</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-4 p-4 pt-0">
        <p className="text-sm">{issue.text}</p>
        {issue.imageUrl && (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={issue.imageUrl}
              alt="Issue image"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              data-ai-hint={issue.imageHint}
            />
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{issue.category}</Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{issue.location}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4 p-4">
        <div className="flex w-full items-center justify-around text-muted-foreground">
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <ThumbsUp className="h-4 w-4" />
            <span className="text-sm">{issue.engagement.likes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm">{issue.engagement.comments}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            <span className="text-sm">{issue.engagement.shares}</span>
          </Button>
        </div>
        <Separator />
        <StatusStepper currentStatus={issue.status} />
      </CardFooter>
    </Card>
  );
}
