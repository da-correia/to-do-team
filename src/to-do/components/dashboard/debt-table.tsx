"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Debt } from "@/lib/services/debtService";

const DEBT_TYPES = [
  { value: "all", label: "All Types" },
  { value: "credit_card", label: "Credit Card" },
  { value: "personal_loan", label: "Personal Loan" },
  { value: "mortgage", label: "Mortgage" },
  { value: "student_loan", label: "Student Loan" },
  { value: "auto_loan", label: "Auto Loan" },
  { value: "other", label: "Other" },
];

interface DebtTableProps {
  debts: Debt[];
  sortBy: keyof Debt;
  sortOrder: "asc" | "desc";
  onSort: (column: keyof Debt) => void;
  onEdit: (debt: Debt) => void;
  onDelete: (debt: Debt) => void;
  loading?: boolean;
}

export function DebtTable({
  debts,
  sortBy,
  sortOrder,
  onSort,
  onEdit,
  onDelete,
  loading = false,
}: DebtTableProps) {
  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "N/A";
    const d = typeof date === "string" ? new Date(date) : date;
    return d instanceof Date && !isNaN(d.getTime())
      ? d.toLocaleDateString()
      : "N/A";
  };

  const getTypeLabel = (type: string | null) => {
    if (!type) return "N/A";
    const typeInfo = DEBT_TYPES.find((t) => t.value === type);
    return typeInfo?.label || type;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-muted-foreground">Loading debts...</p>
      </div>
    );
  }

  if (debts.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-muted-foreground">
          No debts match your current filters.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => onSort("debt_name")}
          >
            Name {sortBy === "debt_name" && (sortOrder === "asc" ? "↑" : "↓")}
          </TableHead>
          <TableHead
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => onSort("type")}
          >
            Type {sortBy === "type" && (sortOrder === "asc" ? "↑" : "↓")}
          </TableHead>
          <TableHead
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => onSort("balance")}
          >
            Balance {sortBy === "balance" && (sortOrder === "asc" ? "↑" : "↓")}
          </TableHead>
          <TableHead
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => onSort("interest_rate")}
          >
            Interest Rate{" "}
            {sortBy === "interest_rate" && (sortOrder === "asc" ? "↑" : "↓")}
          </TableHead>
          <TableHead
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => onSort("minimum_payment")}
          >
            Min Payment{" "}
            {sortBy === "minimum_payment" && (sortOrder === "asc" ? "↑" : "↓")}
          </TableHead>
          <TableHead
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => onSort("due_date")}
          >
            Start Date{" "}
            {sortBy === "due_date" && (sortOrder === "asc" ? "↑" : "↓")}
          </TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {debts.map((debt) => (
          <TableRow key={debt.id}>
            <TableCell className="font-medium">
              {debt.debt_name || "Unnamed Debt"}
            </TableCell>
            <TableCell>{getTypeLabel(debt.type)}</TableCell>
            <TableCell>{formatCurrency(debt.balance)}</TableCell>
            <TableCell>
              {debt.interest_rate !== null ? `${debt.interest_rate}%` : "N/A"}
            </TableCell>
            <TableCell>{formatCurrency(debt.minimum_payment)}</TableCell>
            <TableCell>{formatDate(debt.due_date)}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(debt)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(debt)}
                >
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

