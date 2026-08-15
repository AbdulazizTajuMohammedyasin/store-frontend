import { SectionCards } from "@/components/section-cards";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { useDashboardStats } from "@/hooks/useDashboardStats";

export default function DashboardPage() {
  const { data: stats, isLoading, isError } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        Loading dashboard...
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="flex h-64 items-center justify-center text-destructive">
        Failed to load dashboard data. Make sure you are logged in as staff.
      </div>
    );
  }

  return (
    <>
      <SectionCards stats={stats} />
      <ChartAreaInteractive chartData={stats.chartData} />
    </>
  );
}
