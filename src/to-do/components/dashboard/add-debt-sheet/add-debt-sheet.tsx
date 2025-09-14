"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import React, { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
  SelectGroup,
} from "@/components/ui/select";
import { debtService } from "@/lib/services/debtService";

interface AddDebtSheetProps {
  onDebtAdded?: () => Promise<void>; // callback to refresh table
  onClose?: () => void; // optional callback to close sheet
}

const createDebtSchema = z.object({
  debt_name: z.string().min(1, "Field cannot be empty"),
  type: z.string().min(1, "Field cannot be empty"),
  balance: z.string().min(1, "Balance must be a positive number"),
  interest_rate: z.string().min(1, "Interest rate must be a positive number"),
  minimum_payment: z.string().min(1, "Minimum payment must be a positive number"),
  due_date: z.string().optional(),
});

const DEBT_TYPES = [
  { value: "credit_card", label: "Credit Card" },
  { value: "personal_loan", label: "Personal Loan" },
  { value: "mortgage", label: "Mortgage" },
  { value: "student_loan", label: "Student Loan" },
  { value: "auto_loan", label: "Auto Loan" },
  { value: "other", label: "Other" },
];

const AddDebtSheet: React.FC<AddDebtSheetProps> = ({ onDebtAdded, onClose }) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [saving, setSaving] = useState(false);

  const form = useForm<z.infer<typeof createDebtSchema>>({
    resolver: zodResolver(createDebtSchema),
    defaultValues: {
      debt_name: "",
      type: "",
      balance: "",
      interest_rate: "",
      minimum_payment: "",
      due_date: selectedDate,
    },
  });

  const onSubmit = async (data: z.infer<typeof createDebtSchema>) => {
    setSaving(true);
    try {
      await debtService.create({
        debt_name: data.debt_name,
        type: data.type,
        balance: parseFloat(data.balance),
        interest_rate: parseFloat(data.interest_rate),
        minimum_payment: parseFloat(data.minimum_payment),
        due_date: selectedDate ? new Date(selectedDate) : new Date(),
      });

      // Reset form
      form.reset();
      setSelectedDate(new Date().toISOString().split("T")[0]);

      // Refresh table
      if (onDebtAdded) await onDebtAdded();

      // Close sheet
      if (onClose) onClose();
    } catch (error) {
      console.error("Error creating debt:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Add Debt</SheetTitle>
        <SheetDescription>Add a new debt entry</SheetDescription>
      </SheetHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 px-2">
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
                      <SelectGroup>
                        {DEBT_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
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
                  <Input type="number" placeholder="0" {...field} />
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
                  <Input type="number" step="0.01" placeholder="0" {...field} />
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
                <FormLabel>Minimum Payment Per Month</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Start Date */}
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

          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Add Debt"}
          </Button>
        </form>
      </Form>

      <SheetFooter>
        <SheetClose asChild>
          <Button variant="outline" disabled={saving}>
            Cancel
          </Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  );
};

export default AddDebtSheet;
