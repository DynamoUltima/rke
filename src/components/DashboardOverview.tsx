import {
  Home,
  DollarSign,
  TrendingUp,
  FileText,
  ArrowUp,
  ArrowDown,
  Plus,
  UserPlus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const kpiData = [
  {
    title: "Total Properties",
    value: "1,234",
    change: "+12.5%",
    isPositive: true,
    icon: Home,
  },
  {
    title: "Properties Sold",
    value: "156",
    change: "+8.2%",
    isPositive: true,
    icon: DollarSign,
  },
  {
    title: "Active Listings",
    value: "482",
    change: "-3.1%",
    isPositive: false,
    icon: TrendingUp,
  },
  {
    title: "Pending Requests",
    value: "24",
    change: "+15.3%",
    isPositive: true,
    icon: FileText,
  },
];

const salesData = [
  { month: "Jan", sales: 45, revenue: 285000 },
  { month: "Feb", sales: 52, revenue: 320000 },
  { month: "Mar", sales: 38, revenue: 245000 },
  { month: "Apr", sales: 65, revenue: 410000 },
  { month: "May", sales: 58, revenue: 375000 },
  { month: "Jun", sales: 72, revenue: 465000 },
];

const agentPerformance = [
  { name: "Sarah Johnson", sales: 28 },
  { name: "Mike Chen", sales: 24 },
  { name: "Emma Davis", sales: 21 },
  { name: "James Wilson", sales: 19 },
  { name: "Lisa Anderson", sales: 16 },
];

const recentActivities = [
  {
    id: 1,
    action: "New property listed",
    property: "Ocean View Apartment",
    time: "5 minutes ago",
    user: "Sarah Johnson",
  },
  {
    id: 2,
    action: "Sale completed",
    property: "Downtown Condo",
    time: "1 hour ago",
    user: "Mike Chen",
  },
  {
    id: 3,
    action: "Client inquiry",
    property: "Suburban House",
    time: "2 hours ago",
    user: "Emma Davis",
  },
  {
    id: 4,
    action: "Property updated",
    property: "Luxury Villa",
    time: "3 hours ago",
    user: "James Wilson",
  },
  {
    id: 5,
    action: "New client registered",
    property: "N/A",
    time: "5 hours ago",
    user: "Lisa Anderson",
  },
];

export function DashboardOverview() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Dashboard Overview</h2>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Plus className="size-4 mr-2" />
            Add Property
          </Button>
          <Button variant="outline">
            <UserPlus className="size-4 mr-2" />
            Assign Agent
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  {kpi.title}
                </CardTitle>
                <Icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{kpi.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  {kpi.isPositive ? (
                    <ArrowUp className="size-3 text-green-600" />
                  ) : (
                    <ArrowDown className="size-3 text-red-600" />
                  )}
                  <span
                    className={`text-xs ${
                      kpi.isPositive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {kpi.change}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    vs last month
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  name="Sales"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Agent Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={agentPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="hsl(var(--chart-2))" name="Sales" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start justify-between border-b pb-4 last:border-b-0 last:pb-0"
              >
                <div className="space-y-1">
                  <p>
                    <span className="text-muted-foreground">
                      {activity.action}:
                    </span>{" "}
                    {activity.property}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    by {activity.user}
                  </p>
                </div>
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
