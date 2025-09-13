"use client";
import AddDebtSheet from "@/components/dashboard/add-debt-sheet/add-debt-sheet";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState, useMemo } from "react";
import { Debt, debtService } from "@/lib/services/debtService";
import { DebtTable } from "@/components/dashboard/debt-table";
import { EditDebtDialog } from "@/components/dashboard/edit-debt-dialog";
import { DeleteDebtDialog } from "@/components/dashboard/delete-debt-dialog";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

const DEBT_TYPES = [
  { value: "all", label: "All Types" },
  { value: "credit_card", label: "Credit Card" },
  { value: "personal_loan", label: "Personal Loan" },
  { value: "mortgage", label: "Mortgage" },
  { value: "student_loan", label: "Student Loan" },
  { value: "auto_loan", label: "Auto Loan" },
  { value: "other", label: "Other" },
];

const Debts = () => {
  const [userDebts, setUserDebts] = useState<Debt[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState<keyof Debt>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState(true);
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [debtToDelete, setDebtToDelete] = useState<Debt | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    const fetchUserDebts = async () => {
      try {
        setLoading(true);
        const debts = await debtService.getByUserId();
        setUserDebts(debts || []);
      } catch (error) {
        console.error("Error fetching debts:", error);
        setUserDebts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDebts();
  }, []);

  const handleDeleteDebt = async (debt: Debt) => {
    setDebtToDelete(debt);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!debtToDelete?.id) return;

    setIsDeleting(true);
    await debtService.delete(debtToDelete.id);
    setUserDebts((prevDebts) =>
      prevDebts.filter((d) => d.id !== debtToDelete.id)
    );
    setIsDeleting(false);
  };

  const handleEditDebt = (debt: Debt) => {
    setEditingDebt(debt);
    setEditDialogOpen(true);
  };

  const handleEditSave = async (data: {
    debt_name: string;
    type: string;
    balance: number;
    interest_rate: number;
    minimum_payment: number;
  }) => {
    if (!editingDebt?.id) return;

    const updatedData = {
      ...data,
      updated_at: new Date().toISOString(),
    };

    await debtService.update(editingDebt.id, updatedData);

    setUserDebts((prevDebts) =>
      prevDebts.map((debt) =>
        debt.id === editingDebt.id ? { ...debt, ...updatedData } : debt
      )
    );

    setEditingDebt(null);
  };

  const filteredAndSortedDebts = useMemo(() => {
    const filtered = userDebts.filter((debt) => {
      const matchesSearch = debt.debt_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === "all" || debt.type === typeFilter;
      return matchesSearch && matchesType;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (aValue === null && bValue === null) return 0;
      if (aValue === null) return 1;
      if (bValue === null) return -1;

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    return filtered;
  }, [userDebts, searchTerm, typeFilter, sortBy, sortOrder]);

  const handleSort = (column: keyof Debt) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  return (
    <ProtectedRoute>
      <>
        <div className="flex w-full justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Debts</h1>
            <p className="text-muted-foreground">Manage your debts here</p>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button>Add Debt</Button>
            </SheetTrigger>
            <AddDebtSheet />
          </Sheet>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Debt Overview</CardTitle>
            <div className="flex gap-4 mt-4">
              <div className="flex-1">
                <Input
                  placeholder="Search debts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  {DEBT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {filteredAndSortedDebts.length === 0 && !loading ? (
              <div className="flex justify-center items-center py-8">
                <p className="text-muted-foreground">
                  {userDebts.length === 0
                    ? "No debts found. Add your first debt to get started."
                    : "No debts match your current filters."}
                </p>
              </div>
            ) : (
              <DebtTable
                debts={filteredAndSortedDebts}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
                onEdit={handleEditDebt}
                onDelete={handleDeleteDebt}
                loading={loading}
              />
            )}
          </CardContent>
        </Card>

        <EditDebtDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          debt={editingDebt}
          onSave={handleEditSave}
        />

        <DeleteDebtDialog
          open={deleteConfirmOpen}
          onOpenChange={setDeleteConfirmOpen}
          debt={debtToDelete}
          onConfirm={confirmDelete}
          isDeleting={isDeleting}
        />
      </>
    </ProtectedRoute>
  );
};

export default Debts;
