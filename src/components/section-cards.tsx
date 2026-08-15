"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import type { DashboardStats } from "@/hooks/useDashboardStats";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

const formatPercent = (value: number | null) => {
  if (value === null) return "N/A";
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
};

interface SectionCardsProps {
  stats: DashboardStats;
}

export function SectionCards({ stats }: SectionCardsProps) {
  const cards = [
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      change: stats.revenueChangePercent,
      footer: "From completed orders",
      subtext: "Compared to last month",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      change: stats.ordersChangePercent,
      footer: `${stats.pendingOrders} pending`,
      subtext: "All order statuses",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers.toLocaleString(),
      change: null,
      footer: "Registered customers",
      subtext: "Store database",
    },
    {
      title: "Total Products",
      value: stats.totalProducts.toLocaleString(),
      change: null,
      footer: "Active product catalog",
      subtext: "Across all collections",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {cards.map((card) => {
        const isPositive = card.change !== null && card.change >= 0;
        const isNegative = card.change !== null && card.change < 0;

        return (
          <Card key={card.title} className="@container/card">
            <CardHeader>
              <CardDescription>{card.title}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {card.value}
              </CardTitle>
              {card.change !== null && (
                <CardAction>
                  <Badge variant="outline">
                    {isPositive ? <TrendingUpIcon /> : <TrendingDownIcon />}
                    {formatPercent(card.change)}
                  </Badge>
                </CardAction>
              )}
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {card.footer}
                {isPositive && <TrendingUpIcon className="size-4" />}
                {isNegative && <TrendingDownIcon className="size-4" />}
              </div>
              <div className="text-muted-foreground">{card.subtext}</div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
