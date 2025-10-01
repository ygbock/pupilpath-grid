import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

const feeData = [
  {
    id: 1,
    student: "Alice Johnson",
    admissionNo: "ST001",
    class: "10A",
    amount: 1200,
    dueDate: "2024-03-15",
    status: "Paid",
    paymentDate: "2024-03-10"
  },
  {
    id: 2,
    student: "Bob Smith", 
    admissionNo: "ST002",
    class: "10A",
    amount: 1200,
    dueDate: "2024-03-15",
    status: "Overdue",
    paymentDate: null
  },
  {
    id: 3,
    student: "Carol Davis",
    admissionNo: "ST003", 
    class: "10A",
    amount: 1200,
    dueDate: "2024-03-20",
    status: "Pending",
    paymentDate: null
  },
  {
    id: 4,
    student: "David Wilson",
    admissionNo: "ST004",
    class: "9A", 
    amount: 1100,
    dueDate: "2024-03-15",
    status: "Paid",
    paymentDate: "2024-03-12"
  }
];

const feeStats = [
  {
    title: "Total Outstanding",
    value: "$45,600", 
    icon: DollarSign,
    color: "text-destructive"
  },
  {
    title: "Collected This Month",
    value: "$78,400",
    icon: TrendingUp,
    color: "text-success"
  },
  {
    title: "Overdue Payments",
    value: "23",
    icon: AlertCircle,
    color: "text-warning"
  },
  {
    title: "Collection Rate",
    value: "87%",
    icon: CheckCircle,
    color: "text-success"
  }
];

export function FeesOverview() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-success text-success-foreground";
      case "Overdue":
        return "bg-destructive text-destructive-foreground";
      case "Pending":
        return "bg-warning text-warning-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {feeStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-foreground">Recent Fee Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feeData.map((fee) => (
                    <TableRow key={fee.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-foreground">{fee.student}</div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{fee.admissionNo}</span>
                            <span>•</span>
                            <Badge variant="outline">{fee.class}</Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">${fee.amount}</TableCell>
                      <TableCell className="text-muted-foreground">{fee.dueDate}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(fee.status)}>
                          {fee.status}
                        </Badge>
                        {fee.paymentDate && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Paid: {fee.paymentDate}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {fee.status !== "Paid" && (
                            <Button size="sm">Record Payment</Button>
                          )}
                          <Button variant="outline" size="sm">View Details</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-foreground">Pending Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-warning mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Pending Payments</h3>
                <p className="text-muted-foreground">
                  Students with upcoming fee payment deadlines will be displayed here.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overdue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-foreground">Overdue Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Overdue Payments</h3>
                <p className="text-muted-foreground">
                  Students with overdue fee payments requiring immediate attention.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-foreground">Fee Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <DollarSign className="w-6 h-6" />
                  <span>Monthly Collection Report</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <TrendingUp className="w-6 h-6" />
                  <span>Outstanding Fees Report</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <AlertCircle className="w-6 h-6" />
                  <span>Defaulter List</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <CheckCircle className="w-6 h-6" />
                  <span>Payment History</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}