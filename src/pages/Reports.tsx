
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { usePharmacy } from "@/contexts/PharmacyContext";
import { format, subDays, subMonths, isWithinInterval } from "date-fns";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { Download, TrendingUp, List, PieChart } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function Reports() {
  const { transactions, medications, suppliers } = usePharmacy();
  const [dateRange, setDateRange] = useState("7days");
  const [activeTab, setActiveTab] = useState("sales");
  
  // Filter transactions by date
  const getDateRangeFilter = () => {
    const today = new Date();
    switch (dateRange) {
      case "7days":
        return subDays(today, 7);
      case "30days":
        return subDays(today, 30);
      case "90days":
        return subDays(today, 90);
      case "6months":
        return subMonths(today, 6);
      case "1year":
        return subMonths(today, 12);
      default:
        return subDays(today, 7);
    }
  };
  
  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.createdAt);
    const startDate = getDateRangeFilter();
    return isWithinInterval(transactionDate, { start: startDate, end: new Date() });
  });
  
  // Sales data for charts
  const salesData = filteredTransactions
    .filter(t => t.type === 'sale')
    .reduce((acc: any[], transaction) => {
      const date = format(new Date(transaction.createdAt), "MMM dd");
      const existingDay = acc.find(item => item.date === date);
      
      if (existingDay) {
        existingDay.total += transaction.total;
        existingDay.count += 1;
      } else {
        acc.push({
          date,
          total: transaction.total,
          count: 1
        });
      }
      
      return acc;
    }, []);
  
  // Top selling medications
  const topSellingData = filteredTransactions
    .filter(t => t.type === 'sale')
    .flatMap(t => t.items)
    .reduce((acc: any[], item) => {
      const existingItem = acc.find(i => i.name === item.medicationName);
      
      if (existingItem) {
        existingItem.quantity += item.quantity;
        existingItem.revenue += item.subtotal;
      } else {
        acc.push({
          name: item.medicationName,
          quantity: item.quantity,
          revenue: item.subtotal
        });
      }
      
      return acc;
    }, [])
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);
  
  // Payment methods data
  const paymentMethodData = filteredTransactions
    .filter(t => t.type === 'sale')
    .reduce((acc: any[], transaction) => {
      const method = transaction.paymentMethod;
      const existingMethod = acc.find(i => i.name === method);
      
      if (existingMethod) {
        existingMethod.value += transaction.total;
        existingMethod.count += 1;
      } else {
        acc.push({
          name: method,
          value: transaction.total,
          count: 1
        });
      }
      
      return acc;
    }, []);
  
  // Inventory status
  const inventoryData = {
    totalMedications: medications.length,
    lowStock: medications.filter(med => med.stock <= 10).length,
    expiringWithin30Days: medications.filter(med => {
      const expiry = new Date(med.expiryDate);
      const today = new Date();
      const differenceInTime = expiry.getTime() - today.getTime();
      const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
      return differenceInDays <= 30 && differenceInDays > 0;
    }).length,
    stockValue: medications.reduce((total, med) => total + (med.stock * med.costPrice), 0),
    retailValue: medications.reduce((total, med) => total + (med.stock * med.price), 0)
  };
  
  // Category breakdown
  const categoryData = medications.reduce((acc: any[], med) => {
    const existingCategory = acc.find(c => c.name === med.category);
    
    if (existingCategory) {
      existingCategory.count += 1;
      existingCategory.value += med.stock;
    } else {
      acc.push({
        name: med.category,
        count: 1,
        value: med.stock
      });
    }
    
    return acc;
  }, []);
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#5DADE2'];
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">
          Generate and analyze pharmacy performance reports
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-start justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full sm:w-auto">
            <TabsTrigger value="sales">
              <TrendingUp className="h-4 w-4 mr-2" />
              Sales
            </TabsTrigger>
            <TabsTrigger value="inventory">
              <List className="h-4 w-4 mr-2" />
              Inventory
            </TabsTrigger>
            <TabsTrigger value="categories">
              <PieChart className="h-4 w-4 mr-2" />
              Categories
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="6months">Last 6 months</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      <TabsContent value="sales" className="m-0">
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Sales Overview</CardTitle>
              <CardDescription>
                Total sales for the selected period
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={salesData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis 
                    tickFormatter={(value) => `$${value}`}
                    domain={[0, 'dataMax + 100']}
                  />
                  <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="total"
                    name="Revenue"
                    stroke="#0088FE"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Top Selling Medications</CardTitle>
              <CardDescription>
                Most frequently sold medications
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              {topSellingData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topSellingData}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      width={100}
                      tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value} 
                    />
                    <Tooltip formatter={(value) => [value, 'Quantity']} />
                    <Legend />
                    <Bar 
                      dataKey="quantity" 
                      name="Units Sold" 
                      fill="#00C49F" 
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No sales data available</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Payment Methods</CardTitle>
              <CardDescription>
                Distribution of payment methods
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              {paymentMethodData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <Pie
                      data={paymentMethodData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {paymentMethodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`$${value}`, 'Amount']}
                    />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No payment data available</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Sales Summary</CardTitle>
              <CardDescription>
                Key metrics for the selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="text-muted-foreground text-sm">Total Revenue</div>
                    <div className="text-2xl font-bold mt-1">
                      {formatCurrency(filteredTransactions.reduce((sum, t) => t.type === 'sale' ? sum + t.total : sum, 0))}
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="text-muted-foreground text-sm">Number of Sales</div>
                    <div className="text-2xl font-bold mt-1">
                      {filteredTransactions.filter(t => t.type === 'sale').length}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="text-muted-foreground text-sm">Avg. Sale Value</div>
                    <div className="text-2xl font-bold mt-1">
                      {formatCurrency(
                        filteredTransactions.filter(t => t.type === 'sale').length > 0
                          ? filteredTransactions.reduce((sum, t) => t.type === 'sale' ? sum + t.total : sum, 0) / 
                            filteredTransactions.filter(t => t.type === 'sale').length
                          : 0
                      )}
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="text-muted-foreground text-sm">Units Sold</div>
                    <div className="text-2xl font-bold mt-1">
                      {filteredTransactions
                        .filter(t => t.type === 'sale')
                        .flatMap(t => t.items)
                        .reduce((sum, item) => sum + item.quantity, 0)}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      
      <TabsContent value="inventory" className="m-0">
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Inventory Status</CardTitle>
              <CardDescription>
                Current inventory health overview
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="text-muted-foreground text-sm">Total Medications</div>
                    <div className="text-2xl font-bold mt-1">
                      {inventoryData.totalMedications}
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="text-muted-foreground text-sm">Low Stock Items</div>
                    <div className="text-2xl font-bold mt-1 text-amber-500">
                      {inventoryData.lowStock}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="text-muted-foreground text-sm">Expiring Soon</div>
                    <div className="text-2xl font-bold mt-1 text-red-500">
                      {inventoryData.expiringWithin30Days}
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="text-muted-foreground text-sm">Total Suppliers</div>
                    <div className="text-2xl font-bold mt-1">
                      {suppliers.length}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="text-muted-foreground text-sm">Inventory Cost Value</div>
                    <div className="text-2xl font-bold mt-1">
                      {formatCurrency(inventoryData.stockValue)}
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="text-muted-foreground text-sm">Retail Value</div>
                    <div className="text-2xl font-bold mt-1">
                      {formatCurrency(inventoryData.retailValue)}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Stock Level Distribution</CardTitle>
              <CardDescription>
                Medication stock level breakdown
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: "Low Stock (≤10)", value: inventoryData.lowStock },
                    { name: "Healthy (11-50)", value: medications.filter(m => m.stock > 10 && m.stock <= 50).length },
                    { name: "Excess (>50)", value: medications.filter(m => m.stock > 50).length }
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="value" 
                    name="Number of Medications" 
                    fill="#8884d8" 
                    radius={[4, 4, 0, 0]}
                  >
                    <Cell fill="#f87171" />
                    <Cell fill="#60a5fa" />
                    <Cell fill="#34d399" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Inventory Valuation</CardTitle>
              <CardDescription>
                Cost vs. Retail Value by Category
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={medications.reduce((acc: any[], med) => {
                    const existingCategory = acc.find(c => c.name === med.category);
                    
                    if (existingCategory) {
                      existingCategory.cost += med.stock * med.costPrice;
                      existingCategory.retail += med.stock * med.price;
                    } else {
                      acc.push({
                        name: med.category,
                        cost: med.stock * med.costPrice,
                        retail: med.stock * med.price
                      });
                    }
                    
                    return acc;
                  }, [])}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `$${value}`} />
                  <Tooltip formatter={(value) => [`$${value}`, '']} />
                  <Legend />
                  <Bar dataKey="cost" name="Cost Value" fill="#8884d8" radius={[4, 0, 0, 4]} />
                  <Bar dataKey="retail" name="Retail Value" fill="#82ca9d" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      
      <TabsContent value="categories" className="m-0">
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Category Breakdown</CardTitle>
              <CardDescription>
                Medications by category
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="name"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, 'Count']} />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No category data available</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Stock by Category</CardTitle>
              <CardDescription>
                Inventory stock levels by category
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryData}
                  margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="value" 
                    name="Units in Stock" 
                    fill="#8884d8" 
                    radius={[4, 4, 0, 0]}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Category Performance</CardTitle>
              <CardDescription>
                Sales performance by medication category
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={medications.reduce((acc: any[], med) => {
                    // Get all sales for this medication
                    const sales = filteredTransactions
                      .filter(t => t.type === 'sale')
                      .flatMap(t => t.items)
                      .filter(item => item.medicationId === med.id)
                      .reduce((sum, item) => sum + item.quantity, 0);
                    
                    const revenue = filteredTransactions
                      .filter(t => t.type === 'sale')
                      .flatMap(t => t.items)
                      .filter(item => item.medicationId === med.id)
                      .reduce((sum, item) => sum + item.subtotal, 0);
                    
                    const existingCategory = acc.find(c => c.name === med.category);
                    
                    if (existingCategory) {
                      existingCategory.sales += sales;
                      existingCategory.revenue += revenue;
                    } else {
                      acc.push({
                        name: med.category,
                        sales: sales,
                        revenue: revenue
                      });
                    }
                    
                    return acc;
                  }, [])}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" tickFormatter={(value) => `${value}`} />
                  <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `$${value}`} />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="sales" name="Units Sold" fill="#8884d8" radius={[4, 0, 0, 4]} />
                  <Bar yAxisId="right" dataKey="revenue" name="Revenue" fill="#82ca9d" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </div>
  );
}
