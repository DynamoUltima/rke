import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const revenueData = [
  { month: "Jan", revenue: 285000, expenses: 120000, profit: 165000 },
  { month: "Feb", revenue: 320000, expenses: 135000, profit: 185000 },
  { month: "Mar", revenue: 245000, expenses: 115000, profit: 130000 },
  { month: "Apr", revenue: 410000, expenses: 155000, profit: 255000 },
  { month: "May", revenue: 375000, expenses: 142000, profit: 233000 },
  { month: "Jun", revenue: 465000, expenses: 168000, profit: 297000 },
];

const propertyTypeData = [
  { name: "Apartments", value: 45 },
  { name: "Houses", value: 30 },
  { name: "Condos", value: 15 },
  { name: "Villas", value: 10 },
];

const occupancyData = [
  { week: "Week 1", rate: 85 },
  { week: "Week 2", rate: 88 },
  { week: "Week 3", rate: 82 },
  { week: "Week 4", rate: 90 },
  { week: "Week 5", rate: 87 },
  { week: "Week 6", rate: 92 },
];

const regionalData = [
  { region: "Miami, FL", sales: 28 },
  { region: "New York, NY", sales: 24 },
  { region: "Austin, TX", sales: 21 },
  { region: "Los Angeles, CA", sales: 19 },
  { region: "Seattle, WA", sales: 16 },
  { region: "Chicago, IL", sales: 14 },
];

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"];

export function AnalyticsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2>Analytics</h2>
        <p className="text-muted-foreground">
          Comprehensive insights into your real estate business
        </p>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                name="Revenue"
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                name="Expenses"
              />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="hsl(var(--chart-3))"
                strokeWidth={2}
                name="Profit"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Property Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={propertyTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {propertyTypeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Occupancy Rate Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={occupancyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="hsl(var(--chart-4))"
                  strokeWidth={3}
                  name="Occupancy %"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Sales by Region</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={regionalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="sales"
                  fill="hsl(var(--chart-2))"
                  name="Sales"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Avg. Sale Price</p>
            <p className="text-2xl mt-1">$1.2M</p>
            <p className="text-xs text-green-600 mt-1">+8.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Days on Market</p>
            <p className="text-2xl mt-1">28</p>
            <p className="text-xs text-green-600 mt-1">-12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Conversion Rate</p>
            <p className="text-2xl mt-1">32%</p>
            <p className="text-xs text-green-600 mt-1">+5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Client Satisfaction</p>
            <p className="text-2xl mt-1">4.8/5</p>
            <p className="text-xs text-green-600 mt-1">+0.2 from last month</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
