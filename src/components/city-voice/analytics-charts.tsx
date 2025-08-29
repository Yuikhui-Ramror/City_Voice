'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, Pie, PieChart, Cell } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import { mockIssues } from '@/lib/data';

const issuesByDay = mockIssues.reduce((acc, issue) => {
    const date = new Date(issue.timestamp).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
}, {} as Record<string, number>);

const chartDataTrends = Object.entries(issuesByDay).map(([date, count]) => ({ date, count })).reverse();

const issuesByCategory = mockIssues.reduce((acc, issue) => {
    acc[issue.category] = (acc[issue.category] || 0) + 1;
    return acc;
}, {} as Record<string, number>);

const chartDataCategory = Object.entries(issuesByCategory).map(([category, count]) => ({ name: category, value: count, fill: `var(--color-${category.replace(/\s/g, '')})`}));

const chartConfigCategory: ChartConfig = issueCategories.reduce((acc, category, index) => {
    acc[category.replace(/\s/g, '')] = {
        label: category,
        color: `hsl(var(--chart-${(index % 5) + 1}))`
    };
    return acc;
}, {} as ChartConfig);

const issuesByDept = mockIssues.filter(i => i.department).reduce((acc, issue) => {
    acc[issue.department!] = (acc[issue.department!] || 0) + 1;
    return acc;
}, {} as Record<string, number>);

const chartDataDept = Object.entries(issuesByDept).map(([dept, count]) => ({ name: dept, count, fill: `var(--color-${dept.replace(/\s/g, '')})` }));


export function AnalyticsCharts() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle className="font-headline">Issue Submission Trends</CardTitle>
          <CardDescription>Daily reports over the last 10 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{ count: { label: 'Issues', color: 'hsl(var(--primary))' } }}>
            <LineChart
              data={chartDataTrends}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} dot={true}/>
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="col-span-3">
        <CardHeader>
          <CardTitle className="font-headline">Issues by Category</CardTitle>
          <CardDescription>Distribution of all reported issues</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
            <ChartContainer config={chartConfigCategory} className="mx-auto aspect-square max-h-[300px]">
                <PieChart>
                    <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                    <Pie data={chartDataCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false} label={({
                        cx,
                        cy,
                        midAngle,
                        innerRadius,
                        outerRadius,
                        value,
                        index,
                      }) => {
                        const RADIAN = Math.PI / 180
                        const radius = 10 + innerRadius + (outerRadius - innerRadius)
                        const x = cx + radius * Math.cos(-midAngle * RADIAN)
                        const y = cy + radius * Math.sin(-midAngle * RADIAN)
         
                        return (
                          <text
                            x={x}
                            y={y}
                            className="fill-muted-foreground text-xs"
                            textAnchor={x > cx ? "start" : "end"}
                            dominantBaseline="central"
                          >
                            {chartDataCategory[index].name} ({value})
                          </text>
                        )
                      }}
                    >
                        {chartDataCategory.map((entry) => (
                           <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                        ))}
                    </Pie>
                </PieChart>
            </ChartContainer>
        </CardContent>
      </Card>

      <Card className="col-span-7">
        <CardHeader>
          <CardTitle className="font-headline">Departmental Workload</CardTitle>
          <CardDescription>Number of issues assigned to each department.</CardDescription>
        </CardHeader>
        <CardContent>
        <ChartContainer config={chartConfigCategory} className="w-full">
            <BarChart data={chartDataDept} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="count" fill="var(--color-primary)" radius={4} />
            </BarChart>
        </ChartContainer>
        </CardContent>
      </Card>

    </div>
  );
}
