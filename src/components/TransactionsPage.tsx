import { useState, useMemo } from "react";
import { Filter, Download, Eye, ArrowUpDown } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type Transaction = {
  id: string;
  date: string;
  property: string;
  client: string;
  agent: string;
  amount: string;
  amountNum: number;
  status: string;
};

const initialTransactions: Transaction[] = [
  {
    id: "TXN-001",
    date: "2024-10-14",
    property: "Ocean View Apartment",
    client: "John Smith",
    agent: "Sarah Johnson",
    amount: "$850,000",
    amountNum: 850000,
    status: "Completed",
  },
  {
    id: "TXN-002",
    date: "2024-10-13",
    property: "Downtown Condo",
    client: "Emily Brown",
    agent: "Mike Chen",
    amount: "$1,200,000",
    amountNum: 1200000,
    status: "Completed",
  },
  {
    id: "TXN-003",
    date: "2024-10-12",
    property: "Suburban House",
    client: "Michael Johnson",
    agent: "Emma Davis",
    amount: "$650,000",
    amountNum: 650000,
    status: "Pending",
  },
  {
    id: "TXN-004",
    date: "2024-10-11",
    property: "Luxury Villa",
    client: "Sarah Williams",
    agent: "James Wilson",
    amount: "$2,500,000",
    amountNum: 2500000,
    status: "Pending",
  },
  {
    id: "TXN-005",
    date: "2024-10-10",
    property: "Lakefront Property",
    client: "David Lee",
    agent: "Lisa Anderson",
    amount: "$980,000",
    amountNum: 980000,
    status: "Completed",
  },
  {
    id: "TXN-006",
    date: "2024-10-09",
    property: "City Loft",
    client: "Jessica Martinez",
    agent: "Sarah Johnson",
    amount: "$720,000",
    amountNum: 720000,
    status: "Cancelled",
  },
  {
    id: "TXN-007",
    date: "2024-10-08",
    property: "Beachfront Estate",
    client: "Robert Taylor",
    agent: "Mike Chen",
    amount: "$1,800,000",
    amountNum: 1800000,
    status: "Completed",
  },
  {
    id: "TXN-008",
    date: "2024-10-07",
    property: "Mountain Cabin",
    client: "Amanda Wilson",
    agent: "Emma Davis",
    amount: "$450,000",
    amountNum: 450000,
    status: "Pending",
  },
];

type SortField = "id" | "date" | "property" | "amount" | "status";
type SortOrder = "asc" | "desc";

export function TransactionsPage() {
  const [transactions] = useState<Transaction[]>(initialTransactions);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // Filter and sort transactions
  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions.filter((transaction) => {
      const matchesSearch =
        transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.agent.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        transaction.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "id":
          comparison = a.id.localeCompare(b.id);
          break;
        case "date":
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case "property":
          comparison = a.property.localeCompare(b.property);
          break;
        case "amount":
          comparison = a.amountNum - b.amountNum;
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [transactions, searchQuery, statusFilter, sortField, sortOrder]);

  // Calculate summary stats
  const stats = useMemo(() => {
    const total = filteredAndSortedTransactions.length;
    const totalVolume = filteredAndSortedTransactions.reduce(
      (sum, t) => sum + t.amountNum,
      0
    );
    const avgValue = total > 0 ? totalVolume / total : 0;

    return {
      total,
      totalVolume: `$${(totalVolume / 1000000).toFixed(2)}M`,
      avgValue: `$${(avgValue / 1000000).toFixed(2)}M`,
    };
  }, [filteredAndSortedTransactions]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Transactions</h2>
          <p className="text-muted-foreground">
            Track all property transactions and deals
          </p>
        </div>
        <Button variant="outline">
          <Download className="size-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search transactions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm bg-input-background"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredAndSortedTransactions.length} of {transactions.length}{" "}
        transactions
      </p>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("id")}
                  className="hover:bg-transparent p-0"
                >
                  Transaction ID
                  <ArrowUpDown className="ml-2 size-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("date")}
                  className="hover:bg-transparent p-0"
                >
                  Date
                  <ArrowUpDown className="ml-2 size-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("property")}
                  className="hover:bg-transparent p-0"
                >
                  Property
                  <ArrowUpDown className="ml-2 size-4" />
                </Button>
              </TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("amount")}
                  className="hover:bg-transparent p-0"
                >
                  Amount
                  <ArrowUpDown className="ml-2 size-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("status")}
                  className="hover:bg-transparent p-0"
                >
                  Status
                  <ArrowUpDown className="ml-2 size-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedTransactions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-muted-foreground"
                >
                  No transactions found matching your filters
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.id}</TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.property}</TableCell>
                  <TableCell>{transaction.client}</TableCell>
                  <TableCell>{transaction.agent}</TableCell>
                  <TableCell>{transaction.amount}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={getStatusColor(transaction.status)}
                    >
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Eye className="size-4 mr-2" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total Transactions</p>
          <p className="text-2xl mt-1">{stats.total}</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total Volume</p>
          <p className="text-2xl mt-1">{stats.totalVolume}</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Avg Transaction Value</p>
          <p className="text-2xl mt-1">{stats.avgValue}</p>
        </div>
      </div>
    </div>
  );
}
