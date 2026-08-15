import { useQuery } from "@tanstack/react-query";
import { getOrders } from "@/api/orders";
import { getCustomers } from "@/api/customers";
import { getProducts } from "@/api/products";
import type { Order } from "@/types/order";

const getOrderTotal = (order: Order) =>
  order.items.reduce(
    (total, item) => total + Number(item.unit_price) * item.quantity,
    0,
  );

export interface DashboardChartPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  pendingOrders: number;
  totalProducts: number;
  revenueChangePercent: number | null;
  ordersChangePercent: number | null;
  chartData: DashboardChartPoint[];
}

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async (): Promise<DashboardStats> => {
      const [ordersRes, customers] = await Promise.all([
        getOrders(),
        getCustomers(),
      ]);

      const orders = ordersRes.data;

      // Paginate through all products
      const allProducts = [];
      let page = 1;
      let hasNextPage = true;

      while (hasNextPage) {
        const response = await getProducts({ page });
        allProducts.push(...response.data.results);

        if (response.data.next) {
          page += 1;
        } else {
          hasNextPage = false;
        }
      }

      const completedOrders = orders.filter((o) => o.payment_status === "C");
      const totalRevenue = completedOrders.reduce(
        (sum, o) => sum + getOrderTotal(o),
        0,
      );
      const pendingOrders = orders.filter((o) => o.payment_status === "P").length;

      // Group orders by date for the chart
      const dateMap = new Map<string, { revenue: number; orders: number }>();

      for (const order of orders) {
        const date = order.placed_at.split("T")[0];
        const existing = dateMap.get(date) ?? { revenue: 0, orders: 0 };
        existing.orders += 1;

        if (order.payment_status === "C") {
          existing.revenue += getOrderTotal(order);
        }

        dateMap.set(date, existing);
      }

      const chartData = Array.from(dateMap.entries())
        .map(([date, values]) => ({ date, ...values }))
        .sort((a, b) => a.date.localeCompare(b.date));

      // Month-over-month comparison
      const now = new Date();
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

      const thisMonthOrders = orders.filter(
        (o) => new Date(o.placed_at) >= thisMonthStart,
      );
      const lastMonthOrders = orders.filter((o) => {
        const d = new Date(o.placed_at);
        return d >= lastMonthStart && d <= lastMonthEnd;
      });

      const thisMonthRevenue = thisMonthOrders
        .filter((o) => o.payment_status === "C")
        .reduce((sum, o) => sum + getOrderTotal(o), 0);

      const lastMonthRevenue = lastMonthOrders
        .filter((o) => o.payment_status === "C")
        .reduce((sum, o) => sum + getOrderTotal(o), 0);

      const revenueChangePercent =
        lastMonthRevenue > 0
          ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
          : null;

      const ordersChangePercent =
        lastMonthOrders.length > 0
          ? ((thisMonthOrders.length - lastMonthOrders.length) /
              lastMonthOrders.length) *
            100
          : null;

      return {
        totalRevenue,
        totalOrders: orders.length,
        totalCustomers: customers.length,
        pendingOrders,
        totalProducts: allProducts.length,
        revenueChangePercent,
        ordersChangePercent,
        chartData,
      };
    },
    staleTime: 1000 * 60 * 2,
  });
};