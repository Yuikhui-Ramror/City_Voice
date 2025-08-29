import { AnalyticsCharts } from '@/components/city-voice/analytics-charts';

export default function AnalyticsPage() {
    return (
        <div className="flex flex-col gap-4 md:gap-8 py-4">
            <h1 className="font-headline text-2xl font-semibold">Analytics Dashboard</h1>
            <AnalyticsCharts />
        </div>
    );
}
