"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
  CartesianGrid,
} from "recharts";
import {
  DollarSign,
  Calendar,
  Trophy,
  Flame,
  Star,
  CreditCard,
} from "lucide-react";

// All demo data - no real API calls needed
// Mock data types for demonstration
type MonthlyProgress = {
  month: string;
  planned_amount: number;
  paid_amount: number;
  progress_percentage: number;
};

type RepaymentSchedule = {
  debt_id: number;
  debt_name: string;
  amount: number;
  due_date: string;
  is_overdue: boolean;
};

type UserProgress = {
  total_xp: number;
  level: number;
  current_streak: number;
  longest_streak: number;
  total_payments_made: number;
  total_debt_paid: number;
};

type UserReward = {
  badge: {
    name: string;
  } | null;
};

// Demo debt type for consistent typing
type DemoDebt = {
  type: string;
  balance: number;
  name: string;
  minimum_payment?: number;
};

const DashboardPage = () => {
  const [monthlyProgress, setMonthlyProgress] = useState<MonthlyProgress[]>([]);
  const [upcomingSchedule, setUpcomingSchedule] = useState<RepaymentSchedule[]>(
    []
  );
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [userBadges, setUserBadges] = useState<UserReward[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDemoData = async () => {
      try {
        setLoading(true);

        // Simulate realistic loading time for demo
        await new Promise((resolve) => setTimeout(resolve, 1200));

        // Enhanced mock data for comprehensive demonstration
        const mockProgressData: MonthlyProgress[] = [
          {
            month: "Jul",
            planned_amount: 1430,
            paid_amount: 1200,
            progress_percentage: 84,
          },
          {
            month: "Aug",
            planned_amount: 1430,
            paid_amount: 1650,
            progress_percentage: 115,
          },
          {
            month: "Sep",
            planned_amount: 1430,
            paid_amount: 1380,
            progress_percentage: 96,
          },
          {
            month: "Oct",
            planned_amount: 1430,
            paid_amount: 1750,
            progress_percentage: 122,
          },
          {
            month: "Nov",
            planned_amount: 1430,
            paid_amount: 1290,
            progress_percentage: 90,
          },
          {
            month: "Dec",
            planned_amount: 1430,
            paid_amount: 1850,
            progress_percentage: 129,
          },
        ];

        const mockScheduleData: RepaymentSchedule[] = [
          {
            debt_id: 1,
            debt_name: "Chase Freedom Card",
            amount: 350,
            due_date: "2025-09-20",
            is_overdue: false,
          },
          {
            debt_id: 2,
            debt_name: "Federal Student Loan",
            amount: 280,
            due_date: "2025-09-25",
            is_overdue: false,
          },
          {
            debt_id: 3,
            debt_name: "Toyota Car Financing",
            amount: 425,
            due_date: "2025-09-30",
            is_overdue: false,
          },
          {
            debt_id: 4,
            debt_name: "Personal Loan - Wells Fargo",
            amount: 200,
            due_date: "2025-09-15",
            is_overdue: true,
          },
          {
            debt_id: 5,
            debt_name: "Discover Credit Card",
            amount: 175,
            due_date: "2025-10-05",
            is_overdue: false,
          },
          {
            debt_id: 6,
            debt_name: "Home Mortgage",
            amount: 1650,
            due_date: "2025-10-01",
            is_overdue: false,
          },
          {
            debt_id: 7,
            debt_name: "Medical Bill - City Hospital",
            amount: 100,
            due_date: "2025-09-18",
            is_overdue: true,
          },
          {
            debt_id: 8,
            debt_name: "Business Loan",
            amount: 320,
            due_date: "2025-10-10",
            is_overdue: false,
          },
        ];

        const mockUserProgress: UserProgress = {
          total_xp: 3250,
          level: 15,
          current_streak: 23,
          longest_streak: 67,
          total_payments_made: 189,
          total_debt_paid: 41200,
        };

        const mockUserBadges: UserReward[] = [
          { badge: { name: "First Payment" } },
          { badge: { name: "Consistent Payer" } },
          { badge: { name: "Debt Destroyer" } },
          { badge: { name: "Streak Master" } },
          { badge: { name: "Early Bird" } },
          { badge: { name: "Over Achiever" } },
          { badge: { name: "Milestone Crusher" } },
          { badge: { name: "Financial Warrior" } },
          { badge: { name: "Budget Boss" } },
          { badge: { name: "Payment Pro" } },
          { badge: { name: "Debt Slayer" } },
          { badge: { name: "Money Master" } },
        ];

        setMonthlyProgress(mockProgressData);
        setUpcomingSchedule(mockScheduleData);
        setUserProgress(mockUserProgress);
        setUserBadges(mockUserBadges);
      } catch (error) {
        console.error("Error loading demo data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDemoData();
  }, []);

  // Enhanced demo debt data for comprehensive visualization
  const demoDebts: DemoDebt[] = [
    {
      type: "Credit Card",
      balance: 8500,
      name: "Chase Freedom",
      minimum_payment: 350,
    },
    {
      type: "Student Loan",
      balance: 15200,
      name: "Federal Student Aid",
      minimum_payment: 280,
    },
    {
      type: "Car Loan",
      balance: 12800,
      name: "Toyota Financing",
      minimum_payment: 425,
    },
    {
      type: "Personal Loan",
      balance: 5400,
      name: "Bank Personal Loan",
      minimum_payment: 200,
    },
    {
      type: "Credit Card",
      balance: 3200,
      name: "Discover Card",
      minimum_payment: 175,
    },
    {
      type: "Medical Debt",
      balance: 2100,
      name: "Hospital Bill",
      minimum_payment: 100,
    },
    {
      type: "Mortgage",
      balance: 185000,
      name: "Home Mortgage",
      minimum_payment: 1650,
    },
    {
      type: "Business Loan",
      balance: 8900,
      name: "Small Business Loan",
      minimum_payment: 320,
    },
  ];

  // Use demo data for all calculations
  const activeDebts = demoDebts;

  // Calculate metrics using demo debts
  const totalDebt = activeDebts.reduce(
    (sum: number, debt: DemoDebt) => sum + (debt.balance || 0),
    0
  );

  const totalMinimumPayment = activeDebts.reduce(
    (sum: number, debt: DemoDebt) => {
      return sum + (debt.minimum_payment || 250);
    },
    0
  );

  // Enhanced debt by type for pie chart with better visualization
  const debtByType = activeDebts.reduce(
    (acc: Record<string, number>, debt: DemoDebt) => {
      const type = debt.type || "Other";
      acc[type] = (acc[type] || 0) + (debt.balance || 0);
      return acc;
    },
    {} as Record<string, number>
  );

  const pieChartData = Object.entries(debtByType).map(
    ([type, amount], index) => ({
      name: type,
      value: amount,
      fill: `hsl(var(--chart-${(index % 5) + 1}))`,
    })
  );

  // Enhanced debt progress over time with more realistic data showing improvement
  const debtProgressData = [
    { month: "Jul", current: 241100, projected: 240000 },
    { month: "Aug", current: 238200, projected: 237500 },
    { month: "Sep", current: 235800, projected: 235000 },
    { month: "Oct", current: 232900, projected: 232500 },
    { month: "Nov", current: 230100, projected: 230000 },
    { month: "Dec", current: 227200, projected: 227500 },
    { month: "Jan", current: 224500, projected: 225000 },
    { month: "Feb", current: 221800, projected: 222500 },
  ];

  // Interest rate analysis (radar chart)
  // const interestRateData = debts
  //   .filter(debt => debt.isActive && debt.interest_rate)
  //   .map(debt => ({
  //     debt: debt.debt_name?.substring(0, 10) || 'Debt',
  //     rate: debt.interest_rate,
  //     balance: debt.balance || 0
  //   }));

  // Enhanced payment efficiency data with realistic variations
  const paymentEfficiencyData = [
    { month: "Jul", efficiency: 84, target: 100 },
    { month: "Aug", efficiency: 115, target: 100 },
    { month: "Sep", efficiency: 96, target: 100 },
    { month: "Oct", efficiency: 122, target: 100 },
    { month: "Nov", efficiency: 90, target: 100 },
    { month: "Dec", efficiency: 129, target: 100 },
  ];

  // Chart configurations
  const monthlyProgressConfig: ChartConfig = {
    planned_amount: {
      label: "Planned",
      color: "var(--chart-1)",
    },
    paid_amount: {
      label: "Paid",
      color: "var(--chart-2)",
    },
  };

  const debtProgressConfig: ChartConfig = {
    current: {
      label: "Current Debt",
      color: "var(--chart-1)",
    },
    projected: {
      label: "Projected",
      color: "var(--chart-2)",
    },
  };

  const paymentEfficiencyConfig: ChartConfig = {
    efficiency: {
      label: "Payment Efficiency",
      color: "var(--chart-3)",
    },
    target: {
      label: "Target",
      color: "var(--chart-4)",
    },
  };

  const pieChartConfig: ChartConfig = {
    value: {
      label: "Amount",
    },
  };

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Loading...
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Debt</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalDebt.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {activeDebts.length} active debts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Payments
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalMinimumPayment.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Minimum monthly obligation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Level</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Level {userProgress?.level || 1}
            </div>
            <p className="text-xs text-muted-foreground">
              {userProgress?.total_xp || 0} XP earned
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Payment Streak
            </CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userProgress?.current_streak || 0} days
            </div>
            <p className="text-xs text-muted-foreground">
              Best: {userProgress?.longest_streak || 0} days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Monthly Payment Progress Bar Chart */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Monthly Payment Progress</CardTitle>
            <CardDescription>
              Planned vs actual payments over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={monthlyProgressConfig}>
              <BarChart data={monthlyProgress}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey="planned_amount"
                  fill="var(--color-planned_amount)"
                  radius={8}
                />
                <Bar
                  dataKey="paid_amount"
                  fill="var(--color-paid_amount)"
                  radius={8}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Debt Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Debt Distribution</CardTitle>
            <CardDescription>Breakdown by debt type</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={pieChartConfig}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={pieChartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  strokeWidth={5}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Debt Progress Over Time - Area Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Debt Reduction Progress</CardTitle>
            <CardDescription>
              Current vs projected debt reduction timeline
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={debtProgressConfig}>
              <AreaChart
                data={debtProgressData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <defs>
                  <linearGradient id="fillCurrent" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--chart-1)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--chart-1)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient
                    id="fillProjected"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="var(--chart-2)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-projected)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <Area
                  dataKey="projected"
                  type="natural"
                  fill="url(#fillProjected)"
                  fillOpacity={0.4}
                  stroke="var(--color-projected)"
                  stackId="a"
                />
                <Area
                  dataKey="current"
                  type="natural"
                  fill="url(#fillCurrent)"
                  fillOpacity={0.4}
                  stroke="var(--color-current)"
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Payment Efficiency Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Efficiency</CardTitle>
            <CardDescription>
              How well you&apos;re meeting payment targets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={paymentEfficiencyConfig}>
              <LineChart
                data={paymentEfficiencyData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  dataKey="efficiency"
                  type="monotone"
                  stroke="var(--color-efficiency)"
                  strokeWidth={2}
                  dot={{
                    fill: "var(--color-efficiency)",
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />
                <Line
                  dataKey="target"
                  type="monotone"
                  stroke="var(--color-target)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section - Progress and Upcoming */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Upcoming Payments */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Upcoming Payments</CardTitle>
            <CardDescription>
              Your scheduled payments for the next month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingSchedule.length > 0 ? (
                upcomingSchedule.slice(0, 8).map((payment, index) => (
                  <div key={index} className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {payment.debt_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Due: {new Date(payment.due_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">
                      ${payment.amount.toLocaleString()}
                    </div>
                    {payment.is_overdue && (
                      <span className="ml-2 inline-flex items-center rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-800">
                        Overdue
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No upcoming payments scheduled
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Gamification Progress */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Your Progress & Achievements</CardTitle>
            <CardDescription>
              Level progress and recent achievements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* XP Progress with enhanced calculation */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Level {userProgress?.level || 1} Progress
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {(userProgress?.total_xp || 0) % 100}/100 XP
                  </span>
                </div>
                <Progress
                  value={(userProgress?.total_xp || 0) % 100}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Level {userProgress?.level || 1}</span>
                  <span>Level {(userProgress?.level || 1) + 1}</span>
                </div>
              </div>

              {/* Recent Badges with enhanced display */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium">Recent Badges</h4>
                  <span className="text-xs text-muted-foreground">
                    {userBadges.length} earned
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {userBadges.slice(0, 6).map((userBadge, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-2 transition-all hover:shadow-sm"
                    >
                      <Trophy className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">
                        {userBadge.badge?.name || "Badge"}
                      </span>
                    </div>
                  ))}
                  {userBadges.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      Make your first payment to earn badges!
                    </p>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {userProgress?.total_payments_made || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">Payments Made</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    ${(userProgress?.total_debt_paid || 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">Debt Paid</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
