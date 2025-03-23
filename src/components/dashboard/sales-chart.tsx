
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, subDays } from "date-fns";

// Generate mock data for the chart
const generateSalesData = () => {
  const data = [];
  const today = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = subDays(today, i);
    const value = Math.floor(Math.random() * 500) + 200;
    
    data.push({
      date: format(date, "MMM dd"),
      sales: value,
    });
  }
  
  return data;
};

const data = generateSalesData();

export function SalesChart() {
  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Sales Overview</CardTitle>
        <CardDescription>Daily sales for the past month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 0,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
              <XAxis 
                dataKey="date" 
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
                tickMargin={10}
                tick={props => {
                  // Only show every 5th tick to avoid crowding
                  const { x, y, payload } = props;
                  const index = data.findIndex(item => item.date === payload.value);
                  if (index % 5 === 0) {
                    return (
                      <text 
                        x={x} 
                        y={y + 10} 
                        textAnchor="middle" 
                        fill="#888"
                        fontSize={12}
                      >
                        {payload.value}
                      </text>
                    );
                  }
                  return null;
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
                tickMargin={10}
                tick={props => {
                  const { x, y, payload } = props;
                  return (
                    <text 
                      x={x - 5} 
                      y={y} 
                      textAnchor="end" 
                      fill="#888"
                      fontSize={12}
                    >
                      ${payload.value}
                    </text>
                  );
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderRadius: "var(--radius)",
                  border: "1px solid hsl(var(--border))",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
                }}
                labelStyle={{
                  color: "hsl(var(--foreground))",
                  fontWeight: 500,
                  textAlign: "center",
                  padding: "4px 0",
                }}
                itemStyle={{
                  color: "hsl(var(--primary))",
                  fontSize: "14px",
                  padding: "4px 0",
                }}
                formatter={(value) => [`$${value}`, "Sales"]}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#colorSales)"
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
