"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Debt } from "@/lib/services/debtService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";

const DEBT_TYPES = [
  { value: "credit_card", label: "Credit Card" },
  { value: "personal_loan", label: "Personal Loan" },
  { value: "mortgage", label: "Mortgage" },
  { value: "student_loan", label: "Student Loan" },
  { value: "auto_loan", label: "Auto Loan" },
  { value: "other", label: "Other" },
];

const editDebtSchema = z.object({
  debt_name: z.string().min(1, "Debt name is required"),
  type: z.string().min(1, "Debt type is required"),
  balance: z.string().min(1, "Balance is required"),
  interest_rate: z.string().min(1, "Interest rate is required"),
  minimum_payment: z.string().min(1, "Minimum payment is required"),
  due_date: z.string().optional(),
});

interface EditDebtDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  debt: Debt | null;
  onSave: (data: {
    debt_name: string;
    type: string;
    balance: number;
    interest_rate: number;
    minimum_payment: number;
    due_date?: Date;
  }) => Promise<void>;
}

export function EditDebtDialog({
  open,
  onOpenChange,
  debt,
  onSave,
}: EditDebtDialogProps) {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const form = useForm<z.infer<typeof editDebtSchema>>({
    resolver: zodResolver(editDebtSchema),
    defaultValues: {
      debt_name: "",
      type: "",
      balance: "",
      interest_rate: "",
      minimum_payment: "",
      due_date: selectedDate,
    },
  });

  useEffect(() => {
    if (debt) {
      form.reset({
        debt_name: debt.debt_name || "",
        type: debt.type || "",
        balance: debt.balance?.toString() || "",
        interest_rate: debt.interest_rate?.toString() || "",
        minimum_payment: debt.minimum_payment?.toString() || "",
        due_date: debt.due_date
          ? new Date(debt.due_date).toISOString().split("T")[0]
          : selectedDate,
      });
      setSelectedDate(
        debt.due_date
          ? new Date(debt.due_date).toISOString().split("T")[0]
          : selectedDate
      );
    }
  }, [debt, form]);

  const onSubmit = async (data: z.infer<typeof editDebtSchema>) => {
    try {
      await onSave({
        debt_name: data.debt_name,
        type: data.type,
        balance: parseFloat(data.balance),
        interest_rate: parseFloat(data.interest_rate),
        minimum_payment: parseFloat(data.minimum_payment),
        due_date: selectedDate ? new Date(selectedDate) : undefined,
      });
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Error updating debt:", error);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Debt</DialogTitle>
          <DialogDescription>
            Update the details for &ldquo;{debt?.debt_name}&rdquo;.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Debt Name */}
            <FormField
              control={form.control}
              name="debt_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Debt Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter debt name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Debt Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Debt Type</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                      <SelectContent>
                        {DEBT_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Balance */}
            <FormField
              control={form.control}
              name="balance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Balance</FormLabel>
                  <FormControl>
                    <Input placeholder="0" type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Interest Rate */}
            <FormField
              control={form.control}
              name="interest_rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interest Rate (%)</FormLabel>
                  <FormControl>
                    <Input placeholder="0" type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Minimum Payment */}
            <FormField
              control={form.control}
              name="minimum_payment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Payment</FormLabel>
                  <FormControl>
                    <Input placeholder="0" type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Start Date / Due Date */}
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </FormControl>
            </FormItem>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
