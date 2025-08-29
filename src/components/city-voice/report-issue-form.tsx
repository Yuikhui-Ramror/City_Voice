'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { issueCategories } from '@/lib/data';
import { MapPin, Mic, Paperclip, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  category: z.string().min(1, 'Please select a category.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  location: z.string().min(1, 'Please provide a location.'),
  photo: z.any().optional(),
});

export function ReportIssueForm() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: '',
      description: '',
      location: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: 'Issue Reported',
      description: 'Thank you! Your report has been successfully submitted.',
    });
    // Here you would typically close the sheet/dialog
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 py-6">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an issue category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {issueCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us more about the issue..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <FormControl>
                  <Input placeholder="Tag a location" className="pl-9" {...field} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <FormLabel>Attachments</FormLabel>
          <div className="mt-2 flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" className='w-full justify-start'>
              <Paperclip className="mr-2 h-4 w-4" />
              Attach Photo/Video
            </Button>
            <Button type="button" variant="outline" size="icon" className='shrink-0'>
              <Mic className="h-4 w-4" />
              <span className="sr-only">Record voice note</span>
            </Button>
          </div>
        </div>

        <Button type="submit" className="w-full gap-2">
          Submit Report <Send className="h-4 w-4" />
        </Button>
      </form>
    </Form>
  );
}
